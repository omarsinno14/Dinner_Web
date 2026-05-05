import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE_CONFIG } from "../../../lib/config";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      enteredName,
      selectedColorName,
      selectedColorHex,
      selectedFakeTime,
      actualTime,
      selectedLocationCard,
      acceptedTerms,
      message,
      timestamp
    } = body;

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Dinner Invite <onboarding@resend.dev>",
      to: SITE_CONFIG.recipientEmail,
      subject: SITE_CONFIG.emailSubject,
      text: `Dalia dinner website submission\n\nName: ${enteredName}\nColor picked: ${selectedColorName} (${selectedColorHex})\nFake time selected: ${selectedFakeTime}\nActual time: ${actualTime}\nSelected location card number: ${selectedLocationCard}\nAccepted terms: ${acceptedTerms}\nMessage: ${message}\nTimestamp: ${timestamp}`
    });

    if (error) {
      return NextResponse.json({ success: false, error: "Email provider error" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}
