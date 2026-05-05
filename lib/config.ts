export type ThemeColor = {
  name: string;
  hex: string;
};

export const SITE_CONFIG = {
  recipientEmail: "Omar.sinno2003@gmail.com",
  emailSubject: "Dalia replied to the dinner website",
  actualDinnerTime: "8:30 PM",
  dinnerDateLabel: "Thursday, May 7th",
  namePrompt: "First things first… what’s your first name?",
  footerText: "Made by Omar. Unfortunately for you.",
  wrongNameMessage: "Wrong woman. Bye.",
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
  timeSlots: ["7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM"],
  labels: {
    entryButton: "Enter",
    continue: "Continue",
    yes: "Yes",
    no: "No",
    submitTime: "Submit time",
    fineContinue: "Fine, continue",
    revealLocation: "Reveal location",
    confirm: "Confirm",
    terms: "I agree that I was always going to say yes anyway.",
    messageLabel: "Leave Omar a message, threat, complaint, or emotional damage report.",
    messagePlaceholder: "Write something dramatic here…",
    send: "Send to Omar"
  }
} as const;
