import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { universeQuestion, ideaAwake } = await req.json();

    // sanitize + length guard
    const uq = (universeQuestion ?? "").toString().slice(0, 500);
    const ia = (ideaAwake ?? "").toString().slice(0, 500);

    if (!uq && !ia) {
      return NextResponse.json({ ok: false, error: "No questions provided." }, { status: 400 });
    }

    const apiKey = process.env.TOGETHER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: "Missing TOGETHER_API_KEY env var" }, { status: 500 });
    }

    const res = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        // good default Together chat model
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages: [
          {
            role: "system",
            content: "You are witty and philosophical. Reply in 2–4 clever, concise sentences.",
          },
          {
            role: "user",
            content: `Q1: ${uq}\nQ2: ${ia}\nPlease answer both thoughtfully.`,
          },
        ],
        temperature: 0.8,
        max_tokens: 240,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      // surface Together's message if present
      return NextResponse.json(
        { ok: false, error: data?.error?.message || JSON.stringify(data) || "Together API error" },
        { status: res.status }
      );
    }

    const answer =
      data?.choices?.[0]?.message?.content?.trim() ||
      "I’ve got thoughts… but they’re still forming in the stars.";

    return NextResponse.json({ ok: true, answer });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Server error" }, { status: 500 });
  }
}