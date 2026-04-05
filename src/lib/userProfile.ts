import { supabase } from "./supabase";

export interface UserProfile {
  firstName: string;
  lastName: string;
}

export interface CurrentUserProfile {
  email: string;
  profile: UserProfile;
}

interface UserProfileRow {
  first_name: string | null;
  last_name: string | null;
}

function mapRowToUserProfile(row: UserProfileRow | null): UserProfile {
  return {
    firstName: row?.first_name ?? "",
    lastName: row?.last_name ?? "",
  };
}

export async function getCurrentUserProfile(): Promise<CurrentUserProfile> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .select("first_name, last_name")
    .eq("user_id", user.id)
    .maybeSingle<UserProfileRow>();

  if (error) {
    throw error;
  }

  return {
    email: user.email ?? "",
    profile: mapRowToUserProfile(data ?? null),
  };
}

export async function upsertCurrentUserProfile(
  values: UserProfile,
): Promise<UserProfile> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Not authenticated");
  }

  const payload = {
    user_id: user.id,
    first_name: values.firstName.trim(),
    last_name: values.lastName.trim(),
  };

  const { data, error } = await supabase
    .from("user_profiles")
    .upsert(payload, { onConflict: "user_id" })
    .select("first_name, last_name")
    .single<UserProfileRow>();

  if (error) {
    throw error;
  }

  return mapRowToUserProfile(data);
}
