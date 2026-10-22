import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#080808] text-white/60 mt-24">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="font-display text-white text-3xl mb-3">
              STORY<span style={{color:"#0047CC"}}>.</span>
            </div>
            <p className="text-sm leading-relaxed">
              Every athlete has a story. Now their legacy can live in your hands.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/browse" className="hover:text-white transition-colors">All Items</Link></li>
              <li><Link href="/browse?filter=drops" className="hover:text-white transition-colors">Limited Drops</Link></li>
              <li><Link href="/browse?filter=featured" className="hover:text-white transition-colors">Featured</Link></li>
              <li><Link href="/browse?category=jerseys" className="hover:text-white transition-colors">Jerseys</Link></li>
              <li><Link href="/browse?category=shoes" className="hover:text-white transition-colors">Shoes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Athletes</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/signup/athlete" className="hover:text-white transition-colors">List Your Gear</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/authenticity" className="hover:text-white transition-colors">Authentication</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Story</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs">© {new Date().getFullYear()} Story Memorabilia. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full inline-block" style={{backgroundColor:"#0047CC"}} />
              Story Vetted. Story Verified.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
