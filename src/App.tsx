import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Philosophy from "./components/Philosophy";
import RecipeParadise from "./components/RecipeParadise";
import Footer from "./components/Footer";
import SavedRecipesDrawer from "./components/SavedRecipesDrawer";
import AdminDashboard from "./components/AdminDashboard";
import { MenuItem, Article } from "./types";
import { subscribeToRecipes, subscribeToArticles } from "./utils/firebaseService";
import { ChefHat, Sparkles } from "lucide-react";

const SPLASH_QUOTES = [
  "Simmering authentic Kenyan stews...",
  "Sourcing rich, organic local ingredients...",
  "Designing healthy portion guides...",
  "Plating comfort foods with love...",
  "Preparing Kenyan culinary paradise..."
];

export default function App() {
  const [recipes, setRecipes] = useState<MenuItem[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<MenuItem[]>([]);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [viewRecipe, setViewRecipe] = useState<MenuItem | null>(null);
  
  // Custom Page-Level Splash Loading States
  const [isLoading, setIsLoading] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);

  // Sync real-time recipes and articles from backend database
  useEffect(() => {
    const unsubscribeRecipes = subscribeToRecipes((updatedRecipes) => {
      setRecipes(updatedRecipes);
    });

    const unsubscribeArticles = subscribeToArticles((updatedArticles) => {
      setArticles(updatedArticles);
    });

    return () => {
      unsubscribeRecipes();
      unsubscribeArticles();
    };
  }, []);

  // Cycle splash quotes & incremental loading progress for premium feeling
  useEffect(() => {
    if (!isLoading) return;

    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % SPLASH_QUOTES.length);
    }, 450);

    const progressTimer = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => setIsLoading(false), 200);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 4;
      });
    }, 60);

    return () => {
      clearInterval(quoteTimer);
      clearInterval(progressTimer);
    };
  }, [isLoading]);

  // Load saved recipes from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("becca_saved_recipes");
    if (saved) {
      try {
        setSavedRecipes(JSON.parse(saved));
      } catch (err) {
        console.error("Error loading saved recipes:", err);
      }
    }
  }, []);

  // Toggle saving / unsaving a recipe
  const handleToggleSaveRecipe = (item: MenuItem) => {
    const exists = savedRecipes.some((r) => r.id === item.id);
    let updated;
    if (exists) {
      updated = savedRecipes.filter((r) => r.id !== item.id);
    } else {
      updated = [...savedRecipes, item];
    }
    setSavedRecipes(updated);
    localStorage.setItem("becca_saved_recipes", JSON.stringify(updated));
  };

  // Remove recipe directly from the drawer
  const handleRemoveSavedRecipe = (id: string) => {
    const updated = savedRecipes.filter((r) => r.id !== id);
    setSavedRecipes(updated);
    localStorage.setItem("becca_saved_recipes", JSON.stringify(updated));
  };

  // Scroll to section with offset support
  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const savedRecipeIds = savedRecipes.map((r) => r.id);

  return (
    <div className="bg-cream-bg min-h-screen text-gray-body selection:bg-primary-teal/20 scroll-smooth">
      {/* Absolute Branded Overlay Loading Screen */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="page-loader"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              y: -40,
              transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
            }}
            className="fixed inset-0 z-[9999] bg-dark-green flex flex-col items-center justify-center p-6 text-cream-bg overflow-hidden"
          >
            {/* Ambient Background Aura */}
            <motion.div 
              animate={{ 
                scale: [1, 1.15, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[500px] h-[500px] bg-primary-teal/20 rounded-full blur-3xl pointer-events-none"
            />

            <div className="relative flex flex-col items-center max-w-md w-full text-center space-y-10">
              {/* Spinning Plate Ring & Cooking Icon */}
              <div className="relative flex items-center justify-center w-32 h-32">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-t-2 border-r-2 border-b border-l border-primary-teal/30 border-t-bright-lime border-r-gold-yellow rounded-full"
                />
                
                <motion.div
                  animate={{ scale: [0.95, 1.05, 0.95] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-primary-teal/10 w-24 h-24 rounded-full flex items-center justify-center border border-primary-teal/30"
                >
                  <ChefHat className="w-10 h-10 text-bright-lime" />
                </motion.div>

                {/* Sparkling Micro Orbs */}
                <motion.div 
                  animate={{ y: [-4, 4, -4], x: [4, -4, 4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-1 right-2"
                >
                  <Sparkles className="w-5 h-5 text-gold-yellow" />
                </motion.div>
              </div>

              {/* Title Header */}
              <div className="space-y-2">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-serif italic text-lg text-gold-yellow"
                >
                  Becca Vance's
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-display text-4xl font-black uppercase tracking-wider text-cream-bg"
                >
                  Creator Paradise
                </motion.h2>
              </div>

              {/* Loader Text & Progress indicator */}
              <div className="space-y-4 w-full px-6">
                <div className="h-1 w-full bg-primary-teal/20 overflow-hidden relative border border-primary-teal/10">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-bright-lime to-gold-yellow"
                    style={{ width: `${Math.min(loadProgress, 100)}%` }}
                  />
                </div>

                <div className="h-6 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={quoteIndex}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="font-mono text-[10px] uppercase tracking-widest text-primary-teal/80"
                    >
                      {SPLASH_QUOTES[quoteIndex]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation bar */}
      <Navbar
        savedCount={savedRecipes.length}
        onOpenSaved={() => setIsSavedOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Sections */}
      <main>
        {/* Hero banner */}
        <Hero
          onExploreRecipes={() => scrollToSection("#recipes")}
          onExploreArticles={() => scrollToSection("#articles")}
        />

        {/* Philosophy Story */}
        <Philosophy />

        {/* Recipe Blog & Kenyan Food Paradise */}
        <RecipeParadise
          onToggleSaveRecipe={handleToggleSaveRecipe}
          savedRecipeIds={savedRecipeIds}
          viewRecipe={viewRecipe}
          onClearViewRecipe={() => setViewRecipe(null)}
          recipes={recipes}
          articles={articles}
        />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Bookmarks saved recipes drawer */}
      <AnimatePresence>
        {isSavedOpen && (
          <SavedRecipesDrawer
            isOpen={isSavedOpen}
            onClose={() => setIsSavedOpen(false)}
            savedRecipes={savedRecipes}
            onRemoveRecipe={handleRemoveSavedRecipe}
            onViewRecipe={(recipe) => {
              setViewRecipe(recipe);
              setIsSavedOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Admin Creator Dashboard Console */}
      <AnimatePresence>
        {isAdminOpen && (
          <AdminDashboard
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            recipes={recipes}
            articles={articles}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
