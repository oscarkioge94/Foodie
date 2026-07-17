import { motion } from "motion/react";
import { ArrowRight, Sparkles, Sprout, Heart } from "lucide-react";
import { getImageUrl } from "../utils/image";

interface HeroProps {
  onExploreRecipes: () => void;
  onExploreArticles: () => void;
}

export default function Hero({ onExploreRecipes, onExploreArticles }: HeroProps) {
  return (
    <section className="relative min-h-screen bg-cream-bg pt-28 pb-16 flex items-center overflow-hidden" id="hero-section">
      {/* Decorative Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft pulsing green glowing orb */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 40, 0],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-bright-lime/10 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -50, 0],
            y: [0, 20, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-1/4 -right-1/4 w-[700px] h-[700px] rounded-full bg-gold-yellow/5 blur-3xl"
        />

        {/* Floating Sparkle / Star 1 */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 360],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-[10%] text-gold-yellow/40"
        >
          <Sparkles className="w-6 h-6 stroke-[1.5]" />
        </motion.div>

        {/* Floating Leaf / Sprout 2 */}
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -12, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 left-[45%] text-primary-teal/20"
        >
          <Sprout className="w-8 h-8 stroke-[1.5]" />
        </motion.div>

        {/* Floating Heart 3 */}
        <motion.div
          animate={{
            y: [0, -25, 0],
            scale: [0.9, 1.1, 0.9],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 right-[15%] text-pink-red/10"
        >
          <Heart className="w-10 h-10 stroke-[1.5] fill-current" />
        </motion.div>
      </div>

      {/* Structural Accent Lines */}
      <div className="absolute top-0 left-12 w-px h-full bg-primary-teal/5 hidden md:block" />
      <div className="absolute top-0 right-12 w-px h-full bg-primary-teal/5 hidden md:block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content Block */}
          <div className="lg:col-span-7 flex flex-col space-y-8">
            <div className="flex flex-col gap-2">
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-primary-teal font-serif italic text-2xl md:text-3xl"
              >
                Welcome to Becca's Food Blog
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
                className="font-display text-6xl sm:text-7xl xl:text-[92px] leading-[0.85] font-black tracking-tighter uppercase text-primary-teal"
              >
                Flavors<br />
                <span className="text-transparent" style={{ WebkitTextStroke: "1.5px #0F766E" }}>Of Home</span><br />
                Cooked.
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
              className="font-sans text-base sm:text-lg text-gray-body max-w-md leading-relaxed font-light"
            >
              Discover easy-to-follow recipes, healthy meal ideas, portion control guidelines, and traditional Kenyan comfort food made with organic ingredients.
            </motion.p>

            {/* Actions with sharp borders */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
            >
              <button
                onClick={onExploreRecipes}
                className="group flex items-center justify-center space-x-3 bg-primary-teal hover:bg-primary-teal/90 text-white-card px-8 py-4 text-xs font-bold tracking-[0.25em] uppercase transition-all duration-300 cursor-pointer border-2 border-primary-teal hover:shadow-lg hover:shadow-primary-teal/10"
                id="hero-explore-recipes"
              >
                <span>EXPLORE RECIPES</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
              </button>

              <button
                onClick={onExploreArticles}
                className="flex items-center justify-center space-x-2 text-primary-teal hover:bg-primary-teal hover:text-white-card px-8 py-4 text-xs font-bold tracking-[0.25em] uppercase border-2 border-primary-teal transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary-teal/5"
                id="hero-explore-articles"
              >
                <span>READ ARTICLES</span>
              </button>
            </motion.div>

            {/* Quick Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="grid grid-cols-3 gap-6 pt-10 border-t border-primary-teal/10 max-w-md"
            >
              <div>
                <span className="block font-display text-3xl font-black tracking-tight text-primary-teal">19</span>
                <span className="block font-mono text-[9px] text-gray-body/60 uppercase tracking-widest mt-1">Tasty Recipes</span>
              </div>
              <div>
                <span className="block font-display text-3xl font-black tracking-tight text-primary-teal">10</span>
                <span className="block font-mono text-[9px] text-gray-body/60 uppercase tracking-widest mt-1">Food Articles</span>
              </div>
              <div>
                <span className="block font-display text-3xl font-black tracking-tight text-primary-teal">6</span>
                <span className="block font-mono text-[9px] text-gray-body/60 uppercase tracking-widest mt-1">Categories</span>
              </div>
            </motion.div>
          </div>

          {/* Image & Interactive Badge Block */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -12, 0] // Gentle continuous floating animation
              }}
              transition={{
                opacity: { duration: 1, ease: "easeOut" },
                scale: { duration: 1, ease: "easeOut" },
                y: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="w-full aspect-square max-w-[420px] bg-dark-green rounded-full flex items-center justify-center relative overflow-hidden border border-primary-teal shadow-xl"
              id="hero-main-image-container"
            >
              {/* Representing the premium plate artwork crop */}
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="w-[92%] h-[92%] border border-cream-bg/20 rounded-full overflow-hidden flex items-center justify-center cursor-pointer"
              >
                <img
                  src={getImageUrl("/images/becca_foodies_hero_banner_1784115196901.jpg")}
                  alt="Becca's delicious home-cooked meals"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 contrast-105 transition-all duration-700"
                />
              </motion.div>

              {/* Overlaid Award Badge with opposite floating animation */}
              <motion.div 
                animate={{
                  y: [0, 8, 0],
                  rotate: [12, 8, 12]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{ scale: 1.1, rotate: 20 }}
                className="absolute top-10 -right-2 bg-white-card text-primary-teal w-28 h-28 rounded-full border border-primary-teal flex flex-col items-center justify-center shadow-lg cursor-pointer select-none"
              >
                <span className="text-[9px] uppercase font-bold tracking-tighter text-gray-body">Becca's</span>
                <span className="text-3xl font-serif italic text-gold-yellow my-0.5">Food</span>
                <span className="text-[9px] uppercase font-bold tracking-tighter text-gray-body">Blog</span>
              </motion.div>
            </motion.div>

            {/* Vertical Accent Text */}
            <div className="absolute right-[-48px] top-1/2 -translate-y-1/2 rotate-180 hidden xl:block" style={{ writingMode: "vertical-rl" }}>
              <p className="text-[10px] uppercase tracking-[0.5em] text-primary-teal/30 font-bold">
                EASY RECIPES & HEALTHY LIVING
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
