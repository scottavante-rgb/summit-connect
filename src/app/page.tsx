"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";

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
  const [submitted, setSubmitted] = useState(false);

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
      setSubmitted(true);
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <main role="main" className="min-h-screen bg-black text-zinc-100 pt-16">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-40 bg-zinc-950/40 backdrop-blur-md border-b border-zinc-900/70">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/summit-glyph.png" alt="Summit Glyph" width={28} height={28} priority />
            <Image src="/summit-wordmark.png" alt="Summit" width={120} height={24} priority />
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
            <a href="#connect" className="hover:text-zinc-200">Connect</a>
            <a href="#fun" className="hover:text-zinc-200">For fun</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-1/3 -left-1/4 w-[120vw] h-[120vh] blur-3xl opacity-25"
            style={{ background: "radial-gradient(closest-side, rgba(16,185,129,0.18), transparent 65%)" }}
          />
        </div>
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">
            Every Transformation Starts Here.
          </h1>
          <p className="mt-5 text-lg md:text-xl text-zinc-300 max-w-2xl leading-relaxed">
            A conversation, not a form. Tell us what slows you down — we’ll show you what it feels like
            when an hour is returned to every person, every day.
          </p>
          <div className="mt-10 flex gap-4">
            <a href="#connect">
              <Button size="lg" className="bg-emerald-400/20 text-emerald-300 border border-emerald-300/30">
                Start Your Conversation <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href="#fun">
              <Button size="lg" variant="outline" className="border-zinc-700 text-zinc-200 hover:bg-zinc-900">
                Just for fun
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="connect" className="max-w-6xl mx-auto px-6 pb-16">
        <Card className="bg-zinc-950/60 border-zinc-800">
          <CardContent className="p-6 md:p-8">
            {!submitted ? (
              <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="md:col-span-2">
                  <label htmlFor="message" className="text-sm text-zinc-300">
                    If Summit was beside you tomorrow, what would you hand over first?
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    minLength={3}
                    maxLength={2000}
                    className="mt-2 bg-transparent text-white placeholder-zinc-500 border-zinc-700"
                    placeholder="Tell us what's slowing you down…"
                  />
                </div>
                <Input name="name" placeholder="Name" className="bg-transparent text-white placeholder-zinc-500 border-zinc-700" />
                <Input name="email" placeholder="Email" className="bg-transparent text-white placeholder-zinc-500 border-zinc-700" />
                <Input name="org" placeholder="Organisation" className="bg-transparent text-white placeholder-zinc-500 border-zinc-700" />
                <Input name="region" placeholder="AU / UK / EU / US / Other" className="bg-transparent text-white placeholder-zinc-500 border-zinc-700" />
                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit" disabled={loading} className="bg-emerald-400/20 text-emerald-300 border border-emerald-300/30">
                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</> : "Send message"}
                  </Button>
                </div>
              </form>
            ) : (
              <div>Thanks — we got your note!</div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Fun Form */}
      <section id="fun" className="max-w-6xl mx-auto px-6 pb-28">
        <h3 className="text-xl md:text-2xl font-medium">Just for fun</h3>
        <p className="text-zinc-400 mt-1">Answer a couple of fun questions — no strings attached.</p>
        <Card className="mt-6 bg-zinc-950/60 border-zinc-800">
          <CardContent className="p-6 md:p-8">
            <form className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="icecream" className="text-sm text-zinc-300">Favourite ice cream flavour</label>
                <Input id="icecream" placeholder="Mint choc chip?" className="mt-2 bg-transparent text-white placeholder-zinc-500 border-zinc-700" />
              </div>
              <div>
                <label htmlFor="holiday" className="text-sm text-zinc-300">Dream holiday destination</label>
                <Input id="holiday" placeholder="Tuscany? Tokyo? Iceland?" className="mt-2 bg-transparent text-white placeholder-zinc-500 border-zinc-700" />
              </div>
              <div className="flex justify-end">
                <Button type="button" className="bg-emerald-400/20 text-emerald-300 border border-emerald-300/30"
                  onClick={() => toast.info("Fun answers submitted!")}>
                  Submit for fun
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
        <div className="max-w-6xl mx-auto px-6 py-7 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <Image src="/summit-glyph.png" alt="Summit Glyph" width={18} height={18} className="opacity-70" />
            <span>© {new Date().getFullYear()} Summit — Sovereign AI for healthcare</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#connect" className="hover:text-zinc-300">Connect</a>
            <a href="#fun" className="hover:text-zinc-300">For fun</a>
          </div>
        </div>
      </footer>
    </main>
  );
}