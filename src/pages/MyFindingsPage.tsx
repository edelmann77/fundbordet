import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";

interface Finding {
  id: string;
  genstand: string | null;
  materiale: string | null;
  datering: string | null;
  oest: number | null;
  nord: number | null;
  dime_id: string | null;
  created_at: string;
}

export default function MyFindingsPage() {
  const { t } = useTranslation();
  const [findings, setFindings] = useState<Finding[]>([]);

  useEffect(() => {
    const channel = supabase.channel("findings");

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      const userId = user.id;

      const fetchFindings = () =>
        supabase
          .schema("public")
          .from("findings")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .then(({ data }) => {
            if (data) setFindings(data as Finding[]);
          });

      fetchFindings();

      channel
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "findings" },
          fetchFindings,
        )
        .subscribe();
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (findings.length === 0) {
    return (
      <p className="text-ink-muted text-sm">{t("myFindings.empty")}</p>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2">
      {findings.map((f) => (
        <div
          key={f.id}
          className="rounded-xl border border-edge bg-surface px-5 py-4 flex flex-col gap-1"
        >
          <p className="font-semibold text-ink text-sm">
            {f.genstand || (
              <span className="text-ink-muted italic">{t("myFindings.unnamed")}</span>
            )}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-ink-muted">
            {f.materiale && <span>{f.materiale}</span>}
            {f.datering && <span>{f.datering}</span>}
            {f.oest != null && f.nord != null && (
              <span>
                {f.oest}E / {f.nord}N
              </span>
            )}
            {f.dime_id && <span>{t("myFindings.dimeIdLabel")}: {f.dime_id}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
