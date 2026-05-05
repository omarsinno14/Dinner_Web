import { NextResponse } from "next/server";
import { SITE_CONFIG } from "../../../lib/config";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "Dinner Invite <onboarding@resend.dev>",
        to: SITE_CONFIG.recipientEmail,
        subject: SITE_CONFIG.emailSubject,
        text: `Dalia dinner website submission\n\nName: ${body.enteredName}\nSelected color: ${body.selectedColorName} (${body.selectedColorHex})\nFake time selected: ${body.fakeTimeSelected}\nActual dinner time: ${body.actualDinnerTime}\nLocation card number: ${body.locationCardNumber}\nAccepted checkbox: ${body.requiredCheckboxAccepted}\nMessage: ${body.writtenMessage}\nTimestamp: ${body.timestamp}`
      })
    });

    if (!response.ok) {
      return NextResponse.json({ success: false, error: "Email provider error" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}
