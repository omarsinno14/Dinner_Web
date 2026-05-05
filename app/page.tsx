"use client";


import { FormEvent, useEffect, useMemo, useState } from "react";
import { SITE_CONFIG, ThemeColor } from "../lib/config";

type Step = "entry" | "color" | "invite" | "loading" | "time" | "location" | "terms" | "final" | "sent" | "locked";

export default function Home() {
  const [step, setStep] = useState<Step>("entry");
  const [enteredName, setEnteredName] = useState("");
  const [selectedColor, setSelectedColor] = useState<ThemeColor | null>(null);
  const [noAttempts, setNoAttempts] = useState(0);
  const [noShift, setNoShift] = useState({ x: 0, y: 0 });
  const [fakeTime, setFakeTime] = useState("");
  const [timeSubmitted, setTimeSubmitted] = useState(false);
  const [location, setLocation] = useState<number | null>(null);
  const [revealMessage, setRevealMessage] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [panicMessage, setPanicMessage] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const bgColor = selectedColor?.hex ?? "#f2f0ec";
  const noMessage = SITE_CONFIG.noMessages[Math.min(noAttempts, SITE_CONFIG.noMessages.length - 1)];
  const noTooltipVisible = step === "invite" && noAttempts > 0;

  useEffect(() => {
    if (step !== "loading") return;
    const t1 = setTimeout(() => setNoAttempts((n) => n), 1200);
    const t2 = setTimeout(() => setStep("time"), 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [step]);

  const card = useMemo(
    () =>
      ({ children }: { children: React.ReactNode }) => (
        <section
         
         
         
         
          className="w-full max-w-xl rounded-3xl border border-black/10 bg-white/75 p-6 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.35)] backdrop-blur md:p-8"
        >
          {children}
        </section>
      ),
    []
  );

  const handleEntry = () => {
    if (enteredName === "Dalia" || enteredName === "dalia") {
      setStep("color");
      return;
    }
    setStep("locked");
  };

  const submitMessage = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    const payload = {
      enteredName,
      selectedColorName: selectedColor?.name ?? "None",
      selectedColorHex: selectedColor?.hex ?? "None",
      fakeTimeSelected: fakeTime,
      actualDinnerTime: SITE_CONFIG.actualDinnerTime,
      locationCardNumber: location,
      requiredCheckboxAccepted: termsAccepted,
      writtenMessage: message,
      timestamp: new Date().toISOString()
    };
    const response = await fetch("/api/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (response.ok) setStep("sent");
    setSending(false);
  };

  return (
    <main className="min-h-screen px-4 py-10 text-[#171717] transition-colors duration-700" style={{ backgroundColor: bgColor }}>
      <div className="mx-auto flex min-h-[85vh] max-w-3xl items-center justify-center">
        
          {step === "entry" && card({ children: <div className="space-y-5 text-center"><h1 className="text-2xl font-medium">{SITE_CONFIG.namePrompt}</h1><input value={enteredName} onChange={(e) => setEnteredName(e.target.value)} className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 outline-none focus:border-black/35" /><button onClick={handleEntry} className="rounded-xl border border-black/20 px-5 py-2.5 hover:bg-black hover:text-white transition">{SITE_CONFIG.labels.entryButton}</button></div> })}
          {step === "locked" && card({ children: <div className="text-center"><p className="text-2xl font-medium">{SITE_CONFIG.wrongNameMessage}</p></div> })}
          {step === "color" && card({ children: <div className="space-y-5"><h2 className="text-xl font-medium text-center">Okay Dalia, pick your vibe for tonight.</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{SITE_CONFIG.colorOptions.map((c) => <button key={c.name} onClick={() => setSelectedColor(c)} className={`rounded-2xl border p-3 text-sm text-left transition ${selectedColor?.name === c.name ? "border-black/50 shadow-md" : "border-black/10"}`}><div className="mb-2 h-8 rounded-xl border border-black/10" style={{ background: c.hex }} /><p>{c.name}</p></button>)}</div><button disabled={!selectedColor} onClick={() => setStep("invite")} className="rounded-xl border border-black/20 px-5 py-2.5 disabled:opacity-40">{SITE_CONFIG.labels.continue}</button></div> })}
          {step === "invite" && card({ children: <div className="space-y-5 text-center"><p className="text-xl">Dalia, you are being asked out for dinner on Thursday, May 7th evening.<br />Please say yes or no.</p><div className="relative flex items-center justify-center gap-4"><button onClick={() => setStep("loading")} className="rounded-xl bg-black px-6 py-2.5 text-white">Yes</button><button onMouseEnter={() => { setNoAttempts((n) => n + 1); setNoShift({ x: (Math.random() - 0.5) * 80, y: (Math.random() - 0.5) * 40 }); }} onClick={() => { setNoAttempts((n) => n + 1); setNoShift({ x: (Math.random() - 0.5) * 40, y: (Math.random() - 0.5) * 20 }); }} style={{ transform: `translate(${noShift.x}px, ${noShift.y}px)` }} className="rounded-xl border border-black/20 bg-gray-200 px-6 py-2.5 text-gray-500 transition">No</button></div>{noTooltipVisible && <p className="text-sm text-black/70">{noMessage}</p>}</div> })}
          {step === "loading" && card({ children: <div className="space-y-3 text-center"><p>Checking if Dalia made the correct decision…</p><p className="text-sm text-black/70">Result: finally.</p></div> })}
          {step === "time" && card({ children: <div className="space-y-5"><p className="text-center text-xl">Good choice. Now pretend you have a say in the time.</p><div className="flex gap-2 overflow-x-auto pb-2">{SITE_CONFIG.timeSlots.map((slot) => <button key={slot} onClick={() => setFakeTime(slot)} className={`whitespace-nowrap rounded-xl border px-4 py-2 ${fakeTime === slot ? "border-black bg-black text-white" : "border-black/20"}`}>{slot}</button>)}</div><button onClick={() => setTimeSubmitted(true)} disabled={!fakeTime} className="rounded-xl border border-black/20 px-5 py-2.5 disabled:opacity-40">{SITE_CONFIG.labels.submitTime}</button>{timeSubmitted && <><p>Aslan mesh 3a zaw2ik, el hajez 8:30 😄</p><button onClick={() => setStep("location")} className="rounded-xl bg-black px-5 py-2.5 text-white">{SITE_CONFIG.labels.fineContinue}</button></>}</div> })}
          {step === "location" && card({ children: <div className="space-y-5"><p className="text-center text-xl">Now pick the location. I may or may not respect your choice.</p><div className="grid grid-cols-3 gap-3">{[1, 2, 3].map((n) => <button key={n} onClick={() => setLocation(n)} className="h-24 rounded-2xl border border-black/15 bg-white text-sm [transform-style:preserve-3d]">{location === n ? "Nevermind ma ha ellik" : n}</button>)}</div><button onClick={() => setRevealMessage("Nice try.")} className="rounded-xl border border-black/20 px-5 py-2.5">Reveal location</button>{revealMessage && <p>{revealMessage}</p>}{location && <button onClick={() => setStep("terms")} className="rounded-xl bg-black px-5 py-2.5 text-white">Confirm</button>}</div> })}
          {step === "terms" && card({ children: <div className="space-y-5"><label className="flex items-start gap-3"><input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-1" /><span>{SITE_CONFIG.labels.terms}</span></label><button disabled={!termsAccepted} onClick={() => setStep("final")} className="rounded-xl bg-black px-5 py-2.5 text-white disabled:opacity-40">Continue</button></div> })}
          {step === "final" && card({ children: <form onSubmit={submitMessage} className="space-y-4"><h3 className="text-xl font-medium">Dinner Reservation Summary</h3><ul className="space-y-1 text-sm"><li>Guest: Dalia</li><li>Decision: Yes</li><li>Color picked: {selectedColor?.name}</li><li>Time selected: irrelevant, but record it anyway ({fakeTime})</li><li>Actual time: {SITE_CONFIG.actualDinnerTime}</li><li>Location: Classified</li><li>Omar’s confidence level: Unreasonably high</li><li>Complaint status: Ignored</li></ul><p>Perfect. Thursday May 7th. 8:30 PM. Location: classified.<br />Dress code: be Dalia.</p><button type="button" onClick={() => setPanicMessage("Thinking privileges revoked.")} className="rounded-xl border border-black/20 px-4 py-2">I need to think about it.</button>{panicMessage && <p className="text-sm">{panicMessage}</p>}<label className="block text-sm">{SITE_CONFIG.labels.messageLabel}<textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={SITE_CONFIG.labels.messagePlaceholder} rows={4} className="mt-2 w-full rounded-2xl border border-black/15 px-4 py-3" /></label><button disabled={sending} className="rounded-xl bg-black px-5 py-2.5 text-white">{sending ? "Sending..." : SITE_CONFIG.labels.send}</button></form> })}
          {step === "sent" && card({ children: <div className="space-y-3 text-center"><p>Message sent. Complaint department will review within 3–5 business years.</p><p>See you Thursday at 8:30 😌</p></div> })}
        
      </div>
      {step !== "entry" && step !== "locked" && <footer className="text-center text-xs text-black/55">{SITE_CONFIG.footerText}</footer>}
    </main>
  );
}
