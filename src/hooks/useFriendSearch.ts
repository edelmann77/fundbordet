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
}

export interface FriendLookupResult {
  userId: string;
  email: string;
}

export interface AppNotification {
  id: string;
  kind: "friend-request";
  friendId: string;
  senderEmail: string;
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
      friendId: friend.id,
      senderEmail: friend.email,
    }));
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
