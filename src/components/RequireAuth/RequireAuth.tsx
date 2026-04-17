import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getSessionUser, getValidatedUser } from "../../hooks/useAuth";
import { routes } from "../../lib/routes";
import { supabase } from "../../lib/supabase";

type State = "loading" | "authed" | "no-session" | "deleted";

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<State>("loading");

  useEffect(() => {
    (async () => {
      try {
        const sessionUser = await getSessionUser();
        if (!sessionUser) {
          setState("no-session");
          return;
        }

        const validatedUser = await getValidatedUser();

        if (!validatedUser) {
          await supabase.auth.signOut();
          setState("deleted");
        } else {
          setState("authed");
        }
      } catch {
        setState("no-session");
      }
    })();
  }, []);

  if (state === "loading") return null;
  if (state === "no-session") return <Navigate to={routes.login} replace />;
  if (state === "deleted") return <Navigate to={routes.landing} replace />;
  return <>{children}</>;
};

export default RequireAuth;
