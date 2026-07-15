import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Leaf, Heart, ArrowUpRight, CheckCircle } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-[#1A1A1A] text-[#FDFBF7] border-t-2 border-[#1A1A1A] pt-20 pb-12" id="footer-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top block */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#FDFBF7]/15">
          
          {/* Logo & Manifesto column */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center space-x-2">
              <Leaf className="w-5 h-5 text-[#C4A484] fill-[#C4A484]/10" />
              <span className="font-display font-black text-xl tracking-tight uppercase text-[#FDFBF7]">
                BECCA <span className="text-[#C4A484] font-serif italic normal-case font-light">Foodies</span>
              </span>
            </div>
            <p className="font-sans text-xs text-[#FDFBF7]/65 leading-relaxed max-w-sm font-light">
              We celebrate authentic Kenyan home cooking, healthy lifestyle tips, and portion-conscious nutrition guidelines to cultivate physical wellness and cultural connection.
            </p>
            <div className="flex items-center space-x-2 text-[10px] font-mono text-[#C4A484] font-bold uppercase tracking-[0.15em]">
              <span>ESTD 2014</span>
              <span>•</span>
              <span>Nairobi, Kenya</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-mono text-[10px] font-bold text-[#FDFBF7]/50 uppercase tracking-[0.2em]">
              BLOG CATEGORIES
            </h4>
            <div className="space-y-2 text-xs font-mono text-[#FDFBF7]/80 uppercase tracking-wider text-[11px]">
              <div className="flex justify-between border-b border-[#FDFBF7]/5 pb-1">
                <span>Kenyan Cuisines</span>
              </div>
              <div className="flex justify-between border-b border-[#FDFBF7]/5 pb-1">
                <span>Weight Loss Meals</span>
              </div>
              <div className="flex justify-between border-b border-[#FDFBF7]/5 pb-1">
                <span>Healthy Eating</span>
              </div>
              <div className="flex justify-between text-[#FDFBF7]/40 pt-1">
                <span>Breakfast, Lunch & Dinner</span>
              </div>
            </div>
          </div>

          {/* Newsletter subscription */}
          <div className="md:col-span-5 space-y-4">
            <h4 className="font-mono text-[10px] font-bold text-[#FDFBF7]/50 uppercase tracking-[0.2em]">
              RECEIVE FRESH RECIPES
            </h4>
            <p className="font-sans text-xs text-[#FDFBF7]/70 font-light">
              Subscribe to get notified whenever Chef Becca posts new traditional recipes, smart eating guidelines, or wellness articles.
            </p>

            <AnimatePresence mode="wait">
              {!isSubscribed ? (
                <motion.form
                  key="newsletter"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubscribe}
                  className="flex items-center bg-[#FDFBF7]/5 border-2 border-[#FDFBF7]/15 rounded-none px-3 py-2 focus-within:border-[#C4A484] transition-colors"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-transparent border-none font-mono text-xs text-[#FDFBF7] focus:outline-none placeholder-[#FDFBF7]/30 px-2 uppercase tracking-wider"
                  />
                  <button
                    type="submit"
                    className="bg-[#C4A484] hover:bg-[#C4A484]/90 text-[#1A1A1A] p-2.5 rounded-none cursor-pointer transition-colors flex items-center justify-center border border-transparent"
                    id="newsletter-subscribe-btn"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="news-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#C4A484] bg-[#C4A484]/15 border-2 border-[#C4A484] p-3 rounded-none"
                  id="newsletter-success-notif"
                >
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Harvest logs connected! Meet you in the soil.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Bottom copyright / credentials */}
        <div className="pt-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] font-mono text-[#FDFBF7]/55 uppercase tracking-wider">
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
            <span className="flex items-center text-[#C4A484]">
              <Heart className="w-3.5 h-3.5 mr-1 fill-[#C4A484]/20" />
              <span>Nourishing souls through traditional flavors</span>
            </span>
            <a href="#" className="hover:text-[#FDFBF7] transition-colors flex items-center">
              <span>Privacy Policy</span>
              <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </a>
            <a href="#" className="hover:text-[#FDFBF7] transition-colors flex items-center">
              <span>Disclaimer</span>
              <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </a>
          </div>

          <p className="font-mono text-[9px] tracking-[0.15em] text-center sm:text-right text-[#FDFBF7]/40">
            © 2026 BECCA FOODIES INC. ALL RIGHTS RESERVED.
          </p>
        </div>

      </div>
    </footer>
  );
}
