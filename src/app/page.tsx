"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, ArrowRight, Calendar } from "lucide-react";

export default function Page() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form)) as any;
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
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-28">
        <h1 className="text-5xl font-semibold">Every Transformation Starts Here.</h1>
        <p className="mt-5 text-lg text-zinc-300 max-w-2xl">
          A conversation, not a form. Tell us what slows you down — we’ll show you what it feels like when an hour is returned to every person, every day.
        </p>
        <div className="mt-8 flex gap-4">
          <a href="#connect">
            <Button size="lg" className="bg-emerald-400/20 text-emerald-300 border border-emerald-300/30">
              Start Your Conversation <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
          <a href="#book">
            <Button size="lg" variant="outline" className="border-zinc-700 text-zinc-200">
              Prefer a call? <Calendar className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
      </section>

      {/* Form */}
      <section id="connect" className="max-w-5xl mx-auto px-6 pb-12">
        <Card className="bg-zinc-950/60 border-zinc-800">
          <CardContent className="p-6">
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-sm text-zinc-300">
                  If Summit was beside you tomorrow, what would you hand over first?
                </label>
                <Textarea name="message" required minLength={3} maxLength={2000} className="mt-2" />
              </div>
              <Input name="name" placeholder="Name" required />
              <Input name="email" type="email" placeholder="Email" required />
              <Input name="org" placeholder="Organisation" required />
              <Input name="region" placeholder="AU / UK / EU / US / Other" required />
              <input name="persona" defaultValue="enterprise" hidden />
              <input name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" disabled={loading} className="bg-emerald-400/20 text-emerald-300 border border-emerald-300/30">
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</> : "Send message"}
                </Button>
              </div>
              <p className="md:col-span-2 text-xs text-zinc-500">No PHI required. Please don’t share patient data here.</p>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Calendar */}
      <section id="book" className="max-w-5xl mx-auto px-6 pb-24">
        <h3 className="text-xl font-medium">Prefer a real conversation?</h3>
        <p className="text-zinc-400 mt-1">Book 20 minutes with our team. Bring your questions — we’ll bring your roadmap.</p>
        <div className="mt-6 h-[620px] rounded-2xl overflow-hidden border border-zinc-800">
          <iframe
            src="https://calendly.com/your-summit-slot/20min?hide_gdpr_banner=1"
            className="w-full h-full"
          />
        </div>
      </section>
    </main>
  );
}
