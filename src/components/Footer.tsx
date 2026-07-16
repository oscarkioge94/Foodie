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
    <footer className="bg-dark-green text-cream-bg border-t-2 border-primary-teal pt-20 pb-12" id="footer-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top block */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-cream-bg/15">
          
          {/* Logo & Manifesto column */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center space-x-2">
              <Leaf className="w-5 h-5 text-gold-yellow fill-gold-yellow/10" />
              <span className="font-display font-black text-xl tracking-tight uppercase text-white-card">
                BECCA <span className="text-gold-yellow font-serif italic normal-case font-light">Foodies</span>
              </span>
            </div>
            <p className="font-sans text-xs text-cream-bg/75 leading-relaxed max-w-sm font-light">
              We celebrate authentic Kenyan home cooking, healthy lifestyle tips, and portion-conscious nutrition guidelines to cultivate physical wellness and cultural connection.
            </p>
            <div className="flex items-center space-x-2 text-[10px] font-mono text-gold-yellow font-bold uppercase tracking-[0.15em]">
              <span>ESTD 2014</span>
              <span>•</span>
              <span>Nairobi, Kenya</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-mono text-[10px] font-bold text-cream-bg/50 uppercase tracking-[0.2em]">
              BLOG CATEGORIES
            </h4>
            <div className="space-y-2 text-xs font-mono text-cream-bg/90 uppercase tracking-wider text-[11px]">
              <div className="flex justify-between border-b border-cream-bg/5 pb-1">
                <span>Kenyan Cuisines</span>
              </div>
              <div className="flex justify-between border-b border-cream-bg/5 pb-1">
                <span>Weight Loss Meals</span>
              </div>
              <div className="flex justify-between border-b border-cream-bg/5 pb-1">
                <span>Healthy Eating</span>
              </div>
              <div className="flex justify-between text-cream-bg/40 pt-1">
                <span>Breakfast, Lunch & Dinner</span>
              </div>
            </div>
          </div>

          {/* Newsletter subscription */}
          <div className="md:col-span-5 space-y-4">
            <h4 className="font-mono text-[10px] font-bold text-cream-bg/50 uppercase tracking-[0.2em]">
              RECEIVE FRESH RECIPES
            </h4>
            <p className="font-sans text-xs text-cream-bg/75 font-light">
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
                  className="flex items-center bg-white-card/5 border-2 border-cream-bg/15 rounded-none px-3 py-2 focus-within:border-gold-yellow transition-colors"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-transparent border-none font-mono text-xs text-cream-bg focus:outline-none placeholder-cream-bg/30 px-2 uppercase tracking-wider"
                  />
                  <button
                    type="submit"
                    className="bg-gold-yellow hover:bg-gold-yellow/90 text-dark-green p-2.5 rounded-none cursor-pointer transition-colors flex items-center justify-center border border-transparent"
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
                  className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-gold-yellow bg-gold-yellow/15 border-2 border-gold-yellow p-3 rounded-none"
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
        <div className="pt-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] font-mono text-cream-bg/55 uppercase tracking-wider">
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
            <span className="flex items-center text-gold-yellow">
              <Heart className="w-3.5 h-3.5 mr-1 text-pink-red fill-pink-red" />
              <span>Nourishing souls through traditional flavors</span>
            </span>
            <a href="#" className="hover:text-white-card transition-colors flex items-center">
              <span>Privacy Policy</span>
              <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </a>
            <a href="#" className="hover:text-white-card transition-colors flex items-center">
              <span>Disclaimer</span>
              <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </a>
          </div>

          <p className="font-mono text-[9px] tracking-[0.15em] text-center sm:text-right text-cream-bg/40">
            © 2026 BECCA FOODIES INC. ALL RIGHTS RESERVED.
          </p>
        </div>

      </div>
    </footer>
  );
}
