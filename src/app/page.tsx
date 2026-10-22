import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const COBALT = "#0047CC";
const INK = "#080808";

const SPORTS = [
  "Football", "Basketball", "Soccer", "Baseball", "Tennis",
  "Swimming", "Track & Field", "Wrestling", "Volleyball", "Cycling",
  "Gymnastics", "Boxing", "Lacrosse", "Hockey", "Rugby",
  "Sailing", "Fencing", "Squash", "Paralympic", "Rowing",
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">

        {/* ── HERO ──────────────────────────────────────────────── */}
        <section className="relative min-h-[92vh] flex flex-col justify-end overflow-hidden" style={{backgroundColor: INK}}>
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />

          <div className="relative z-10 px-4 md:px-8 pb-16 max-w-7xl mx-auto w-full">
            <p className="text-white/50 font-barlow-condensed text-sm uppercase tracking-[0.2em] mb-6">
              Authenticated Memorabilia — Straight From the Athlete
            </p>

            <h1
              className="font-display text-white leading-none mb-8"
              style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" }}
            >
              EVERY<br />
              ATHLETE<br />
              HAS A<br />
              <span style={{ color: COBALT }}>STORY.</span>
            </h1>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/browse"
                className="text-white font-semibold text-lg px-8 py-4 inline-block transition-colors"
                style={{backgroundColor: COBALT}}
              >
                Shop Now
              </Link>
              <Link
                href="/signup/athlete"
                className="border border-white/30 text-white font-semibold text-lg px-8 py-4 inline-block hover:border-white transition-colors"
              >
                List Your Gear
              </Link>
            </div>

            <div className="mt-16 flex gap-12 border-t border-white/10 pt-8">
              {[
                { num: "Launching", label: "2026" },
                { num: "100%", label: "Story Verified" },
                { num: "Direct", label: "Athlete to Fan" },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div className="font-display text-white text-4xl">{num}</div>
                  <div className="text-white/50 text-sm mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SPORTS TICKER ────────────────────────────────────────── */}
        <div className="py-3 overflow-hidden" style={{backgroundColor: COBALT}}>
          <div className="flex gap-8" style={{ animation: "marquee 30s linear infinite" }}>
            {[...SPORTS, ...SPORTS].map((sport, i) => (
              <span key={i} className="text-white font-display text-sm whitespace-nowrap px-2">
                {sport} ·
              </span>
            ))}
          </div>
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </div>

        {/* ── HOW STORY WORKS ──────────────────────────────────────── */}
        <section className="py-24 px-4 max-w-7xl mx-auto">
          <h2 className="font-display text-5xl md:text-7xl mb-16" style={{color: INK}}>HOW IT WORKS</h2>
          <div className="grid md:grid-cols-3" style={{gap: "1px", backgroundColor: INK}}>
            {[
              {
                step: "01",
                title: "Athlete Lists",
                body: "Story-vetted athletes post their authentic gear — jerseys, shoes, signed photos, equipment. Every athlete is verified by our team before listing.",
              },
              {
                step: "02",
                title: "Fan Buys",
                body: "Purchase directly. Payment is held in escrow until your item arrives. A Story Certificate of Authenticity with a unique QR code ships with every order.",
              },
              {
                step: "03",
                title: "Athlete Ships",
                body: "We email the athlete a prepaid label. They pack and ship. Once delivered, payment releases directly to the athlete — minus our 15% platform fee.",
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="bg-white p-10">
                <div className="font-display text-6xl mb-4" style={{color: COBALT}}>{step}</div>
                <h3 className="font-display text-2xl mb-4" style={{color: INK}}>{title}</h3>
                <p className="leading-relaxed" style={{color: INK + "99"}}>{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── AUTHENTICITY SECTION ─────────────────────────────────── */}
        <section className="py-24 px-4" style={{backgroundColor: INK}}>
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-display text-sm tracking-widest mb-4" style={{color: COBALT}}>STORY VETTED. STORY VERIFIED.</p>
              <h2 className="font-display text-5xl md:text-6xl text-white mb-6">
                THE CERTIFICATE<br />CHANGES<br />EVERYTHING.
              </h2>
              <p className="text-white/60 leading-relaxed mb-8">
                Every Story purchase includes a physical Certificate of Authenticity with a unique ID and QR code. Scan it to watch the athlete hold the exact item — on video — before it shipped to you.
              </p>
              <div className="space-y-4">
                {[
                  "Unique ID: STR-YYYY-NNNNN-XX",
                  "QR code links to athlete video",
                  "Permanent blockchain-grade record",
                  "Transferable with item resale",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-white/70">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{backgroundColor: COBALT}}>
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </span>
                    {item}
                  </div>
                ))}
              </div>
              <Link
                href="/authenticity"
                className="inline-block mt-8 font-semibold px-6 py-3 transition-colors border"
                style={{borderColor: COBALT, color: COBALT}}
              >
                Learn About Authenticity
              </Link>
            </div>

            {/* COA mockup */}
            <div className="border border-white/10 p-8 bg-white/5">
              <div className="aspect-[3/4] border border-white/20 p-6 flex flex-col justify-between">
                <div>
                  <div className="font-display text-white text-2xl mb-1">STORY<span style={{color: COBALT}}>.</span></div>
                  <div className="text-white/40 text-xs">CERTIFICATE OF AUTHENTICITY</div>
                </div>
                <div className="space-y-3">
                  <div className="w-16 h-16 border flex items-center justify-center" style={{backgroundColor: COBALT + "33", borderColor: COBALT + "4D"}}>
                    <div className="text-xs font-mono" style={{color: COBALT}}>QR</div>
                  </div>
                  <div>
                    <div className="text-white/40 text-xs mb-1">Certificate ID</div>
                    <div className="text-white font-mono text-sm">STR-2026-00001-AB</div>
                  </div>
                  <div>
                    <div className="text-white/40 text-xs mb-1">Athlete</div>
                    <div className="text-white text-sm">Verified by Story Memorabilia</div>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <div className="text-white/30 text-xs">storymemorabilia.com/verify/STR-2026-00001-AB</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── DUAL SIGNUP ──────────────────────────────────────────── */}
        <section className="grid md:grid-cols-2">
          {/* Athlete panel */}
          <div id="athlete-signup" className="bg-white px-10 py-20 flex flex-col justify-center" style={{borderRight: `1px solid ${INK}22`}}>
            <p className="font-display text-sm tracking-widest mb-4" style={{color: COBALT}}>FOR ATHLETES</p>
            <h2 className="font-display text-4xl md:text-5xl mb-6" style={{color: INK}}>
              YOUR LEGACY.<br />YOUR PRICE.<br />YOUR FANS.
            </h2>
            <p className="mb-8 leading-relaxed max-w-md" style={{color: INK + "99"}}>
              List your gear in minutes. We handle authentication, shipping labels, and payments. You keep 85% of every sale.
            </p>
            <ul className="space-y-3 mb-10">
              {[
                "Free to list",
                "Prepaid shipping label emailed to you",
                "Direct payout once delivered",
                "You control your pricing",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm" style={{color: INK + "B3"}}>
                  <span className="w-4 h-4 rounded-full flex-shrink-0" style={{backgroundColor: COBALT}} />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/signup/athlete"
              className="text-white font-semibold text-lg px-8 py-4 inline-block transition-colors w-fit"
              style={{backgroundColor: INK}}
            >
              Apply as an Athlete
            </Link>
          </div>

          {/* Fan panel */}
          <div id="fan-signup" className="px-10 py-20 flex flex-col justify-center" style={{backgroundColor: COBALT}}>
            <p className="font-display text-white/60 text-sm tracking-widest mb-4">FOR FANS</p>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
              OWN A PIECE<br />OF THE STORY.
            </h2>
            <p className="text-white/70 mb-8 leading-relaxed max-w-md">
              Shop authenticated memorabilia — signed photos, worn jerseys, game-used equipment. Every item comes with a Story Certificate of Authenticity.
            </p>
            <ul className="space-y-3 mb-10">
              {[
                "Story-vetted athletes only",
                "Certificate of Authenticity with every order",
                "Secure escrow payments",
                "Every sport, every level",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                  <span className="w-4 h-4 rounded-full bg-white flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/signup/fan"
              className="font-semibold text-lg px-8 py-4 inline-block transition-colors w-fit"
              style={{backgroundColor: "white", color: COBALT}}
            >
              Create Fan Account
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
