import React, { useState } from 'react';
import { validateNewsletterEmail } from '../utils/cafeLogic';

export const FooterBar: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = validateNewsletterEmail(email);
    if (!res.valid) {
      setStatus({ type: 'error', text: res.error ?? 'Enter a valid email.' });
      return;
    }
    setStatus({ type: 'success', text: 'Subscribed to seasonal roasts & events.' });
    setEmail('');
  };

  return (
    <footer className="relative z-20 bg-[#EFECE3] border-t border-[#2C3E2D]/15 px-4 md:px-8 py-2.5 md:py-3.5 shrink-0">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-12 gap-2.5 md:gap-4 items-center text-[11px] md:text-xs">
        {/* Cafe Hours */}
        <div className="md:col-span-3 space-y-0.5">
          <h3 className="font-serif-display text-xs md:text-sm font-semibold text-[#1E241E]">
            Cafe Hours
          </h3>
          <p className="text-[#2C3E2D] font-mono-tabular">Mon–Fri · 7am – 9pm</p>
          <p className="text-[#2C3E2D] font-mono-tabular">Sat–Sun · 8am – 9pm</p>
        </div>

        {/* Address */}
        <div className="md:col-span-3 space-y-0.5">
          <h3 className="font-serif-display text-xs md:text-sm font-semibold text-[#1E241E]">
            Address
          </h3>
          <p className="text-[#2C3E2D]">5213 Olivewood Street</p>
          <p className="text-[#2C3E2D]">Berkeley, CA 94704</p>
        </div>

        {/* Contact */}
        <div className="hidden md:block md:col-span-2 space-y-0.5">
          <h3 className="font-serif-display text-sm font-semibold text-[#1E241E]">Contact</h3>
          <p className="text-[#2C3E2D] font-mono-tabular">(510) 555-0194</p>
          <p className="text-[#2C3E2D]">hello@thedailybean.cafe</p>
        </div>

        {/* Newsletter Signup */}
        <div className="col-span-2 md:col-span-4">
          <form onSubmit={handleSubmit} className="space-y-1" noValidate>
            <label
              htmlFor="newsletter-email"
              className="block font-serif-display text-sm font-semibold text-[#1E241E]"
            >
              Sign up for our newsletter
            </label>
            <div className="flex items-center gap-2">
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setStatus(null);
                }}
                placeholder="Enter your email"
                className="flex-1 min-w-0 px-3 py-1.5 rounded-lg bg-white border border-[#2C3E2D]/20 text-xs text-[#1E241E] placeholder:text-[#2C3E2D]/45"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-[#2C3E2D] hover:bg-[#1E241E] text-[#F6F3EC] text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors"
              >
                Join
              </button>
            </div>
            {status && (
              <p
                role={status.type === 'error' ? 'alert' : 'status'}
                className={`text-[11px] font-medium ${
                  status.type === 'error' ? 'text-[#9e3f23]' : 'text-[#2C3E2D]'
                }`}
              >
                {status.text}
              </p>
            )}
          </form>
        </div>
      </div>
    </footer>
  );
};
