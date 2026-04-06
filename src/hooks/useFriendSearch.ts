import { supabase } from "../lib/supabase";

export interface FriendLookupResult {
  userId: string;
  email: string;
}

interface FriendLookupRow {
  user_id: string;
  email: string;
}

export const useFriendSearch = (): {
  findFriendByEmail: (email: string) => Promise<FriendLookupResult | null>;
} => {
  const findFriendByEmail = async (
    email: string,
  ): Promise<FriendLookupResult | null> => {
    const normalizedEmail = email.trim().toLowerCase();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Not authenticated");
    }

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