export type ThemeColor = {
  name: string;
  hex: string;
};

export const SITE_CONFIG = {
  recipientEmail: "Omar.sinno2003@gmail.com",
  emailSubject: "Dalia replied to the dinner website",
  actualDinnerTime: "8:30 PM",
  dinnerDateLine: "Thursday May 7th",
  footerText: "Made by Omar. Unfortunately for you.",
  prompts: {
    name: "What is your first name?",
    color: "Okk Dalia, pick a color eza bet ride:",
    inviteLine1: "Metel ma elna, Dinner on Thursday May 7th Belel",
    inviteLine2: "Please say yes or no.",
    loading1: "Checking if Dalia is being stupid a smart...",
    loading2: "Dalia picked yes, hence smart",
    time: "Good Choice, now please pick a time",
    forcedTime: "Aslan mesh 3a zaw2ik, el hajez 8:30 😄",
    location: "Now pick the location. I may or may not respect your choice.",
    terms: "I agree enno Omar Sinno the funniest and smartest human being on planet earth",
    panic: "Tkheyale al, lol",
    reveal: "Nice try.",
    wrongName: "Wrong woman. Bye.",
    finalA: "Perfect. Thursday May 7th. 8:30 PM. Location: classified.",
    finalB: "Dress code: be Dalia.",
    sentA: "Message sent. Complaint department will review within 3–5 business years.",
    sentB: "See you Thursday at 8:30 😌"
  },
  buttons: {
    enter: "Enter",
    continue: "Continue",
    yes: "Yes",
    no: "No",
    submitTime: "Submit time",
    fineContinue: "Fine, continue",
    revealLocation: "Reveal location",
    confirm: "Confirm",
    emergency: "I need to think about it.",
    send: "Send to Omar"
  },
  messageLabel: "Leave Omar a message, threat, complaint, or emotional damage report.",
  messagePlaceholder: "Write something dramatic here…",
  noMessages: [
    "You cannot pick this because your name is Dalia 🙃",
    "Still no.",
    "Dalia stop.",
    "This button has resigned."
  ],
  colorOptions: [
    { name: "Violet", hex: "#D8C7F2" },
    { name: "Blue", hex: "#C9DCF7" },
    { name: "Pink", hex: "#F5C9D6" },
    { name: "Green", hex: "#CDE8D2" },
    { name: "Orange", hex: "#F3C8A2" },
    { name: "Navy Blue", hex: "#B9C7D9" },
    { name: "Oil Green", hex: "#B7C7A5" },
    { name: "Soft Yellow", hex: "#F4E7B0" }
  ] as ThemeColor[],
  timeSlots: ["7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM"]
} as const;
