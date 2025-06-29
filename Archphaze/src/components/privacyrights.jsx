import React from "react";

const Privacyrights = () => {
  return (
    <div className="min-h-screen bg-white text-white py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-white uppercase mb-10 tracking-wide">
          Your <span className="text-black">Privacy <span className="text-red-500">Rights</span> </span>
        </h1>

        <div className="grid gap-8">
          {[
            {
              title: "1. Right to Know",
              desc: "You have the right to request details about the personal information we collect, use, disclose, and share. This includes categories, sources, and usage purposes.",
            },
            {
              title: "2. Right to Delete",
              desc: "You may request that we delete the personal information we have collected about you, subject to certain legal exceptions.",
            },
            {
              title: "3. Right to Opt-Out",
              desc: "You can opt out of the sale or sharing of your personal data with third parties for advertising and marketing purposes.",
            },
            {
              title: "4. Right to Non-Discrimination",
              desc: "We will not deny you services, charge different prices, or provide a different level of service if you exercise your privacy rights.",
            },
            {
              title: "5. How to Exercise Your Rights",
              desc: (
                <>
                  To exercise any of your privacy rights, please email us at{" "}
                  <a
                    href="mailto:privacy@archphaze.com"
                    className="text-red-400 underline hover:text-red-300 transition"
                  >
                    privacy@archphaze.com
                  </a>{" "}
                  or use the “Privacy Request” form in your account settings.
                </>
              ),
            },
          ].map((section, index) => (
            <section
              key={index}
              className="bg-white border border-white p-6 rounded-2xl shadow-lg hover:shadow-red-500/20 transition duration-300"
            >
              <h2 className="text-2xl font-semibold text-black mb-3">
                {section.title}
              </h2>
              <p className="text-black leading-relaxed">{section.desc}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Privacyrights;
