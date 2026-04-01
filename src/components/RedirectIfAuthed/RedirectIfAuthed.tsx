import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export const RedirectIfAuthed: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session);
    });
  }, []);

  if (authed === null) return null;
  if (authed) return <Navigate to="/detector/home" replace />;
  return <>{children}</>;
};

export default RedirectIfAuthed;
