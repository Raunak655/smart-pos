import { useEffect, useState } from "react";
import { api } from "../services/api";

const typeMeta = {
  warning: {
    icon: "⚠️",
    accent: "from-amber-500 to-orange-500",
    badge: "bg-amber-500/15 text-amber-300"
  },
  success: {
    icon: "🚀",
    accent: "from-emerald-500 to-teal-500",
    badge: "bg-emerald-500/15 text-emerald-300"
  },
  info: {
    icon: "💡",
    accent: "from-sky-500 to-indigo-500",
    badge: "bg-sky-500/15 text-sky-300"
  }
};

export default function AISuggestions({ onCountChange }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSuggestions = async () => {
      setIsLoading(true);

      try {
        const data = await api.aiSuggestions.getSuggestions();
        const suggestionsList = Array.isArray(data) ? data : [];
        setSuggestions(suggestionsList);

        if (onCountChange) {
          onCountChange(suggestionsList.length);
        }
      } catch (error) {
        console.error("Failed to load AI suggestions:", error);
        setSuggestions([]);

        if (onCountChange) {
          onCountChange(0);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadSuggestions();
  }, [onCountChange]);

  return (
    <div className="p-6">
      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-950 to-slate-900 p-6 shadow-2xl shadow-slate-950/40 mb-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-3">AI Suggestions</p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-white">
              Your store intelligence dashboard
            </h1>
            <p className="mt-3 text-slate-400 sm:text-lg">
              Smart, actionable suggestions for inventory, demand, and stock planning. Each tip is designed to help you act faster and sell smarter.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 shadow-lg shadow-slate-950/30 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-sky-500 text-3xl shadow-xl shadow-indigo-500/20">
              🤖
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Live suggestions</p>
              <p className="text-4xl font-semibold text-white">{isLoading ? "..." : suggestions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-32 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {suggestions.map((suggestion, index) => {
            const meta = typeMeta[suggestion.type] || typeMeta.info;

            return (
              <article
                key={index}
                className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/40 transition-all hover:-translate-y-1 hover:bg-slate-900/95"
              >
                <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${meta.accent}`} />
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-2xl text-white shadow-lg shadow-black/20">
                    {meta.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">{suggestion.title}</h3>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${meta.badge}`}>
                        {suggestion.type || "Info"}
                      </span>
                    </div>
                    <p className="mt-3 text-slate-400 leading-7">{suggestion.message}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}