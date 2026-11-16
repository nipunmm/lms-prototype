"use client";

import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/** සිංහල | English toggle (Section 23.2). Active option highlighted. */
export function LangToggle({ scope }: { scope: "site" | "lms" }) {
  const siteLang = useAppStore((s) => s.siteLang);
  const lmsLang = useAppStore((s) => s.lmsLang);
  const setSiteLang = useAppStore((s) => s.setSiteLang);
  const setLmsLang = useAppStore((s) => s.setLmsLang);

  const lang = scope === "site" ? siteLang : lmsLang;
  const setLang = scope === "site" ? setSiteLang : setLmsLang;

  return (
    <div className="inline-flex items-center rounded-full border border-border bg-surface p-0.5 text-xs font-semibold" role="group" aria-label="Language">
      <button
        type="button"
        onClick={() => setLang("si")}
        aria-pressed={lang === "si"}
        className={cn(
          "rounded-full px-3 py-1.5 transition-colors",
          lang === "si" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        සිංහල
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={cn(
          "rounded-full px-3 py-1.5 transition-colors",
          lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        English
      </button>
    </div>
  );
}
