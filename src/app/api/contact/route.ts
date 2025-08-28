import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  org: z.string().min(2).max(200),
  region: z.string().min(2).max(40),
  persona: z.enum(["enterprise","oem","media","careers","other"]),
  message: z.string().min(3).max(2000),
  honeypot: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
    }
    // Ignore spam bots
    if (parsed.data.honeypot) {
      return NextResponse.json({ ok: true });
    }

    // Lazy-create Resend inside the handler to avoid build-time key checks
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not set");
      return NextResponse.json({ ok: false, error: "Email service not configured" }, { status: 500 });
    }
    const resend = new Resend(apiKey);

    const from = process.env.CONTACT_FROM!;
    const to = process.env.CONTACT_TO!;

    await resend.emails.send({
      from,
      to,
      subject: `Summit Connect — ${parsed.data.persona} — ${parsed.data.org}`,
      replyTo: parsed.data.email, // <-- correct property name
      text: [
        `Name: ${parsed.data.name}`,
        `Email: ${parsed.data.email}`,
        `Org: ${parsed.data.org}`,
        `Region: ${parsed.data.region}`,
        `Persona: ${parsed.data.persona}`,
        "",
        "Message:",
        parsed.data.message,
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
