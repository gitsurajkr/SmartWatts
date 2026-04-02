'use client';

import { HelpCircle, Mail, MessageCircle, BookOpen, Zap } from 'lucide-react';

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

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Help & Support</h1>
        <p className="text-muted-foreground mt-1">Find answers to common questions and get help</p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground text-sm">Documentation</p>
            <p className="text-xs text-muted-foreground">Learn how to use SmartWatts</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="font-medium text-foreground text-sm">Feedback</p>
            <p className="text-xs text-muted-foreground">Share your suggestions</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="font-medium text-foreground text-sm">Contact</p>
            <p className="text-xs text-muted-foreground">support@smartwatts.app</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-border bg-muted/30">
              <div className="flex items-start gap-3">
                <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground text-sm">{faq.q}</p>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
