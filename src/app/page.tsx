"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, ArrowRight, Calendar } from "lucide-react";

type ContactFormData = {
  name: string;
  email: string;
  org: string;
  region: string;
  persona: "enterprise" | "oem" | "media" | "careers" | "other";
  message: string;
  honeypot?: string;
};

export default function Page() {
  const [loading, setLoading] = useState(false);

  function readForm(form: HTMLFormElement): ContactFormData {
    const fd = new FormData(form);
    return {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      org: String(fd.get("org") ?? ""),
      region: String(fd.get("region") ?? ""),
      persona: (String(fd.get("persona") ?? "enterprise") as ContactFormData["persona"]),
      message: String(fd.get("message") ?? ""),
      honeypot: fd.get("honeypot") ? String(fd.get("honeypot")) : undefined,
    };
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = readForm(form);

    setLoading(true);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);
    if (res.ok) {
      toast.success("You’re on the runway. We’ll be in touch shortly.");
      form.reset();
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-black text-zinc-100">
      {/* Header with Summit glyph + wordmark */}
      <header className="border-b border-zinc-900/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/summit-glyph.png"
              alt="Summit Glyph"
              width={28}
              height={28}
              priority
              className="opacity-90"
            />
            <Image
              src="/summit-wordmark.png"
              alt="Summit"
              width={120}
              height={24}
              priority
              className="opacity-90"
            />
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
            <a href="#connect" className="hover:text-zinc-200">Connect</a>
            <a href="#book" className="hover:text-zinc-200">Book a call</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* subtle mint glow background */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-1/3 -left-1/4 w-[120vw] h-[120vh] blur-3xl opacity-25"
            style={{ background: "radial-gradient(closest-side, rgba(16, 185, 129, 0.18), transparent 65%)" }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-6 py-24 md:py-28">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">
            Every Transformation Starts Here.
          </h1>
          <p className="mt-5 text-lg text-zinc-300 max-w-2xl">
            A conversation, not a form. Tell us what slows you down — we’ll show you what it feels like
            when an hour is returned to every person, every day.
          </p>
          <div className="mt-8 flex gap-4">
            <a href="#connect">
              <Button
                size="lg"
                className="bg-emerald-400/20 hover:bg-emerald-400/30 text-emerald-300 border border-emerald-300/30"
              >
                Start Your Conversation <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href="#book">
              <Button
                size="lg"
                variant="outline"
                className="border-zinc-700 text-zinc-200 hover:bg-zinc-900"
              >
                Prefer a call? <Calendar className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="connect" className="max-w-5xl mx-auto px-6 pb-12">
        <Card className="bg-zinc-950/60 border-zinc-800">
          <CardContent className="p-6">
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-sm text-zinc-300">
                  If Summit was beside you tomorrow, what would you hand over first?
                </label>
                <Textarea
                  name="message"
                  required
                  minLength={3}
                  maxLength={2000}
                  className="mt-2 bg-transparent text-white placeholder-zinc-500"
                  placeholder="Tell us what's slowing you down…"
                />
              </div>

              <Input
                name="name"
                placeholder="Name"
                required
                className="bg-transparent text-white placeholder-zinc-500 border-zinc-700"
              />
              <Input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="bg-transparent text-white placeholder-zinc-500 border-zinc-700"
              />
              <Input
                name="org"
                placeholder="Organisation"
                required
                className="bg-transparent text-white placeholder-zinc-500 border-zinc-700"
              />
              <Input
                name="region"
                placeholder="AU / UK / EU / US / Other"
                required
                className="bg-transparent text-white placeholder-zinc-500 border-zinc-700"
              />

              <input name="persona" defaultValue="enterprise" hidden />
              {/* honeypot for bots */}
              <input name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />

              <div className="md:col-span-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-400/20 text-emerald-300 border border-emerald-300/30"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
                    </>
                  ) : (
                    "Send message"
                  )}
                </Button>
              </div>

              <p className="md:col-span-2 text-xs text-zinc-500">
                No PHI required. Please don’t share patient data here.
              </p>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Calendar */}
      <section id="book" className="max-w-5xl mx-auto px-6 pb-24">
        <h3 className="text-xl font-medium">Prefer a real conversation?</h3>
        <p className="text-zinc-400 mt-1">
          Book 20 minutes with our team. Bring your questions — we’ll bring your roadmap.
        </p>
        <div className="mt-6 h-[620px] rounded-2xl overflow-hidden border border-zinc-800">
          <iframe
            src="https://calendly.com/your-summit-slot/20min?hide_gdpr_banner=1"
            className="w-full h-full"
          />
        </div>
      </section>

      {/* Footer with glyph */}
      <footer className="border-t border-zinc-900/80">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <Image
              src="/summit-glyph.png"
              alt="Summit Glyph"
              width={18}
              height={18}
              className="opacity-70"
            />
            <span>© {new Date().getFullYear()} Summit — Sovereign AI for healthcare</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#connect" className="hover:text-zinc-300">Connect</a>
            <a href="#book" className="hover:text-zinc-300">Book</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
