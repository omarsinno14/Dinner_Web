"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

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

const NO_BUTTON_MIN_DISTANCE = 140;
const NO_BUTTON_PADDING = 24;
const BACKGROUND_CLIP_COUNT = 14;
const FLAG_COUNT = 2;

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
  const noButtonRef = useRef<HTMLButtonElement | null>(null);
  const yesButtonRef = useRef<HTMLButtonElement | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [noPosition, setNoPosition] = useState<Position>({ x: 0, y: 0 });
  const [noReady, setNoReady] = useState(false);
  const [noModalOpen, setNoModalOpen] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(true);
  const [suggestion, setSuggestion] = useState<Suggestion>(initialSuggestion);
  const [suggestionMessage, setSuggestionMessage] = useState("");
  const [suggestionError, setSuggestionError] = useState("");

  const detailItems = useMemo(
    () => ["Thursday, February 12", "8:00 PM", "Moreira’s — Griffintown"],
    []
  );

  const floatingClips = useMemo(
    () =>
      Array.from({ length: BACKGROUND_CLIP_COUNT }, (_, index) => ({
        id: `clip-${index}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 18 + Math.random() * 12,
        delay: Math.random() * 6,
        duration: 10 + Math.random() * 8
      })),
    []
  );

  const floatingFlags = useMemo(
    () =>
      Array.from({ length: FLAG_COUNT }, (_, index) => ({
        id: `flag-${index}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: 2 + Math.random() * 6,
        duration: 16 + Math.random() * 8
      })),
    []
  );

  useEffect(() => {
    notifyVisit();
  }, []);

  useLayoutEffect(() => {
    const setInitialPosition = () => {
      const button = noButtonRef.current;
      const yesButton = yesButtonRef.current;
      if (!button || !yesButton) return;

      const buttonRect = button.getBoundingClientRect();
      const yesRect = yesButton.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const maxX = Math.max(
        viewportWidth - buttonRect.width - NO_BUTTON_PADDING,
        NO_BUTTON_PADDING
      );
      const maxY = Math.max(
        viewportHeight - buttonRect.height - NO_BUTTON_PADDING,
        NO_BUTTON_PADDING
      );

      setNoPosition({
        x: Math.min(
          maxX,
          Math.max(
            NO_BUTTON_PADDING,
            yesRect.left + (yesRect.width - buttonRect.width) / 2
          )
        ),
        y: Math.min(maxY, Math.max(NO_BUTTON_PADDING, yesRect.bottom + 16))
      });
      setNoReady(true);
    };

    setInitialPosition();
    window.addEventListener("resize", setInitialPosition);
    return () => window.removeEventListener("resize", setInitialPosition);
  }, []);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (confirmed || !noReady) return;
      const button = noButtonRef.current;
      if (!button) return;

      const buttonRect = button.getBoundingClientRect();
      const centerX = buttonRect.left + buttonRect.width / 2;
      const centerY = buttonRect.top + buttonRect.height / 2;
      const deltaX = centerX - event.clientX;
      const deltaY = centerY - event.clientY;
      const distance = Math.hypot(deltaX, deltaY) || 1;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const maxX = Math.max(
        viewportWidth - buttonRect.width - NO_BUTTON_PADDING,
        NO_BUTTON_PADDING
      );
      const maxY = Math.max(
        viewportHeight - buttonRect.height - NO_BUTTON_PADDING,
        NO_BUTTON_PADDING
      );

      const normalizedX = deltaX / distance;
      const normalizedY = deltaY / distance;
      const targetCenterX = event.clientX + normalizedX * NO_BUTTON_MIN_DISTANCE;
      const targetCenterY = event.clientY + normalizedY * NO_BUTTON_MIN_DISTANCE;
      const nextX = Math.min(
        maxX,
        Math.max(NO_BUTTON_PADDING, targetCenterX - buttonRect.width / 2)
      );
      const nextY = Math.min(
        maxY,
        Math.max(NO_BUTTON_PADDING, targetCenterY - buttonRect.height / 2)
      );

      setNoPosition({ x: nextX, y: nextY });
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [confirmed, noReady]);

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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-rose-950 via-fuchsia-950 to-pink-950 px-4 py-16 text-pink-50">
      {!disclaimerOpen && (
        <div className="pointer-events-none absolute inset-0">
          {floatingClips.map((clip) => (
            <span
              key={clip.id}
              className="absolute animate-float text-pink-200/70"
              style={{
                left: `${clip.x}%`,
                top: `${clip.y}%`,
                fontSize: `${clip.size}px`,
                animationDelay: `${clip.delay}s`,
                animationDuration: `${clip.duration}s`
              }}
            >
              🎀
            </span>
          ))}
          {floatingFlags.map((flag) => (
            <div
              key={flag.id}
              className="absolute animate-drift opacity-30"
              style={{
                left: `${flag.x}%`,
                top: `${flag.y}%`,
                animationDelay: `${flag.delay}s`,
                animationDuration: `${flag.duration}s`
              }}
            >
              <div className="flex items-center gap-2">
                <div className="flag-palestine" />
                <div className="flag-circassia" />
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        className={`relative w-full max-w-3xl space-y-10 rounded-[32px] border border-pink-300/40 bg-pink-950/40 p-8 shadow-[0_20px_60px_-30px_rgba(244,114,182,0.85)] backdrop-blur transition-opacity duration-300 ${
          disclaimerOpen ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <header className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pink-200/70">
            Invitation
          </p>
          <h1 className="text-3xl font-semibold text-pink-50 sm:text-4xl">
            Rama — would you like to join me for dinner?
          </h1>
          <p className="text-base text-pink-200/80">
            Low-pressure invite. Good food. Good company.
          </p>
          <div className="mx-auto h-1 w-16 rounded-full bg-gradient-to-r from-pink-300 via-fuchsia-300 to-rose-300" />
        </header>

        <section className="rounded-2xl border border-pink-300/30 bg-pink-950/50 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-200/70">
            Details
          </h2>
          <div className="mt-4 grid gap-3 text-lg text-pink-50 sm:grid-cols-3">
            {detailItems.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-pink-300/20 bg-pink-900/50 px-4 py-3 text-center shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          {!confirmed && (
            <div
              className="relative flex min-h-[140px] items-center justify-center gap-6"
            >
              <button
                type="button"
                onClick={handleYesClick}
                ref={yesButtonRef}
                className="z-10 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-300 via-rose-200 to-pink-200 px-10 py-4 text-base font-semibold text-pink-950 shadow-lg transition hover:-translate-y-0.5 hover:from-pink-200 hover:via-rose-100 hover:to-pink-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-200"
              >
                Yes
              </button>
              <button
                ref={noButtonRef}
                type="button"
                onClick={handleNoClick}
                className={`fixed z-20 inline-flex items-center justify-center rounded-full border border-pink-200/60 bg-pink-950/80 px-10 py-4 text-base font-semibold text-pink-100 shadow-[0_12px_30px_-18px_rgba(244,114,182,0.85)] transition-transform duration-200 ease-out hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-200 ${
                  noReady ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  top: 0,
                  left: 0,
                  transform: `translate3d(${noPosition.x}px, ${noPosition.y}px, 0)`
                }}
              >
                No
              </button>
            </div>
          )}

          <div
            className={`rounded-2xl border border-pink-300/30 bg-pink-400/10 p-6 text-left transition-all duration-300 ${
              confirmed
                ? "translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-4 opacity-0"
            }`}
            aria-live="polite"
          >
            <p className="text-lg font-semibold text-pink-100">
              Perfect — it’s confirmed. See you Thursday at 8:00 PM.
            </p>
            <p className="mt-1 text-sm text-pink-100/90">
              Moreira’s (Griffintown).
            </p>
            <p className="mt-3 text-sm text-pink-100/70">
              If anything changes, you can suggest another time below.
            </p>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-pink-300/30 bg-pink-950/50 p-6">
          <div>
            <h2 className="text-xl font-semibold text-pink-50">
              Suggest another option
            </h2>
            <p className="mt-1 text-sm text-pink-200/70">
              If Thursday doesn’t work, propose a different date/time/place.
            </p>
          </div>

          <form onSubmit={handleSuggestionSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <label className="text-sm text-pink-100/90">
                Date
                <input
                  required
                  type="date"
                  name="date"
                  value={suggestion.date}
                  onChange={handleSuggestionChange}
                  className="mt-2 w-full rounded-xl border border-pink-400/40 bg-pink-900/60 px-3 py-2 text-pink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-200"
                />
              </label>
              <label className="text-sm text-pink-100/90">
                Time
                <input
                  required
                  type="time"
                  name="time"
                  value={suggestion.time}
                  onChange={handleSuggestionChange}
                  className="mt-2 w-full rounded-xl border border-pink-400/40 bg-pink-900/60 px-3 py-2 text-pink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-200"
                />
              </label>
              <label className="text-sm text-pink-100/90">
                Place
                <input
                  required
                  type="text"
                  name="place"
                  value={suggestion.place}
                  onChange={handleSuggestionChange}
                  placeholder="Restaurant or location"
                  className="mt-2 w-full rounded-xl border border-pink-400/40 bg-pink-900/60 px-3 py-2 text-pink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-200"
                />
              </label>
            </div>
            <label className="text-sm text-pink-100/90">
              Optional note
              <textarea
                name="note"
                value={suggestion.note}
                onChange={handleSuggestionChange}
                placeholder="Any extra detail to share"
                rows={3}
                className="mt-2 w-full rounded-xl border border-pink-400/40 bg-pink-900/60 px-3 py-2 text-pink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-200"
              />
            </label>

            {suggestionError && (
              <p className="text-sm text-amber-200">{suggestionError}</p>
            )}
            {suggestionMessage && (
              <p className="text-sm text-pink-100">{suggestionMessage}</p>
            )}

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full border border-pink-300/50 bg-pink-100 px-6 py-3 text-sm font-semibold text-pink-900 transition hover:-translate-y-0.5 hover:bg-pink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-200"
            >
              Send suggestion
            </button>
          </form>
        </section>
      </div>

      {noModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-pink-950/80 px-4 backdrop-blur-sm">
          <div className="max-w-2xl space-y-4 rounded-2xl border border-pink-300/40 bg-pink-950 p-8 text-center shadow-soft">
            <p className="text-lg text-pink-100">
              Oh no! It seems like your name is Rama Shapsough, and this button
              only works for people whose names are not ‘Rama Shapsough’. Better
              luck next time.
            </p>
            <button
              type="button"
              onClick={() => setNoModalOpen(false)}
              className="inline-flex items-center justify-center rounded-full border border-pink-300/50 bg-pink-100 px-5 py-2 text-sm font-semibold text-pink-900 transition hover:-translate-y-0.5 hover:bg-pink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {disclaimerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-pink-950 px-4">
          <div className="max-w-xl space-y-4 rounded-3xl border border-pink-300/40 bg-pink-900/70 p-8 text-center shadow-[0_30px_80px_-40px_rgba(244,114,182,0.9)]">
            <p className="text-lg font-semibold text-pink-100">
              Disclaimer
            </p>
            <p className="text-sm text-pink-200/80">
              This website was coded by Omar to be sent to Rama.
            </p>
            <button
              type="button"
              onClick={() => setDisclaimerOpen(false)}
              className="inline-flex items-center justify-center rounded-full bg-pink-200 px-6 py-3 text-sm font-semibold text-pink-900 transition hover:-translate-y-0.5 hover:bg-pink-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-200"
            >
              Accept &amp; enter
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
