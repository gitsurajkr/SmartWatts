'use client';

import { useState } from 'react';
import { HelpCircle, Mail, MessageCircle, BookOpen, Zap, ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How is my electricity bill calculated?',
    a: 'We use the formula: Monthly Units = (Watts x Hours/Day x Days/Week x 4) / 1000. The bill is then calculated as Monthly Units x Rate per kWh (₹8).',
  },
  {
    q: 'How do I add a new appliance?',
    a: 'Go to the Devices page and click "Add Device". You can either fill in the details manually or use a preset for common appliances.',
  },
  {
    q: 'What does the savings simulation show?',
    a: 'The Savings page simulates how much you could save if you reduce each appliance\'s usage by 1 hour per day. It shows per-device and total potential savings.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. Your data is stored securely in our database and is only accessible through your authenticated account. Each user\'s data is completely isolated.',
  },
  {
    q: 'What does "Active" vs "Standby" mean?',
    a: 'Active devices are currently in regular use. Standby devices are registered but may not be actively contributing to your daily consumption calculations.',
  },
  {
    q: 'How accurate are the projections?',
    a: 'Projections are based on the usage patterns you enter. The more accurate your hours/day and days/week inputs, the more precise the estimates will be.',
  },
];

const quickLinks = [
  {
    icon: BookOpen,
    title: 'Documentation',
    desc: 'Learn how to use SmartWatts',
    iconBg: 'bg-primary/10',
    gradient: 'from-[#0ea5e9] to-[#00e5ff]',
  },
  {
    icon: MessageCircle,
    title: 'Feedback',
    desc: 'Share your suggestions',
    iconBg: 'bg-[#22c55e]/10',
    gradient: 'from-[#22c55e] to-[#4ade80]',
  },
  {
    icon: Mail,
    title: 'Contact',
    desc: 'support@smartwatts.app',
    iconBg: 'bg-[#a78bfa]/10',
    gradient: 'from-[#a78bfa] to-[#818cf8]',
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Help & Support</h1>
        <p className="text-muted-foreground mt-1 text-sm">Find answers to common questions and get help</p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickLinks.map((link, idx) => {
          const LinkIcon = link.icon;
          return (
            <div
              key={link.title}
              className={`glass-card rounded-2xl p-5 flex items-center gap-4 group cursor-pointer relative overflow-hidden animate-fade-up stagger-${idx + 1}`}
            >
              <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${link.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className={`w-11 h-11 rounded-xl ${link.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                <LinkIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{link.title}</p>
                <p className="text-xs text-muted-foreground">{link.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="glass-card rounded-2xl p-6 animate-fade-up stagger-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`rounded-xl border transition-all duration-300 ${
                  isOpen ? 'border-primary/20 bg-primary/[0.03]' : 'border-border glass'
                } animate-fade-up stagger-${Math.min(idx + 1, 8)}`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center gap-3 p-4 text-left group"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isOpen ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    <Zap className={`w-4 h-4 transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <p className={`font-semibold text-sm flex-1 transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-foreground'}`}>
                    {faq.q}
                  </p>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-sm text-muted-foreground px-4 pb-4 pl-[3.75rem] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
