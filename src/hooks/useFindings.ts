import { useEffect, useState } from "react";
import { requireSessionUser } from "./useAuth";
import { supabase } from "../lib/supabase";
import proj4 from "proj4";

const WGS84 = "EPSG:4326";
const UTM32N = "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs";

/**
 * Convert UTM coordinates to WGS84 (lat/lng)
 */
const utmToWGS84 = (easting: number, northing: number): [number, number] => {
  const [lng, lat] = proj4(UTM32N, WGS84, [easting, northing]);
  return [lng, lat];
};

/**
 * Finding interface matching Supabase schema
 */
export interface Finding {
  id: string;
  genstand: string | null;
  materiale: string | null;
  datering: string | null;
  // we store coordinates in the DB as `easting`/`northing` but keep the
  // Danish field names in the UI for historical reasons
  oest: number | null;
  nord: number | null;
  dime_id: string | null;
  image_uids?: string[] | null;
  created_at: string;
  accessLevel: "owner" | "shared";
  ownerUserId: string | null;
  sharedAt: string | null;
  sharedByEmail: string | null;
  ownerFirstName: string | null;
  ownerLastName: string | null;
  coordinatesVisible: boolean;
}

export interface FindingCatalogEntry {
  id: string;
  ownerUserId: string | null;
  ownerEmail: string | null;
  ownerFirstName: string | null;
  ownerLastName: string | null;
  genstand: string | null;
  materiale: string | null;
  datering: string | null;
  dime_id: string | null;
  created_at: string;
}

export interface FindingCommentMention {
  id: string;
  mentionedUserId: string;
  kind: "friend" | "finder";
  label: string;
  startIndex: number;
  endIndex: number;
}

export interface FindingComment {
  id: string;
  findingId: string;
  authorUserId: string;
  authorEmail: string | null;
  authorFirstName: string | null;
  authorLastName: string | null;
  content: string;
  createdAt: string;
  mentions: FindingCommentMention[];
}

export interface CreateFindingCommentMentionInput {
  mentionedUserId: string;
  kind: "friend" | "finder";
  label: string;
  startIndex: number;
  endIndex: number;
}

export interface CreateFindingCommentInput {
  findingId: string;
  content: string;
  mentions?: CreateFindingCommentMentionInput[];
}

export interface FindingCatalogResult {
  findings: FindingCatalogEntry[];
  totalCount: number;
}

export interface FindingCatalogPreviewImage {
  findingId: string;
  imageUid: string;
}

export interface FindingShare {
  findingId: string;
  sharedWithUserId: string;
}

export const getFindingOwnerDisplayName = (
  finding: Pick<Finding, "ownerFirstName" | "ownerLastName" | "sharedByEmail">,
): string | null => {
  const fullName = [finding.ownerFirstName, finding.ownerLastName]
    .map((value) => value?.trim() ?? "")
    .filter(Boolean)
    .join(" ");

  return fullName || finding.sharedByEmail || null;
};

const extractImageUid = (value: unknown): string | null => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const candidates = [
    record.uid,
    record.id,
    record.image_uid,
    record.imageUid,
    record.image_id,
    record.imageId,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return null;
};

const normalizeImageUids = (value: unknown): string[] | null => {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    const normalized = value
      .map(extractImageUid)
      .filter((item): item is string => Boolean(item));

    return normalized.length > 0 ? normalized : null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return null;
    }

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        const normalized = parsed
          .map(extractImageUid)
          .filter((item): item is string => Boolean(item));

        return normalized.length > 0 ? normalized : null;
      }
    } catch {
      const normalized = trimmed
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      return normalized.length > 0 ? normalized : null;
    }
  }

  const objectUid = extractImageUid(value);
  if (objectUid) {
    return [objectUid];
  }

  return null;
};

const mapRowToFinding = (row: any): Finding => {
  const accessLevel = row.access_level === "shared" ? "shared" : "owner";
  const oest = row.easting;
  const nord = row.northing;

  return {
    ...row,
    genstand: row.written_name,
    materiale: row.material,
    datering: row.dating,
    oest,
    nord,
    image_uids: normalizeImageUids(
      row.image_uids ??
        row.imageUids ??
        row.image_ids ??
        row.imageIds ??
        row.images,
    ),
    accessLevel,
    ownerUserId: row.owner_user_id ?? row.user_id ?? null,
    sharedAt: row.shared_at ?? null,
    sharedByEmail: row.shared_by_email ?? null,
    ownerFirstName: row.owner_first_name ?? null,
    ownerLastName: row.owner_last_name ?? null,
    coordinatesVisible:
      accessLevel === "owner" ? true : row.coordinates_visible === true,
  } as Finding;
};

const mapRowToFindingCatalogEntry = (row: any): FindingCatalogEntry => {
  return {
    id: row.id,
    ownerUserId: row.owner_user_id ?? null,
    ownerEmail: row.owner_email ?? null,
    ownerFirstName: row.owner_first_name ?? null,
    ownerLastName: row.owner_last_name ?? null,
    genstand: row.written_name ?? null,
    materiale: row.material ?? null,
    datering: row.dating ?? null,
    dime_id: row.dime_id ?? null,
    created_at: row.created_at,
  };
};

const mapRowToFindingCommentMention = (
  row: any,
): FindingCommentMention | null => {
  const mentionedUserId =
    typeof row?.mentionedUserId === "string"
      ? row.mentionedUserId
      : typeof row?.mentioned_user_id === "string"
        ? row.mentioned_user_id
        : null;
  const kind =
    row?.kind === "finder"
      ? "finder"
      : row?.kind === "friend"
        ? "friend"
        : null;
  const label = typeof row?.label === "string" ? row.label : null;
  const startIndex = Number(row?.startIndex ?? row?.start_index);
  const endIndex = Number(row?.endIndex ?? row?.end_index);

  if (
    !mentionedUserId ||
    !kind ||
    !label ||
    !Number.isInteger(startIndex) ||
    !Number.isInteger(endIndex)
  ) {
    return null;
  }

  return {
    id:
      typeof row?.id === "string"
        ? row.id
        : `${mentionedUserId}:${startIndex}:${endIndex}`,
    mentionedUserId,
    kind,
    label,
    startIndex,
    endIndex,
  };
};

const mapRowToFindingComment = (row: any): FindingComment => {
  const mentionsSource: unknown[] = Array.isArray(row.mentions)
    ? row.mentions
    : [];

  return {
    id: row.id,
    findingId: row.finding_id,
    authorUserId: row.author_user_id,
    authorEmail: row.author_email ?? null,
    authorFirstName: row.author_first_name ?? null,
    authorLastName: row.author_last_name ?? null,
    content: row.content ?? "",
    createdAt: row.created_at,
    mentions: mentionsSource
      .map(mapRowToFindingCommentMention)
      .filter(
        (
          mention: FindingCommentMention | null,
        ): mention is FindingCommentMention => Boolean(mention),
      ),
  };
};

export const getFindingCommentAuthorDisplayName = (
  comment: Pick<
    FindingComment,
    "authorFirstName" | "authorLastName" | "authorEmail"
  >,
): string | null => {
  const fullName = [comment.authorFirstName, comment.authorLastName]
    .map((value) => value?.trim() ?? "")
    .filter(Boolean)
    .join(" ");

  return fullName || comment.authorEmail || null;
};

const toCatalogSearchValue = (search: string): string | null => {
  const normalized = search.trim();
  return normalized ? normalized : null;
};

const sortFindings = (findings: Finding[]): Finding[] => {
  return [...findings].sort(
    (left, right) =>
      new Date(right.created_at).getTime() -
      new Date(left.created_at).getTime(),
  );
};

const toNullableNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const imageUploadBaseUrl =
  (import.meta.env.VITE_IMAGE_UPLOAD_BASE_URL as string | undefined) ??
  "https://literally-villas-subscriber-hospital.trycloudflare.com";

export const getFindingImageUrl = (uid: string): string => {
  return `${imageUploadBaseUrl}/images/${uid}`;
};

export const useFindingImageUids = (
  findingId: string | null,
  refreshKey?: unknown,
) => {
  const [imageUids, setImageUids] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!findingId) {
      setImageUids([]);
      setLoading(false);
      setError(null);
      return;
    }

    const load = async () => {
      setLoading(true);

      const { data, error: queryError } = await supabase
        .schema("public")
        .from("imageLinks")
        .select("*")
        .eq("finding_id", findingId);

      if (!isMounted) {
        return;
      }

      if (queryError) {
        setError(queryError.message);
        setImageUids([]);
      } else {
        const normalized = ((data as any[]) ?? [])
          .map((row) => extractImageUid(row))
          .filter((uid): uid is string => Boolean(uid));

        setImageUids(normalized);
        setError(null);
      }

      setLoading(false);
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [findingId, refreshKey]);

  return { imageUids, loading, error };
};

export const uploadFindingImages = async (
  findingId: string,
  images: File[],
): Promise<void> => {
  if (images.length === 0) {
    return;
  }

  const formData = new FormData();
  formData.append("findingId", findingId);

  for (const image of images) {
    formData.append("images", image);
  }

  const response = await fetch(`${imageUploadBaseUrl}/images`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Image upload failed with status ${response.status}`);
  }
};

export const updateCurrentUserFinding = async (
  findingId: string,
  values: Partial<Finding>,
): Promise<void> => {
  const user = await requireSessionUser();

  const updatePayload = {
    written_name: values.genstand ?? null,
    material: values.materiale ?? null,
    dating: values.datering ?? null,
    easting: toNullableNumber(values.oest),
    northing: toNullableNumber(values.nord),
    dime_id: values.dime_id ?? null,
  };

  const { data: updatedRowsStrict, error: strictError } = await supabase
    .schema("public")
    .from("findings")
    .update(updatePayload)
    .eq("id", findingId)
    .eq("user_id", user.id)
    .select("id");

  if (strictError) {
    throw strictError;
  }

  if (!updatedRowsStrict || updatedRowsStrict.length !== 1) {
    // Fallback: rely on RLS and match only by id in case user_id data is inconsistent.
    const { data: updatedRowsById, error: fallbackError } = await supabase
      .schema("public")
      .from("findings")
      .update(updatePayload)
      .eq("id", findingId)
      .select("id");

    if (fallbackError) {
      throw fallbackError;
    }

    if (!updatedRowsById || updatedRowsById.length !== 1) {
      throw new Error("No finding was updated");
    }
  }
};

export const listFindingComments = async (
  findingId: string,
): Promise<FindingComment[]> => {
  const { data, error } = await supabase.rpc("get_finding_comments", {
    target_finding_id: findingId,
  });

  if (error) {
    throw error;
  }

  return ((data as any[]) ?? []).map(mapRowToFindingComment);
};

export const createFindingComment = async ({
  findingId,
  content,
  mentions = [],
}: CreateFindingCommentInput): Promise<void> => {
  const user = await requireSessionUser();
  const normalizedContent = content.trim();

  if (!normalizedContent) {
    throw new Error("EMPTY_COMMENT");
  }

  const { data: insertedComment, error: insertCommentError } = await supabase
    .schema("public")
    .from("finding_comments")
    .insert({
      finding_id: findingId,
      author_user_id: user.id,
      content: normalizedContent,
    })
    .select("id")
    .single();

  if (insertCommentError) {
    throw insertCommentError;
  }

  const commentId =
    insertedComment && typeof insertedComment.id === "string"
      ? insertedComment.id
      : null;

  if (!commentId) {
    throw new Error("COMMENT_INSERT_FAILED");
  }

  if (mentions.length === 0) {
    return;
  }

  const rows = mentions
    .filter(
      (mention) =>
        mention.mentionedUserId &&
        mention.label.trim() &&
        Number.isInteger(mention.startIndex) &&
        Number.isInteger(mention.endIndex) &&
        mention.endIndex > mention.startIndex,
    )
    .map((mention) => ({
      comment_id: commentId,
      finding_id: findingId,
      mentioned_user_id: mention.mentionedUserId,
      kind: mention.kind,
      label: mention.label.trim(),
      start_index: mention.startIndex,
      end_index: mention.endIndex,
    }));

  if (rows.length === 0) {
    return;
  }

  const { error: insertMentionsError } = await supabase
    .schema("public")
    .from("finding_comment_mentions")
    .insert(rows);

  if (insertMentionsError) {
    throw insertMentionsError;
  }
};

export const listFindingShares = async (
  findingId: string,
): Promise<string[]> => {
  const { data, error } = await supabase
    .schema("public")
    .from("finding_shares")
    .select("shared_with_user_id")
    .eq("finding_id", findingId);

  if (error) {
    throw error;
  }

  return ((data as Array<{ shared_with_user_id: string }> | null) ?? []).map(
    (row) => row.shared_with_user_id,
  );
};

export const updateFindingShares = async (
  findingId: string,
  sharedWithUserIds: string[],
): Promise<void> => {
  const user = await requireSessionUser();

  const normalizedNextIds = [...new Set(sharedWithUserIds)].filter(Boolean);
  const existingIds = await listFindingShares(findingId);
  const idsToAdd = normalizedNextIds.filter((id) => !existingIds.includes(id));
  const idsToRemove = existingIds.filter(
    (id) => !normalizedNextIds.includes(id),
  );

  if (idsToRemove.length > 0) {
    const { error: deleteError } = await supabase
      .schema("public")
      .from("finding_shares")
      .delete()
      .eq("finding_id", findingId)
      .eq("owner_user_id", user.id)
      .in("shared_with_user_id", idsToRemove);

    if (deleteError) {
      throw deleteError;
    }
  }

  if (idsToAdd.length > 0) {
    const { error: insertError } = await supabase
      .schema("public")
      .from("finding_shares")
      .insert(
        idsToAdd.map((sharedWithUserId) => ({
          finding_id: findingId,
          owner_user_id: user.id,
          shared_with_user_id: sharedWithUserId,
        })),
      );

    if (insertError) {
      throw insertError;
    }
  }
};

/**
 * Hook to fetch findings for the current user with real-time subscriptions
 */
export const useUserFindings = () => {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let findingsChannel: ReturnType<typeof supabase.channel> | null = null;
    let ownerSharesChannel: ReturnType<typeof supabase.channel> | null = null;
    let recipientSharesChannel: ReturnType<typeof supabase.channel> | null =
      null;

    const loadOwnFindings = async (userId: string): Promise<Finding[]> => {
      const { data, error: queryError } = await supabase
        .schema("public")
        .from("findings")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (queryError) {
        throw queryError;
      }

      return ((data as any[]) ?? []).map((row) =>
        mapRowToFinding({ ...row, access_level: "owner" }),
      );
    };

    const loadSharedFindings = async (): Promise<Finding[]> => {
      const { data, error: queryError } = await supabase.rpc(
        "get_my_shared_findings",
      );

      if (queryError) {
        throw queryError;
      }

      return ((data as any[]) ?? []).map(mapRowToFinding);
    };

    const refreshSharedFindings = async () => {
      try {
        const sharedFindings = await loadSharedFindings();

        if (!isMounted) {
          return;
        }

        setFindings((prev) =>
          sortFindings([
            ...prev.filter((finding) => finding.accessLevel !== "shared"),
            ...sharedFindings,
          ]),
        );
      } catch (refreshError) {
        if (isMounted && refreshError instanceof Error) {
          setError(refreshError.message);
        }
      }
    };

    const setup = async () => {
      const user = await requireSessionUser().catch(() => null);

      if (!user) {
        if (isMounted) {
          setError("Not authenticated");
          setLoading(false);
        }
        return;
      }

      const userId = user.id;

      try {
        const [ownFindings, sharedFindings] = await Promise.all([
          loadOwnFindings(userId),
          loadSharedFindings(),
        ]);

        if (!isMounted) {
          return;
        }

        setFindings(sortFindings([...ownFindings, ...sharedFindings]));
        setError(null);
      } catch (queryError) {
        if (!isMounted) {
          return;
        }

        setError(
          queryError instanceof Error
            ? queryError.message
            : "Unable to load findings",
        );
      }

      if (!isMounted) {
        return;
      }

      setLoading(false);

      findingsChannel = supabase
        .channel(`findings:${userId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "findings",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            const inserted = mapRowToFinding({
              ...payload.new,
              access_level: "owner",
            });
            setFindings((prev) =>
              sortFindings([
                inserted,
                ...prev.filter((finding) => finding.id !== inserted.id),
              ]),
            );
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "findings",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            const updated = mapRowToFinding({
              ...payload.new,
              access_level: "owner",
            });
            setFindings((prev) =>
              sortFindings(
                prev.map((finding) =>
                  finding.id === updated.id ? updated : finding,
                ),
              ),
            );
          },
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "findings",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            const deletedId = String((payload.old as { id?: string }).id ?? "");
            if (!deletedId) return;
            setFindings((prev) => prev.filter((f) => f.id !== deletedId));
          },
        )
        .subscribe();

      ownerSharesChannel = supabase
        .channel(`finding-shares-owner:${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "finding_shares",
            filter: `owner_user_id=eq.${userId}`,
          },
          () => {
            void refreshSharedFindings();
          },
        )
        .subscribe();

      recipientSharesChannel = supabase
        .channel(`finding-shares-recipient:${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "finding_shares",
            filter: `shared_with_user_id=eq.${userId}`,
          },
          () => {
            void refreshSharedFindings();
          },
        )
        .subscribe();
    };

    void setup();

    return () => {
      isMounted = false;
      if (findingsChannel) {
        supabase.removeChannel(findingsChannel);
      }
      if (ownerSharesChannel) {
        supabase.removeChannel(ownerSharesChannel);
      }
      if (recipientSharesChannel) {
        supabase.removeChannel(recipientSharesChannel);
      }
    };
  }, []);

  return { findings, loading, error };
};

/**
 * Hook to fetch all findings (no user filter) for heatmap display
 */
export const useAllFindingsHeatmap = () => {
  const [heatData, setHeatData] = useState<GeoJSON.FeatureCollection | null>(
    null,
  );

  useEffect(() => {
    // load all findings coordinates for heatmap
    supabase
      .from("findings")
      .select("id,easting,northing,written_name,dating,material,dime_id")
      .not("easting", "is", null)
      .not("northing", "is", null)
      .then(({ data, error }) => {
        if (data && !error) {
          const features = (data as any[])
            .map((row) => {
              const e = row.easting;
              const n = row.northing;
              if (e == null || n == null) return null;
              const [lng, lat] = utmToWGS84(e, n);
              return {
                type: "Feature",
                geometry: { type: "Point", coordinates: [lng, lat] },
                properties: {
                  id: row.id as string,
                  genstand: row.written_name as string | null,
                  datering: row.dating as string | null,
                  materiale: row.material as string | null,
                  dime_id: row.dime_id as string | null,
                },
              };
            })
            .filter(Boolean) as GeoJSON.Feature[];
          setHeatData({ type: "FeatureCollection", features });
        }
      });
  }, []);

  return heatData;
};

export const useFindingComments = (findingId: string | null) => {
  const [comments, setComments] = useState<FindingComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let commentsChannel: ReturnType<typeof supabase.channel> | null = null;
    let mentionsChannel: ReturnType<typeof supabase.channel> | null = null;

    if (!findingId) {
      setComments([]);
      setLoading(false);
      setError(null);
      return () => {
        isMounted = false;
      };
    }

    const loadComments = async () => {
      if (isMounted) {
        setLoading(true);
      }

      try {
        const nextComments = await listFindingComments(findingId);

        if (!isMounted) {
          return;
        }

        setComments(nextComments);
        setError(null);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setComments([]);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load comments",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadComments();

    commentsChannel = supabase
      .channel(`finding-comments:${findingId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "finding_comments",
          filter: `finding_id=eq.${findingId}`,
        },
        () => {
          void loadComments();
        },
      )
      .subscribe();

    mentionsChannel = supabase
      .channel(`finding-comment-mentions:${findingId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "finding_comment_mentions",
          filter: `finding_id=eq.${findingId}`,
        },
        () => {
          void loadComments();
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      if (commentsChannel) {
        supabase.removeChannel(commentsChannel);
      }
      if (mentionsChannel) {
        supabase.removeChannel(mentionsChannel);
      }
    };
  }, [findingId, refreshKey]);

  return {
    comments,
    loading,
    error,
    refresh: () => setRefreshKey((currentKey) => currentKey + 1),
  };
};

export const useFindingsCatalog = (
  page: number,
  pageSize: number,
  search: string,
) => {
  const [findings, setFindings] = useState<FindingCatalogEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCatalog = async () => {
      setLoading(true);

      const safePage = Math.max(1, page);
      const safePageSize = Math.max(1, pageSize);
      const from = (safePage - 1) * safePageSize;
      const normalizedSearch = toCatalogSearchValue(search);

      const { data, error: queryError } = await supabase.rpc(
        "get_all_findings_catalog",
        {
          page_limit: safePageSize,
          page_offset: from,
          search_term: normalizedSearch,
        },
      );

      if (!isMounted) {
        return;
      }

      if (queryError) {
        setError(queryError.message);
        setFindings([]);
        setTotalCount(0);
      } else {
        const rows = (data as any[]) ?? [];
        setError(null);
        setFindings(rows.map(mapRowToFindingCatalogEntry));
        setTotalCount(Number(rows[0]?.total_count ?? 0));
      }

      setLoading(false);
    };

    void loadCatalog();

    return () => {
      isMounted = false;
    };
  }, [page, pageSize, search]);

  return { findings, totalCount, loading, error };
};

export const useFindingCatalogPreviewImages = (findingIds: string[]) => {
  const [previewImages, setPreviewImages] = useState<
    Record<string, FindingCatalogPreviewImage>
  >({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (findingIds.length === 0) {
      setPreviewImages({});
      setLoading(false);
      return;
    }

    const loadPreviewImages = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .schema("public")
        .from("imageLinks")
        .select("*")
        .in("finding_id", findingIds);

      if (!isMounted) {
        return;
      }

      if (error) {
        setPreviewImages({});
        setLoading(false);
        return;
      }

      const nextPreviewImages: Record<string, FindingCatalogPreviewImage> = {};

      for (const row of (data as any[]) ?? []) {
        const findingId =
          typeof row.finding_id === "string" ? row.finding_id : null;
        const imageUid = extractImageUid(row);

        if (!findingId || !imageUid || nextPreviewImages[findingId]) {
          continue;
        }

        nextPreviewImages[findingId] = {
          findingId,
          imageUid,
        };
      }

      setPreviewImages(nextPreviewImages);
      setLoading(false);
    };

    void loadPreviewImages();

    return () => {
      isMounted = false;
    };
  }, [findingIds]);

  return { previewImages, loading };
};

/**
 * Convert UTM finding to WGS84 coordinates for map display
 */
export const findingToCoordinates = (
  finding: Finding,
): [number, number] | null => {
  if (finding.oest == null || finding.nord == null) return null;
  return utmToWGS84(finding.oest, finding.nord);
};
