import { useState } from "react";
import toast from "react-hot-toast";

export function Newsletter() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed! Welcome to the Anandi Saree family.");
    setEmail("");
  }

  return (
    <section className="bg-royal-gradient py-16">
      <div className="mx-auto max-w-2xl px-ds-6 text-center text-cream-100">
        <h2 className="font-display text-3xl">Join Our Inner Circle</h2>
        <p className="mt-ds-4 text-ds-sm text-cream-200">
          Be the first to know about new Paithani drops, festive collections and exclusive offers.
        </p>
        <form onSubmit={handleSubmit} className="mx-auto mt-ds-8 flex max-w-md gap-ds-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-ds-4 text-ds-sm text-white placeholder:text-cream-300 focus:border-gold-300 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-gold-gradient px-ds-7 py-ds-4 font-heading text-ds-sm font-semibold text-royal-800 transition-transform hover:scale-105"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
