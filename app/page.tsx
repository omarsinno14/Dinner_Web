"use client";

import { useEffect, useMemo, useState } from "react";
import { SITE_CONFIG, ThemeColor } from "../lib/config";

type Step = "entry" | "locked" | "color" | "invite" | "loading" | "time" | "location" | "terms" | "final";

export default function Home() {
  const [step, setStep] = useState<Step>("entry");
  const [enteredName, setEnteredName] = useState("");
  const [selectedColor, setSelectedColor] = useState<ThemeColor | null>(null);
  const [noMessage, setNoMessage] = useState("");
  const [noShift, setNoShift] = useState({ x: 0, y: 0 });
  const [fakeTime, setFakeTime] = useState("");
  const [timeSubmitted, setTimeSubmitted] = useState(false);
  const [location, setLocation] = useState<number | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [panic, setPanic] = useState(false);
  const [message, setMessage] = useState("");
  const [mailOpened, setMailOpened] = useState(false);

  const bgColor = selectedColor?.hex ?? "#f2f0ec";

  useEffect(() => {
    if (step !== "loading") return;
    const t = setTimeout(() => setStep("time"), 2200);
    return () => clearTimeout(t);
  }, [step]);

  const cardClass = useMemo(
    () =>
      "w-full max-w-lg overflow-hidden rounded-3xl border border-black/10 bg-white/80 p-4 shadow-[0_16px_50px_-30px_rgba(0,0,0,0.45)] backdrop-blur sm:p-6 md:p-8",
    []
  );

  const triggerNo = () => {
    const randomMessage = SITE_CONFIG.noMessages[Math.floor(Math.random() * SITE_CONFIG.noMessages.length)];
    setNoMessage(randomMessage);
    setNoShift({ x: (Math.random() - 0.5) * 70, y: (Math.random() - 0.5) * 32 });
  };

  const handleSendToOmar = () => {
    const subject = "Dalia replied to the dinner website";

    const body = `
Name: ${enteredName}
Color picked: ${selectedColor?.name ?? "None"} (${selectedColor?.hex ?? "None"})
Fake time selected: ${fakeTime}
Actual time: 8:30 PM
Selected location card: ${location ?? "None"}
Accepted terms: ${termsAccepted ? "Yes" : "No"}

Message:
${message || "No message left."}

Timestamp:
${new Date().toISOString()}
`;

    const mailtoLink = `mailto:Omar.sinno2003@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
    setMailOpened(true);
  };


  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8 transition-colors duration-700 sm:px-6" style={{ backgroundColor: bgColor }}>
      <div className="mx-auto flex w-full max-w-3xl items-center justify-center">
        <section key={step} className={cardClass}>
            {step === "entry" && <div className="space-y-5 text-center"><h1 className="text-2xl font-medium">{SITE_CONFIG.prompts.name}</h1><input value={enteredName} onChange={(e) => setEnteredName(e.target.value)} className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 outline-none focus:border-black/35" /><button onClick={() => setStep(enteredName === "Dalia" || enteredName === "dalia" ? "color" : "locked")} className="w-full rounded-xl border border-black/20 px-5 py-2.5 transition hover:bg-black hover:text-white sm:w-auto">{SITE_CONFIG.buttons.enter}</button></div>}
            {step === "locked" && <p className="text-center text-2xl font-medium">{SITE_CONFIG.prompts.wrongName}</p>}
            {step === "color" && <div className="space-y-5"><h2 className="text-center text-xl font-medium">{SITE_CONFIG.prompts.color}</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{SITE_CONFIG.colorOptions.map((c) => <button key={c.name} onClick={() => setSelectedColor(c)} className={`rounded-2xl border p-3 text-left text-sm transition ${selectedColor?.name === c.name ? "border-black/45 shadow-md" : "border-black/10"}`}><div className="mb-2 h-8 rounded-xl border border-black/10" style={{ backgroundColor: c.hex }} /><div className="flex items-center justify-between gap-2"><span className="break-words">{c.name}</span>{selectedColor?.name === c.name && <span>✓</span>}</div></button>)}</div><button disabled={!selectedColor} onClick={() => setStep("invite")} className="w-full rounded-xl border border-black/20 px-5 py-2.5 disabled:opacity-40 sm:w-auto">{SITE_CONFIG.buttons.continue}</button></div>}
            {step === "invite" && <div className="space-y-5 text-center"><p className="text-base sm:text-xl">{SITE_CONFIG.prompts.inviteLine1}<br />{SITE_CONFIG.prompts.inviteLine2}</p><div className="relative flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"><button onClick={() => setStep("loading")} className="w-full rounded-xl bg-[#1f1f1f] px-6 py-2.5 text-white sm:w-auto">{SITE_CONFIG.buttons.yes}</button><button onMouseEnter={triggerNo} onMouseMove={triggerNo} onTouchStart={triggerNo} onClick={triggerNo} style={{ transform: `translate(${noShift.x}px, ${noShift.y}px)` }} className="w-full rounded-xl border border-black/20 bg-gray-100 px-6 py-2.5 text-gray-500 transition hover:cursor-not-allowed active:scale-[0.98] sm:w-auto">{SITE_CONFIG.buttons.no}</button></div>{noMessage && <p className="text-sm text-black/70">{noMessage}</p>}</div>}
            {step === "loading" && <div className="space-y-3 text-center"><p>{SITE_CONFIG.prompts.loading1}</p><p className="text-sm text-black/70">{SITE_CONFIG.prompts.loading2}</p></div>}
            {step === "time" && <div className="space-y-5"><p className="text-center text-base sm:text-xl">{SITE_CONFIG.prompts.time}</p><div className="flex flex-wrap gap-2 pb-2">{SITE_CONFIG.timeSlots.map((slot) => <button key={slot} onClick={() => setFakeTime(slot)} className={`whitespace-nowrap rounded-xl border px-4 py-2 text-sm sm:text-base ${fakeTime === slot ? "border-black bg-black text-white" : "border-black/20"}`}>{slot}</button>)}</div><button disabled={!fakeTime} onClick={() => setTimeSubmitted(true)} className="w-full rounded-xl border border-black/20 px-5 py-2.5 disabled:opacity-40 sm:w-auto">{SITE_CONFIG.buttons.submitTime}</button>{timeSubmitted && <><p className="text-sm sm:text-base">{SITE_CONFIG.prompts.forcedTime}</p><button onClick={() => setStep("location")} className="w-full rounded-xl bg-[#1f1f1f] px-5 py-2.5 text-white sm:w-auto">{SITE_CONFIG.buttons.fineContinue}</button></>}</div>}
            {step === "location" && <div className="space-y-5"><p className="text-center text-base sm:text-xl">{SITE_CONFIG.prompts.location}</p><div className="grid grid-cols-1 gap-3 sm:grid-cols-3">{[1, 2, 3].map((n) => <button key={n} onClick={() => setLocation(n)} className="h-24 w-full [perspective:1000px]"><div style={{ transform: `rotateY(${location === n ? 180 : 0}deg)` }} className="relative h-full w-full rounded-2xl border border-black/15 bg-white text-sm transition duration-500 [transform-style:preserve-3d]"><span className="absolute inset-0 grid place-items-center [backface-visibility:hidden]">{n}</span><span className="absolute inset-0 grid place-items-center text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">{SITE_CONFIG.locationFlipMessages[n as 1 | 2 | 3]}</span></div></button>)}</div><button onClick={() => setShowReveal(true)} className="w-full rounded-xl border border-black/20 px-5 py-2.5 sm:w-auto">{SITE_CONFIG.buttons.revealLocation}</button>{showReveal && <p>{SITE_CONFIG.prompts.reveal}</p>}{location && <button onClick={() => setStep("terms")} className="w-full rounded-xl bg-[#1f1f1f] px-5 py-2.5 text-white sm:w-auto">{SITE_CONFIG.buttons.confirm}</button>}</div>}
            {step === "terms" && <div className="space-y-5"><label className="flex items-start gap-3 text-sm sm:text-base"><input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-1" /><span>{SITE_CONFIG.prompts.terms}</span></label><button disabled={!termsAccepted} onClick={() => setStep("final")} className="w-full rounded-xl bg-[#1f1f1f] px-5 py-2.5 text-white disabled:opacity-40 sm:w-auto">{SITE_CONFIG.buttons.continue}</button></div>}
            {step === "final" && <div className="space-y-4"><h3 className="text-xl font-medium">Dinner Reservation Summary</h3><ul className="space-y-1 text-sm"><li>Guest: Dalia</li><li>Decision: Yes</li><li>Color picked: {selectedColor?.name}</li><li>Time selected: irrelevant, but record it anyway ({fakeTime})</li><li>Actual time: {SITE_CONFIG.actualDinnerTime}</li><li>Location card: {location}</li><li>Omar’s confidence level: Unreasonably high</li><li>Complaint status: Ignored</li></ul><p className="text-sm sm:text-base">{SITE_CONFIG.prompts.finalA}<br />{SITE_CONFIG.prompts.finalB}</p><button type="button" onClick={() => setPanic(true)} className="w-full rounded-xl border border-black/20 px-4 py-2 sm:w-auto">{SITE_CONFIG.buttons.emergency}</button>{panic && <p className="text-sm">{SITE_CONFIG.prompts.panic}</p>}<label className="block text-sm">{SITE_CONFIG.messageLabel}<textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder={SITE_CONFIG.messagePlaceholder} className="mt-2 w-full rounded-2xl border border-black/15 bg-white px-4 py-3" /></label><button type="button" onClick={handleSendToOmar} className="w-full rounded-xl bg-black px-5 py-2.5 text-white sm:w-auto">{SITE_CONFIG.buttons.send}</button>{mailOpened && <p className="mt-3 text-center text-sm text-neutral-700">Email opened. Now press send before changing your mind.</p>}</div>}
                      </section>
      </div>
      {!["entry", "locked"].includes(step) && <footer className="text-center text-xs text-black/55">{SITE_CONFIG.footerText}</footer>}
    </main>
  );
}
