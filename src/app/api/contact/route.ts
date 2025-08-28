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
  honeypot: z.string().optional(), // spam trap
});

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
    }
    if (parsed.data.honeypot) {
      return NextResponse.json({ ok: true }); // silently drop bots
    }

    await resend.emails.send({
      from: process.env.CONTACT_FROM!,
      to: process.env.CONTACT_TO!,
      subject: `Summit Connect — ${parsed.data.persona} — ${parsed.data.org}`,
      reply_to: parsed.data.email,
      text: [
        `Name: ${parsed.data.name}`,
        `Email: ${parsed.data.email}`,
        `Org: ${parsed.data.org}`,
        `Region: ${parsed.data.region}`,
        `Persona: ${parsed.data.persona}`,
        ``,
        `Message:`,
        parsed.data.message,
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
