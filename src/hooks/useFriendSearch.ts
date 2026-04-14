import { requireSessionUser } from "./useAuth";
import { supabase } from "../lib/supabase";

export const CONFIRMED_FRIEND_STATUS = "confirmed";
export const PENDING_FRIEND_STATUS = "not confirmed";

export type FriendStatus =
  | typeof CONFIRMED_FRIEND_STATUS
  | typeof PENDING_FRIEND_STATUS;

export interface FriendRecord {
  id: string;
  inviter: string;
  invitee: string;
  counterpartUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  status: FriendStatus;
  isIncoming: boolean;
  createdAt: string;
}

export interface FriendLookupResult {
  userId: string;
  email: string;
}

export interface AppNotification {
  id: string;
  kind: "friend-request" | "comment-mention";
  createdAt: string;
  friendId?: string;
  senderEmail?: string;
  findingId?: string;
  commentId?: string;
}

interface FriendLookupRow {
  user_id: string;
  email: string;
}

interface FriendRow {
  id: string;
  inviter: string;
  invitee: string;
  counterpart_user_id: string;
  counterpart_email: string;
  counterpart_first_name: string | null;
  counterpart_last_name: string | null;
  status: FriendStatus;
  created_at: string;
}

interface MentionNotificationRow {
  id: string;
  finding_id: string;
  comment_id: string;
  created_at: string;
}

function mapRowToFriend(row: FriendRow, currentUserId: string): FriendRecord {
  return {
    id: row.id,
    inviter: row.inviter,
    invitee: row.invitee,
    counterpartUserId: row.counterpart_user_id,
    email: row.counterpart_email,
    firstName: row.counterpart_first_name ?? "",
    lastName: row.counterpart_last_name ?? "",
    status: row.status,
    isIncoming: row.invitee === currentUserId,
    createdAt: row.created_at,
  };
}

async function getCurrentUserId(): Promise<string> {
  const user = await requireSessionUser();

  return user.id;
}

export async function listCurrentUserFriends(): Promise<FriendRecord[]> {
  const currentUserId = await getCurrentUserId();

  const { data, error } = await supabase.rpc("get_my_friends");

  if (error) {
    throw error;
  }

  return ((data ?? []) as FriendRow[]).map((row) =>
    mapRowToFriend(row, currentUserId),
  );
}

export async function listConfirmedFriends(): Promise<FriendRecord[]> {
  const friends = await listCurrentUserFriends();

  return friends.filter((friend) => friend.status === CONFIRMED_FRIEND_STATUS);
}

export async function listPendingFriendRequests(): Promise<AppNotification[]> {
  const friends = await listCurrentUserFriends();

  return friends
    .filter(
      (friend) => friend.status === PENDING_FRIEND_STATUS && friend.isIncoming,
    )
    .map((friend) => ({
      id: `friend-request:${friend.id}`,
      kind: "friend-request" as const,
      createdAt: friend.createdAt,
      friendId: friend.id,
      senderEmail: friend.email,
    }));
}

export async function listCommentMentionNotifications(): Promise<
  AppNotification[]
> {
  const currentUserId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("finding_comment_mentions")
    .select("id, finding_id, comment_id, created_at")
    .eq("mentioned_user_id", currentUserId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const mentionRows = (data ?? []) as MentionNotificationRow[];

  if (mentionRows.length === 0) {
    return [];
  }

  const uniqueCommentIds = [
    ...new Set(mentionRows.map((row) => row.comment_id)),
  ];

  const { data: comments, error: commentsError } = await supabase
    .from("finding_comments")
    .select("id, author_user_id")
    .in("id", uniqueCommentIds);

  if (commentsError) {
    throw commentsError;
  }

  const commentAuthorMap = new Map<string, string>(
    ((comments ?? []) as Array<{ id: string; author_user_id: string }>).map(
      (comment) => [comment.id, comment.author_user_id],
    ),
  );

  return mentionRows
    .filter(
      (mention) => commentAuthorMap.get(mention.comment_id) !== currentUserId,
    )
    .map((mention) => ({
      id: `comment-mention:${mention.id}`,
      kind: "comment-mention",
      createdAt: mention.created_at,
      findingId: mention.finding_id,
      commentId: mention.comment_id,
    }));
}

export async function listAppNotifications(): Promise<AppNotification[]> {
  const [friendRequests, mentionNotifications] = await Promise.all([
    listPendingFriendRequests(),
    listCommentMentionNotifications(),
  ]);

  return [...friendRequests, ...mentionNotifications].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

export async function addFriend(inviteeUserId: string): Promise<void> {
  const inviterUserId = await getCurrentUserId();

  if (inviterUserId === inviteeUserId) {
    throw new Error("SELF_FRIEND");
  }

  const { error } = await supabase.from("friends").insert({
    inviter: inviterUserId,
    invitee: inviteeUserId,
    status: PENDING_FRIEND_STATUS,
  });

  if (!error) {
    return;
  }

  if (error.code === "23505") {
    throw new Error("FRIEND_EXISTS");
  }

  throw error;
}

export async function confirmFriend(friendId: string): Promise<void> {
  const { error } = await supabase
    .from("friends")
    .update({ status: CONFIRMED_FRIEND_STATUS })
    .eq("id", friendId);

  if (error) {
    throw error;
  }
}

export async function deleteFriend(friendId: string): Promise<void> {
  const { error } = await supabase.from("friends").delete().eq("id", friendId);

  if (error) {
    throw error;
  }
}

export const useFriendSearch = (): {
  findFriendByEmail: (email: string) => Promise<FriendLookupResult | null>;
} => {
  const findFriendByEmail = async (
    email: string,
  ): Promise<FriendLookupResult | null> => {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await requireSessionUser();

    if ((user.email ?? "").trim().toLowerCase() === normalizedEmail) {
      throw new Error("SELF_FRIEND");
    }

    const { data, error } = await supabase.rpc("find_user_by_email", {
      lookup_email: normalizedEmail,
    });

    if (error) {
      throw error;
    }

    const [match] = (data ?? []) as FriendLookupRow[];

    if (!match) {
      return null;
    }

    return {
      userId: match.user_id,
      email: match.email,
    };
  };

  return { findFriendByEmail };
};
