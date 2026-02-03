"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Suggestion = {
  date: string;
  time: string;
  place: string;
  note: string;
};

type Position = {
  x: number;
  y: number;
};

const NO_BUTTON_THRESHOLD = 120;
const NO_BUTTON_PADDING = 16;

const initialSuggestion: Suggestion = {
  date: "",
  time: "",
  place: "",
  note: ""
};

function notifyVisit() {
  const payload = {
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown"
  };

  console.log("VISIT EVENT:", payload);

  // fetch("/api/notify-visit", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload)
  // });
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const noButtonRef = useRef<HTMLButtonElement | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [noPosition, setNoPosition] = useState<Position>({ x: 0, y: 0 });
  const [noModalOpen, setNoModalOpen] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion>(initialSuggestion);
  const [suggestionMessage, setSuggestionMessage] = useState("");
  const [suggestionError, setSuggestionError] = useState("");

  const detailItems = useMemo(
    () => ["Thursday, February 12", "8:00 PM", "Moreira’s — Griffintown"],
    []
  );

  useEffect(() => {
    notifyVisit();
  }, []);

  useEffect(() => {
    const setInitialPosition = () => {
      const container = containerRef.current;
      const button = noButtonRef.current;
      if (!container || !button) return;

      const rect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const maxX = Math.max(
        rect.width - buttonRect.width - NO_BUTTON_PADDING,
        NO_BUTTON_PADDING
      );
      const maxY = Math.max(
        rect.height - buttonRect.height - NO_BUTTON_PADDING,
        NO_BUTTON_PADDING
      );

      setNoPosition({
        x: Math.min(maxX, Math.max(NO_BUTTON_PADDING, rect.width * 0.55)),
        y: Math.min(maxY, NO_BUTTON_PADDING)
      });
    };

    setInitialPosition();
    window.addEventListener("resize", setInitialPosition);
    return () => window.removeEventListener("resize", setInitialPosition);
  }, []);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (confirmed) return;
      const button = noButtonRef.current;
      const container = containerRef.current;
      if (!button || !container) return;

      const buttonRect = button.getBoundingClientRect();
      const centerX = buttonRect.left + buttonRect.width / 2;
      const centerY = buttonRect.top + buttonRect.height / 2;
      const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);

      if (distance > NO_BUTTON_THRESHOLD) return;

      const containerRect = container.getBoundingClientRect();
      const maxX = Math.max(
        containerRect.width - buttonRect.width - NO_BUTTON_PADDING,
        NO_BUTTON_PADDING
      );
      const maxY = Math.max(
        containerRect.height - buttonRect.height - NO_BUTTON_PADDING,
        NO_BUTTON_PADDING
      );

      const nextX =
        NO_BUTTON_PADDING + Math.random() * (maxX - NO_BUTTON_PADDING);
      const nextY =
        NO_BUTTON_PADDING + Math.random() * (maxY - NO_BUTTON_PADDING);

      setNoPosition({ x: nextX, y: nextY });
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [confirmed]);

  const handleYesClick = () => {
    setConfirmed(true);
  };

  const handleNoClick = () => {
    setNoModalOpen(true);
  };

  const handleSuggestionChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setSuggestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleSuggestionSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuggestionError("");
    setSuggestionMessage("");

    if (!suggestion.date || !suggestion.time || !suggestion.place.trim()) {
      setSuggestionError("Please complete the date, time, and place fields.");
      return;
    }

    const payload = { ...suggestion };
    console.log("Suggestion submitted:", payload);
    setSuggestionMessage("Got it — suggestion received. I’ll confirm back soon.");
    setSuggestion(initialSuggestion);
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16 text-slate-100">
      <div className="w-full max-w-3xl space-y-10 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-8 shadow-soft backdrop-blur">
        <header className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Invitation
          </p>
          <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">
            Rama — would you like to join me for dinner?
          </h1>
          <p className="text-base text-slate-300">
            Low-pressure invite. Good food. Good company.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Details
          </h2>
          <div className="mt-4 grid gap-3 text-lg text-slate-100 sm:grid-cols-3">
            {detailItems.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-slate-800/60 bg-slate-900/80 px-4 py-3 text-center shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          {!confirmed && (
            <div
              ref={containerRef}
              className="relative flex min-h-[110px] items-center justify-center gap-6"
            >
              <button
                type="button"
                onClick={handleYesClick}
                className="z-10 inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-4 text-base font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
              >
                Yes, sounds good
              </button>
              <button
                ref={noButtonRef}
                type="button"
                onClick={handleNoClick}
                className="absolute inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-8 py-4 text-base font-semibold text-slate-200 shadow-md transition-transform duration-200 ease-out hover:text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
                style={{
                  transform: `translate3d(${noPosition.x}px, ${noPosition.y}px, 0)`
                }}
              >
                No, not this time
              </button>
            </div>
          )}

          <div
            className={`rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-left transition-all duration-300 ${
              confirmed
                ? "translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-4 opacity-0"
            }`}
            aria-live="polite"
          >
            <p className="text-lg font-semibold text-emerald-200">
              Perfect — it’s confirmed. See you Thursday at 8:00 PM.
            </p>
            <p className="mt-1 text-sm text-emerald-100">
              Moreira’s (Griffintown).
            </p>
            <p className="mt-3 text-sm text-emerald-100/80">
              If anything changes, you can suggest another time below.
            </p>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-50">
              Suggest another option
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              If Thursday doesn’t work, propose a different date/time/place.
            </p>
          </div>

          <form onSubmit={handleSuggestionSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <label className="text-sm text-slate-300">
                Date
                <input
                  required
                  type="date"
                  name="date"
                  value={suggestion.date}
                  onChange={handleSuggestionChange}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                />
              </label>
              <label className="text-sm text-slate-300">
                Time
                <input
                  required
                  type="time"
                  name="time"
                  value={suggestion.time}
                  onChange={handleSuggestionChange}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                />
              </label>
              <label className="text-sm text-slate-300">
                Place
                <input
                  required
                  type="text"
                  name="place"
                  value={suggestion.place}
                  onChange={handleSuggestionChange}
                  placeholder="Restaurant or location"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                />
              </label>
            </div>
            <label className="text-sm text-slate-300">
              Optional note
              <textarea
                name="note"
                value={suggestion.note}
                onChange={handleSuggestionChange}
                placeholder="Any extra detail to share"
                rows={3}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
              />
            </label>

            {suggestionError && (
              <p className="text-sm text-amber-300">{suggestionError}</p>
            )}
            {suggestionMessage && (
              <p className="text-sm text-emerald-200">{suggestionMessage}</p>
            )}

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
            >
              Send suggestion
            </button>
          </form>
        </section>
      </div>

      {noModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
          <div className="max-w-2xl space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-soft">
            <p className="text-lg text-slate-100">
              Oh no! It seems like your name is Rama Shapsough, and this button
              only works for people whose names are not ‘Rama Shapsough’. Better
              luck next time.
            </p>
            <button
              type="button"
              onClick={() => setNoModalOpen(false)}
              className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
