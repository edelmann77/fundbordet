import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

let validatedUser: User | null | undefined;
let validatedUserPromise: Promise<User | null> | null = null;

supabase.auth.onAuthStateChange((_event, session) => {
  validatedUser = session ? undefined : null;
  validatedUserPromise = null;
});

export const getSessionUser = async (): Promise<User | null> => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return session?.user ?? null;
};

export const requireSessionUser = async (): Promise<User> => {
  const user = await getSessionUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  return user;
};

export const getValidatedUser = async (): Promise<User | null> => {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    validatedUser = null;
    validatedUserPromise = null;
    return null;
  }

  if (validatedUser !== undefined) {
    return validatedUser;
  }

  if (!validatedUserPromise) {
    validatedUserPromise = supabase.auth
      .getUser()
      .then(({ data, error }) => {
        if (error) {
          throw error;
        }

        validatedUser = data.user ?? null;
        return validatedUser;
      })
      .finally(() => {
        validatedUserPromise = null;
      });
  }

  return validatedUserPromise;
};

export const useAuth = () => {
  return {
    getSessionUser,
    requireSessionUser,
    getValidatedUser,
  };
};
