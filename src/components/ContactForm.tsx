"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { site } from "@/lib/site";

export default function ContactForm() {
  const t = useTranslations("ContactPage");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const subject = `${t("title")} — ${name}`;
    const body = `${message}\n\n${email}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
      <div>
        <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-ink-900">
          {t("nameLabel")}
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("namePlaceholder")}
          className="w-full rounded-xl border border-line bg-card px-4 py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-green-600"
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-ink-900">
          {t("emailLabel")}
        </label>
        <input
          id="contact-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailPlaceholder")}
          className="w-full rounded-xl border border-line bg-card px-4 py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-green-600"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-ink-900">
          {t("messageLabel")}
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("messagePlaceholder")}
          className="w-full resize-none rounded-xl border border-line bg-card px-4 py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-green-600"
        />
      </div>

      <button
        type="submit"
        className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-forest-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-forest-800"
      >
        {t("submit")}
      </button>
    </form>
  );
}
