import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getSessionUser } from "../../hooks/useAuth";
import { routes } from "../../lib/routes";

export const RedirectIfAuthed: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    getSessionUser()
      .then((user) => {
        setAuthed(Boolean(user));
      })
      .catch(() => {
        setAuthed(false);
      });
  }, []);

  if (authed === null) return null;
  if (authed) return <Navigate to={routes.home} replace />;
  return <>{children}</>;
};

export default RedirectIfAuthed;
