"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconArrowRight, IconCheck } from "./icons";

export default function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      }).format(new Date());
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clock needs the client
    setTime(fmt());
    const id = window.setInterval(() => setTime(fmt()), 30000);
    return () => window.clearInterval(id);
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setState("error");
      return;
    }
    setState("done");
  }

  return (
    <div>
      <h3 className="font-display text-lg">One useful note a month</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-on-ink">
        Short essays on strategy, design and engineering. No filler.
      </p>
      <AnimatePresence mode="wait" initial={false}>
        {state === "done" ? (
          <motion.p
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 flex items-center gap-2 text-sm font-medium text-aqua"
            role="status"
          >
            <IconCheck className="h-4 w-4" /> You&apos;re on the list.
          </motion.p>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} exit={{ opacity: 0 }} className="mt-5" noValidate>
            <div
              className={`glass-dark flex items-center rounded-full p-1 pl-4 transition-colors focus-within:border-aqua/60 ${
                state === "error" ? "!border-amber" : ""
              }`}
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state === "error") setState("idle");
                }}
                placeholder="you@company.com"
                aria-invalid={state === "error"}
                className="w-full bg-transparent text-sm text-paper outline-none placeholder:text-slate-on-ink/60"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal text-ink transition-colors hover:bg-aqua"
              >
                <IconArrowRight className="h-4 w-4" />
              </button>
            </div>
            {state === "error" && (
              <p className="mt-2 text-xs text-amber" role="alert">
                Enter a valid email, like name@company.com.
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
      {time && (
        <p className="mt-6 flex items-center gap-2 text-xs text-slate-on-ink">
          <span className="h-1.5 w-1.5 rounded-full bg-aqua" />
          Hyderabad, {time} IST
        </p>
      )}
    </div>
  );
}
