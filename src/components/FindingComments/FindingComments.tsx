import { Button } from "fundbrdet-ui";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { FriendRecord } from "../../hooks/useFriendSearch";
import {
  createFindingComment,
  getFindingCommentAuthorDisplayName,
  useFindingComments,
  type CreateFindingCommentMentionInput,
  type FindingComment,
} from "../../hooks/useFindings";
import "./FindingComments.css";

const COMMON_SMILEYS: Array<[RegExp, string]> = [
  [/(^|\s):-?\)(?=\s|$)/g, "$1🙂"],
  [/(^|\s):-?\((?=\s|$)/g, "$1🙁"],
  [/(^|\s);-?\)(?=\s|$)/g, "$1😉"],
  [/(^|\s):-?D(?=\s|$)/g, "$1😄"],
  [/(^|\s):-?[Pp](?=\s|$)/g, "$1😛"],
  [/(^|\s):-?[Oo](?=\s|$)/g, "$1😮"],
  [/(^|\s)<3(?=\s|$)/g, "$1❤️"],
];

const normalizeCommentContent = (value: string): string => {
  return COMMON_SMILEYS.reduce(
    (content, [pattern, replacement]) => content.replace(pattern, replacement),
    value,
  );
};

const getFriendDisplayName = (friend: FriendRecord): string | null => {
  const fullName = [friend.firstName, friend.lastName]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(" ");

  return fullName || null;
};

const getActiveMentionQuery = (value: string, selectionStart: number) => {
  const prefix = value.slice(0, selectionStart);
  const match = prefix.match(/(^|\s)@(\S*)$/);

  if (!match) {
    return null;
  }

  const query = match[2] ?? "";

  return {
    query,
    startIndex: selectionStart - query.length - 1,
    endIndex: selectionStart,
  };
};

const formatCommentDate = (value: string, locale: string): string => {
  return new Date(value).toLocaleString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const renderCommentContent = (comment: FindingComment) => {
  const fragments: React.ReactNode[] = [];
  const sortedMentions = [...comment.mentions].sort(
    (left, right) => left.startIndex - right.startIndex,
  );
  let cursor = 0;

  sortedMentions.forEach((mention) => {
    const startIndex = Math.max(0, mention.startIndex);
    const endIndex = Math.min(comment.content.length, mention.endIndex);

    if (startIndex < cursor || endIndex <= startIndex) {
      return;
    }

    if (startIndex > cursor) {
      fragments.push(comment.content.slice(cursor, startIndex));
    }

    fragments.push(
      <span
        key={mention.id}
        className={`finding-comments__mention finding-comments__mention--${mention.kind}`}
      >
        {comment.content.slice(startIndex, endIndex)}
      </span>,
    );

    cursor = endIndex;
  });

  if (cursor < comment.content.length) {
    fragments.push(comment.content.slice(cursor));
  }

  return fragments;
};

const shiftMentionRanges = (
  mentions: DraftMention[],
  changedStart: number,
  oldChangedEnd: number,
  delta: number,
  nextValue: string,
): DraftMention[] => {
  return mentions
    .flatMap((mention) => {
      if (mention.endIndex <= changedStart) {
        return [mention];
      }

      if (mention.startIndex >= oldChangedEnd) {
        const shiftedMention = {
          ...mention,
          startIndex: mention.startIndex + delta,
          endIndex: mention.endIndex + delta,
        };

        return nextValue.slice(
          shiftedMention.startIndex,
          shiftedMention.endIndex,
        ) === shiftedMention.text
          ? [shiftedMention]
          : [];
      }

      return [];
    })
    .filter(
      (mention) =>
        nextValue.slice(mention.startIndex, mention.endIndex) === mention.text,
    );
};

const normalizeDraftMentions = (
  sourceDraft: string,
  mentions: DraftMention[],
): CreateFindingCommentMentionInput[] => {
  return mentions.map((mention) => {
    const normalizedPrefix = normalizeCommentContent(
      sourceDraft.slice(0, mention.startIndex),
    );
    const normalizedText = normalizeCommentContent(
      sourceDraft.slice(mention.startIndex, mention.endIndex),
    );
    const startIndex = normalizedPrefix.length;

    return {
      mentionedUserId: mention.mentionedUserId,
      kind: mention.kind,
      label: mention.label,
      startIndex,
      endIndex: startIndex + normalizedText.length,
    };
  });
};

interface MentionCandidate {
  key: string;
  insertLabel: string;
  label: string;
  primaryText: string;
  secondaryText: string | null;
  searchValues: string[];
  mentionedUserId: string;
  kind: "friend" | "finder";
}

interface DraftMention extends CreateFindingCommentMentionInput {
  text: string;
}

export const FindingComments: React.FC<{
  findingId: string | null;
  finderUserId: string | null;
  finderDisplayName: string | null;
  friends: FriendRecord[];
  compact?: boolean;
}> = ({
  findingId,
  finderUserId,
  finderDisplayName,
  friends,
  compact = false,
}) => {
  const { t, i18n } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectionStart, setSelectionStart] = useState(0);
  const [draftMentions, setDraftMentions] = useState<DraftMention[]>([]);
  const { comments, loading, error, refresh } = useFindingComments(findingId);

  const mentionCandidates = useMemo<MentionCandidate[]>(() => {
    const nextCandidates: MentionCandidate[] = [];

    friends.forEach((friend) => {
      const displayName = getFriendDisplayName(friend);

      if (displayName) {
        nextCandidates.push({
          key: `friend-name:${friend.counterpartUserId}`,
          insertLabel: displayName,
          label: displayName,
          primaryText: displayName,
          secondaryText: friend.email,
          searchValues: [displayName, friend.email],
          mentionedUserId: friend.counterpartUserId,
          kind: "friend",
        });
      }

      nextCandidates.push({
        key: `friend-email:${friend.counterpartUserId}`,
        insertLabel: friend.email,
        label: friend.email,
        primaryText: friend.email,
        secondaryText: displayName,
        searchValues: [friend.email, displayName ?? ""],
        mentionedUserId: friend.counterpartUserId,
        kind: "friend",
      });
    });

    if (finderUserId) {
      nextCandidates.unshift({
        key: `finder:${finderUserId}`,
        insertLabel: "finder",
        label: "finder",
        primaryText: "finder",
        secondaryText:
          finderDisplayName || t("comments.finderSuggestionFallback"),
        searchValues: [
          "finder",
          finderDisplayName || "",
          t("comments.finderSuggestionFallback"),
        ],
        mentionedUserId: finderUserId,
        kind: "finder",
      });
    }

    return nextCandidates;
  }, [finderDisplayName, finderUserId, friends, t]);

  const activeMention = useMemo(
    () => getActiveMentionQuery(draft, selectionStart),
    [draft, selectionStart],
  );

  const filteredSuggestions = useMemo(() => {
    if (!activeMention) {
      return [];
    }

    const query = activeMention.query.trim().toLowerCase();

    return mentionCandidates
      .filter((candidate) => {
        if (!query) {
          return true;
        }

        return candidate.searchValues.some((value) =>
          value.toLowerCase().includes(query),
        );
      })
      .slice(0, 6);
  }, [activeMention, mentionCandidates]);

  useEffect(() => {
    setDraft("");
    setDraftMentions([]);
    setSubmitError(null);
    setSelectionStart(0);
  }, [findingId]);

  const handleSelectionChange = () => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    setSelectionStart(textarea.selectionStart ?? textarea.value.length);
  };

  const handleInsertMention = (candidate: MentionCandidate) => {
    const textarea = textareaRef.current;

    if (!textarea || !activeMention) {
      return;
    }

    const before = draft.slice(0, activeMention.startIndex);
    const after = draft.slice(activeMention.endIndex);
    const mentionText = `@${candidate.insertLabel}`;
    const suffix = after.startsWith(" ") ? "" : " ";
    const nextValue = `${before}${mentionText}${suffix}${after}`;
    const nextCaretPosition =
      before.length + mentionText.length + suffix.length;
    const delta = nextValue.length - draft.length;
    const nextMention: DraftMention = {
      mentionedUserId: candidate.mentionedUserId,
      kind: candidate.kind,
      label: candidate.label,
      startIndex: before.length,
      endIndex: before.length + mentionText.length,
      text: mentionText,
    };

    setDraft(nextValue);
    setDraftMentions((currentMentions) => [
      ...shiftMentionRanges(
        currentMentions,
        activeMention.startIndex,
        activeMention.endIndex,
        delta,
        nextValue,
      ),
      nextMention,
    ]);
    setSelectionStart(nextCaretPosition);
    setSubmitError(null);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(nextCaretPosition, nextCaretPosition);
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!findingId || saving) {
      return;
    }

    const normalizedContent = normalizeCommentContent(draft).trim();

    if (!normalizedContent) {
      setSubmitError(t("comments.emptyError"));
      return;
    }

    setSaving(true);
    setSubmitError(null);

    try {
      const normalizedMentions = normalizeDraftMentions(draft, draftMentions);

      await createFindingComment({
        findingId,
        content: normalizedContent,
        mentions: normalizedMentions,
      });
      refresh();
      setDraft("");
      setDraftMentions([]);
      setSelectionStart(0);
    } catch {
      setSubmitError(t("comments.submitFailed"));
    } finally {
      setSaving(false);
    }
  };

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const nextValue = event.target.value;
    const previousValue = draft;
    const nextSelectionStart =
      event.target.selectionStart ?? event.target.value.length;
    let prefixLength = 0;
    let suffixLength = 0;

    while (
      prefixLength < previousValue.length &&
      prefixLength < nextValue.length &&
      previousValue[prefixLength] === nextValue[prefixLength]
    ) {
      prefixLength += 1;
    }

    while (
      suffixLength < previousValue.length - prefixLength &&
      suffixLength < nextValue.length - prefixLength &&
      previousValue[previousValue.length - 1 - suffixLength] ===
        nextValue[nextValue.length - 1 - suffixLength]
    ) {
      suffixLength += 1;
    }

    const oldChangedEnd = previousValue.length - suffixLength;
    const delta = nextValue.length - previousValue.length;

    setDraft(nextValue);
    setDraftMentions((currentMentions) =>
      shiftMentionRanges(
        currentMentions,
        prefixLength,
        oldChangedEnd,
        delta,
        nextValue,
      ),
    );
    setSelectionStart(nextSelectionStart);
    setSubmitError(null);
  };

  const handleMentionMouseDown =
    (candidate: (typeof filteredSuggestions)[number]) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      handleInsertMention(candidate);
    };

  return (
    <section
      className={`finding-comments${compact ? " finding-comments--compact" : ""}`}
    >
      <div className="finding-comments__header">
        <h3 className="finding-comments__title">{t("comments.title")}</h3>
        <span className="finding-comments__count">
          {t("comments.count", { count: comments.length })}
        </span>
      </div>

      <form className="finding-comments__composer" onSubmit={handleSubmit}>
        <div className="finding-comments__composer-card">
          <label className="finding-comments__composer-label">
            <span className="finding-comments__composer-label-text">
              {t("comments.fieldLabel")}
            </span>
            <div className="finding-comments__textarea-wrap">
              <textarea
                ref={textareaRef}
                className="finding-comments__textarea"
                value={draft}
                rows={compact ? 3 : 4}
                placeholder={t("comments.placeholder")}
                onChange={handleTextareaChange}
                onClick={handleSelectionChange}
                onKeyUp={handleSelectionChange}
                onSelect={handleSelectionChange}
              />

              {activeMention && filteredSuggestions.length > 0 ? (
                <div className="finding-comments__suggestions" role="listbox">
                  {filteredSuggestions.map((candidate) => (
                    <button
                      key={candidate.key}
                      type="button"
                      className="finding-comments__suggestion"
                      onMouseDown={handleMentionMouseDown(candidate)}
                    >
                      <span className="finding-comments__suggestion-token">
                        @{candidate.primaryText}
                      </span>
                      {candidate.secondaryText ? (
                        <span className="finding-comments__suggestion-description">
                          {candidate.secondaryText}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </label>

          {submitError ? (
            <p className="finding-comments__feedback" role="alert">
              {submitError}
            </p>
          ) : null}

          <div className="finding-comments__actions">
            <Button type="submit" variant="primary" loading={saving}>
              {t("comments.submit")}
            </Button>
          </div>
        </div>
      </form>

      {error ? (
        <p className="finding-comments__feedback" role="alert">
          {t("comments.loadFailed")}
        </p>
      ) : null}

      {loading && comments.length === 0 ? (
        <p className="finding-comments__state">{t("comments.loading")}</p>
      ) : null}

      {!loading && comments.length === 0 ? (
        <p className="finding-comments__state">{t("comments.empty")}</p>
      ) : null}

      {comments.length > 0 ? (
        <ol className="finding-comments__list">
          {comments.map((comment) => (
            <li key={comment.id} className="finding-comments__item">
              <div className="finding-comments__item-header">
                <span className="finding-comments__author">
                  {getFindingCommentAuthorDisplayName(comment) ||
                    t("comments.unknownAuthor")}
                </span>
                <time
                  className="finding-comments__timestamp"
                  dateTime={comment.createdAt}
                >
                  {formatCommentDate(
                    comment.createdAt,
                    i18n.resolvedLanguage ?? i18n.language,
                  )}
                </time>
              </div>
              <p className="finding-comments__content">
                {renderCommentContent(comment)}
              </p>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
};

export default FindingComments;
