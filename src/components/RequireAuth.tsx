import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type State = "loading" | "authed" | "no-session" | "deleted";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>("loading");

  useEffect(() => {
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setState("no-session");
        return;
      }
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        await supabase.auth.signOut();
        setState("deleted");
      } else {
        setState("authed");
      }
    })();
  }, []);

  if (state === "loading") return null;
  if (state === "no-session") return <Navigate to="/login" replace />;
  if (state === "deleted") return <Navigate to="/" replace />;
  return <>{children}</>;
}
