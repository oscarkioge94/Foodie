import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Philosophy from "./components/Philosophy";
import RecipeParadise from "./components/RecipeParadise";
import Footer from "./components/Footer";
import SavedRecipesDrawer from "./components/SavedRecipesDrawer";
import AdminDashboard from "./components/AdminDashboard";
import { MenuItem, Article } from "./types";
import { subscribeToRecipes, subscribeToArticles } from "./utils/firebaseService";

export default function App() {
  const [recipes, setRecipes] = useState<MenuItem[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<MenuItem[]>([]);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [viewRecipe, setViewRecipe] = useState<MenuItem | null>(null);

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
