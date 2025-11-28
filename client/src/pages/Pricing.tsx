import { Check, Zap, Globe } from "lucide-react";
import { useState } from "react";

type Currency = "USD" | "AUD" | "CAD" | "GBP" | "INR";

export default function Pricing() {
  const [currency, setCurrency] = useState<Currency>("USD");

  // Fixed pricing per currency (market-based, not converted)
  const currencySymbols: Record<Currency, string> = {
    USD: "$",
    AUD: "A$",
    CAD: "C$",
    GBP: "£",
    INR: "₹",
  };

  const getPriceForCurrency = (
    usdPrice: number,
    audPrice: number,
    cadPrice: number,
    gbpPrice: number,
    inrPrice: number
  ): number => {
    const prices: Record<Currency, number> = {
      USD: usdPrice,
      AUD: audPrice,
      CAD: cadPrice,
      GBP: gbpPrice,
      INR: inrPrice,
    };
    return prices[currency];
  };

  const plans = [
    {
      name: "Weekly",
      description: "Perfect for intense job search weeks",
      usdPrice: 4.99,
      audPrice: 7.49,
      cadPrice: 5.99,
      gbpPrice: 3.99,
      inrPrice: 149,
      isPopular: false,
      period: "week",
      cta: "Start Weekly",
      features: [
        "Unlimited resume enhancements",
        "Unlimited cover letters",
        "Unlimited job fits",
        "Unlimited tailored resumes",
        "Full dashboard access",
        "Priority support",
      ],
    },
    {
      name: "Monthly",
      description: "Our most popular plan",
      usdPrice: 9.99,
      audPrice: 14.99,
      cadPrice: 11.99,
      gbpPrice: 8.99,
      inrPrice: 349,
      isPopular: true,
      period: "month",
      cta: "Start Monthly",
      features: [
        "Unlimited resume enhancements",
        "Unlimited cover letters",
        "Unlimited job fits",
        "Unlimited tailored resumes",
        "Full dashboard access",
        "Early access to Phase 3 features",
        "Priority support",
        "Regular updates",
      ],
    },
    {
      name: "Yearly",
      description: "Best value - Save 35%",
      usdPrice: 79.99,
      audPrice: 119,
      cadPrice: 94,
      gbpPrice: 69,
      inrPrice: 2499,
      isPopular: false,
      period: "year",
      cta: "Start Yearly",
      isBilled: "yearly",
      features: [
        "Everything in Monthly",
        "35% discount vs monthly",
        "Free Gmail integration",
        "Early Beta access to Interview Prep AI",
        "Free extension access",
        "Priority support",
        "Annual discount applied",
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 mb-6 border border-blue-200">
              <Zap className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-semibold text-blue-600">
                Flexible Plans for Every Stage
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Pricing That Works for You
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Start with 1 week free, then choose a plan. All paid plans include
              unlimited access to all features.
            </p>

            {/* Currency Switcher */}
            <div className="flex items-center justify-center gap-3 mb-12">
              <Globe className="h-5 w-5 text-gray-600" />
              <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                {(["USD", "AUD", "CAD", "GBP", "INR"] as Currency[]).map(
                  (curr) => (
                    <button
                      key={curr}
                      onClick={() => setCurrency(curr)}
                      className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                        currency === curr
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {curr}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Free Trial Banner */}
          <div className="mb-16 p-8 rounded-2xl border-2 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                ✨ Start Your Free 1-Week Trial
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                No credit card required. Full access to all features.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[
                { label: "Resume Enhancements", allowance: "Up to 3/day" },
                { label: "Cover Letters", allowance: "Up to 3/day" },
                { label: "JD Resume Enhancements", allowance: "Up to 3/day" },
                { label: "Resume Saves", allowance: "Unlimited (1 at a time)" },
                { label: "Dashboard Access", allowance: "Full Access" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-white border border-green-200 text-center"
                >
                  <p className="text-sm text-gray-600 mb-2">{item.label}</p>
                  <p className="text-xl font-bold text-green-600">
                    {item.allowance}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg">
                Start Your Free Trial
              </button>
              <p className="text-sm text-gray-600 mt-3">
                After 7 days, choose a plan to continue using CareerBoost
              </p>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
              Choose Your Plan After Free Trial
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all relative flex flex-col bg-white ${
                    plan.isPopular
                      ? "border-blue-400 shadow-2xl scale-105 md:scale-100 md:ring-2 md:ring-blue-400 p-8"
                      : "border-gray-200 hover:border-gray-300 shadow-lg p-8"
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1 rounded-full text-sm font-bold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <div>
                      <span className="text-5xl font-bold text-gray-900">
                        {currencySymbols[currency]}
                        {getPriceForCurrency(
                          plan.usdPrice,
                          plan.audPrice,
                          plan.cadPrice,
                          plan.gbpPrice,
                          plan.inrPrice
                        )}
                      </span>
                      {plan.period && (
                        <span className="text-gray-600 ml-2">
                          /{plan.period}
                        </span>
                      )}
                      {plan.isBilled && (
                        <p className="text-sm text-gray-600 mt-2">
                          Billed {plan.isBilled}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    className={`w-full py-3 rounded-lg font-semibold mb-8 transition-all ${
                      plan.isPopular
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                        : "border-2 border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    {plan.cta}
                  </button>

                  <div className="space-y-4 flex-1">
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Founder Offer */}
          <div className="mb-16 p-8 rounded-2xl border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                🚀 Founder's Launch Offer
              </h2>
              <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                Be part of our journey! Early supporters get exclusive benefits.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 border border-purple-200">
                  <p className="text-3xl font-bold text-purple-600 mb-2">
                    {currencySymbols[currency]}
                    {getPriceForCurrency(5, 7.49, 5.99, 3.99, 149)}
                  </p>
                  <p className="font-semibold text-gray-900 mb-2">
                    Lifetime Monthly Offer
                  </p>
                  <p className="text-sm text-gray-600">
                    For the first 1,000 users only
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 border border-purple-200">
                  <p className="text-3xl font-bold text-purple-600 mb-2">50%</p>
                  <p className="font-semibold text-gray-900 mb-2">
                    Off Yearly Plan
                  </p>
                  <p className="text-sm text-gray-600">
                    Save big with annual commitment
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 border border-purple-200">
                  <p className="text-3xl font-bold text-purple-600 mb-2">7</p>
                  <p className="font-semibold text-gray-900 mb-2">
                    Day Free Trial
                  </p>
                  <p className="text-sm text-gray-600">
                    Premium features, zero commitment
                  </p>
                </div>
              </div>

              <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg">
                Claim Your Founder's Offer
              </button>

              <p className="text-sm text-gray-600 mt-4">
                Limited to first 1,000 users. Offer ends when capacity is
                reached.
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: "Can I change plans anytime?",
                  a: "Yes! You can upgrade, downgrade, or cancel your plan anytime. Changes take effect at the next billing cycle.",
                },
                {
                  q: "Is there a setup fee?",
                  a: "No setup fees at all. You only pay for the plan you choose.",
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards, PayPal, and regional payment methods.",
                },
                {
                  q: "Do you offer refunds?",
                  a: "We offer a 7-day money-back guarantee if you're not satisfied with any paid plan.",
                },
                {
                  q: "Will the pricing change in the future?",
                  a: "Early customers will keep their pricing locked in. Any future changes won't affect existing subscribers.",
                },
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-lg border border-gray-200 bg-gray-50"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center p-12 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Boost Your Career?
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Join thousands of students landing their dream jobs.
            </p>
            <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl">
              Start Your Free Trial Today
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
