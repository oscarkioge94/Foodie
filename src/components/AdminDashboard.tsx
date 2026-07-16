import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Plus, Edit, Trash2, Key, Save, FileText, BookOpen, 
  Settings, Check, AlertCircle, Eye, EyeOff, LogOut, Image as ImageIcon 
} from "lucide-react";
import { MenuItem, Article } from "../types";
import { 
  verifyPassphrase, 
  updatePassphrase, 
  saveRecipe, 
  removeRecipe, 
  saveArticle, 
  removeArticle 
} from "../utils/firebaseService";

// Standard preset images available in the assets
const IMAGE_PRESETS = [
  { label: "Botanical Greens", url: "/images/becca_foodies_botanical_greens_1784115212572.jpg" },
  { label: "Garden Sandwich", url: "/images/sandwich.png" },
  { label: "Seasonal Berries", url: "/images/seasonal.jpeg" },
  { label: "Coastal Sea Bass", url: "/images/becca_foodies_coastal_harvest_1784115225586.jpg" },
  { label: "Healthy Smoothie", url: "/images/Smoothie.png" },
  { label: "Kenyan Street Food", url: "/images/street.png" },
  { label: "The Weight Loss Journey", url: "/images/The_journey.png" },
  { label: "Balanced Dieting", url: "/images/Dieting.png" },
  { label: "Healthy Life Celebration", url: "/images/ChatGPT_Image_Jul_1_2026_12_50_23_PM.png" },
  { label: "Fresh Kenyan Staples", url: "/images/WhatsApp_Image_2026-07-02_at_12.34.26.jpeg" }
];

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: MenuItem[];
  articles: Article[];
}

type TabType = "recipes" | "articles" | "settings";

export default function AdminDashboard({ isOpen, onClose, recipes, articles }: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("recipes");
  
  // Status notifications
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error">("success");

  // Form edit states
  const [editingRecipe, setEditingRecipe] = useState<Partial<MenuItem> | null>(null);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [showArticleForm, setShowArticleForm] = useState(false);

  // Settings passphrase states
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // Auto-fill preset helper
  const [selectedPresetImage, setSelectedPresetImage] = useState("");

  useEffect(() => {
    // Reset states on reopen
    if (isOpen) {
      setPassphrase("");
      setAuthError("");
    }
  }, [isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const isCorrect = await verifyPassphrase(passphrase);
    if (isCorrect) {
      setIsAuthenticated(true);
    } else {
      setAuthError("Incorrect admin passphrase. Please try again.");
    }
  };

  const showStatus = (msg: string, type: "success" | "error" = "success") => {
    setStatusMsg(msg);
    setStatusType(type);
    setTimeout(() => setStatusMsg(""), 4000);
  };

  // --- RECIPE ACTIONS ---
  const handleOpenNewRecipe = () => {
    setEditingRecipe({
      name: "",
      description: "",
      category: "dinner",
      categoryLabel: "Dinner",
      image: IMAGE_PRESETS[0].url,
      prepTime: "15 mins",
      cookTime: "25 mins",
      servings: "2-4",
      signature: false,
      price: 0, // Fallback price field for MenuItem interface type compatibility
      nutrition: {
        calories: 320,
        protein: 15,
        carbs: 40,
        fats: 10
      },
      ingredients: ["Fresh local vegetables", "Onions & Tomatoes", "Cooking oil", "Pinch of salt"],
      recipeSteps: ["Prepare and clean all vegetables.", "Heat oil in a pan and saute onions until golden.", "Add ingredients and simmer under medium heat.", "Serve hot with Ugali or brown rice."],
      sourcing: {
        item: "Ingredients",
        origin: "Local Organic Farms",
        partner: "Becca Kitchen Partners"
      }
    });
    setSelectedPresetImage(IMAGE_PRESETS[0].url);
    setShowRecipeForm(true);
  };

  const handleOpenEditRecipe = (recipe: MenuItem) => {
    setEditingRecipe({ ...recipe });
    setSelectedPresetImage(recipe.image);
    setShowRecipeForm(true);
  };

  const handleDeleteRecipe = async (id: string) => {
    if (confirm("Are you sure you want to delete this recipe permanently from the database?")) {
      try {
        await removeRecipe(id);
        showStatus("Recipe deleted successfully");
      } catch (err) {
        showStatus("Failed to delete recipe", "error");
      }
    }
  };

  const handleSaveRecipeForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecipe?.name || !editingRecipe?.description) {
      showStatus("Please fill in the recipe name and description", "error");
      return;
    }

    try {
      // Map category back to Label to keep formatting neat
      const catLabels: Record<string, string> = {
        breakfast: "Breakfast",
        lunch: "Lunch",
        dinner: "Dinner",
        healthy: "Healthy Foods",
        weightloss: "Weight Loss",
        kenyan: "Kenyan Cuisines"
      };
      
      const updatedRecipe = {
        ...editingRecipe,
        categoryLabel: catLabels[editingRecipe.category || "dinner"] || "Dinner",
        image: selectedPresetImage || editingRecipe.image || "/images/sandwich.png"
      } as MenuItem;

      await saveRecipe(updatedRecipe);
      showStatus(`Recipe "${updatedRecipe.name}" saved successfully!`);
      setShowRecipeForm(false);
      setEditingRecipe(null);
    } catch (err) {
      showStatus("Failed to save recipe", "error");
    }
  };

  // --- ARTICLE ACTIONS ---
  const handleOpenNewArticle = () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }); // e.g. "16 Jul 2026"

    setEditingArticle({
      title: "",
      excerpt: "",
      content: "<h3>Introduction</h3><p>Enter your blog content paragraphs here...</p>",
      date: formattedDate,
      image: IMAGE_PRESETS[5].url,
      readTime: "5 min read"
    });
    setSelectedPresetImage(IMAGE_PRESETS[5].url);
    setShowArticleForm(true);
  };

  const handleOpenEditArticle = (article: Article) => {
    setEditingArticle({ ...article });
    setSelectedPresetImage(article.image);
    setShowArticleForm(true);
  };

  const handleDeleteArticle = async (id: string) => {
    if (confirm("Are you sure you want to delete this article permanently from the blog?")) {
      try {
        await removeArticle(id);
        showStatus("Article deleted successfully");
      } catch (err) {
        showStatus("Failed to delete article", "error");
      }
    }
  };

  const handleSaveArticleForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle?.title || !editingArticle?.excerpt || !editingArticle?.content) {
      showStatus("Please fill in the title, excerpt, and full blog content", "error");
      return;
    }

    try {
      const updatedArticle = {
        ...editingArticle,
        image: selectedPresetImage || editingArticle.image || "/images/street.png"
      } as Article;

      await saveArticle(updatedArticle);
      showStatus(`Article "${updatedArticle.title}" saved successfully!`);
      setShowArticleForm(false);
      setEditingArticle(null);
    } catch (err) {
      showStatus("Failed to save article", "error");
    }
  };

  // --- PASSPHRASE SETTINGS ---
  const handleUpdatePassphrase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass.trim().length < 4) {
      showStatus("Passphrase must be at least 4 characters long", "error");
      return;
    }
    if (newPass !== confirmPass) {
      showStatus("Passphrase confirmation does not match", "error");
      return;
    }

    try {
      const success = await updatePassphrase(newPass);
      if (success) {
        showStatus("Admin passphrase updated successfully!");
        setNewPass("");
        setConfirmPass("");
      } else {
        showStatus("Failed to update passphrase", "error");
      }
    } catch (err) {
      showStatus("An error occurred during save", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      {/* Dark backdrop overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-dark-green/75 backdrop-blur-md"
      />

      {/* Main Admin Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative w-full max-w-5xl bg-cream-bg border-4 border-primary-teal h-[90vh] flex flex-col shadow-2xl overflow-hidden z-10 text-primary-teal"
      >
        {/* Header Block */}
        <div className="p-6 border-b-2 border-primary-teal flex items-center justify-between bg-dark-green text-white-card shrink-0">
          <div className="flex items-center space-x-2.5">
            <Settings className="w-5 h-5 text-gold-yellow animate-spin-slow" />
            <div>
              <h2 className="font-display text-xl font-black uppercase tracking-tight">
                Becca's Food Creator Console
              </h2>
              <p className="font-mono text-[9px] uppercase tracking-wider text-gold-yellow/80">
                Live Backend Database Sync Panel
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 bg-cream-bg text-primary-teal hover:bg-gold-yellow hover:text-dark-green transition-all cursor-pointer border-2 border-primary-teal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Realtime Status Alerts */}
        <AnimatePresence>
          {statusMsg && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`px-6 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-center flex items-center justify-center space-x-2 border-b border-primary-teal ${
                statusType === "success" 
                  ? "bg-light-mint text-dark-green" 
                  : "bg-pink-red/10 text-pink-red"
              }`}
            >
              {statusType === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{statusMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NOT AUTHENTICATED: Login Form */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-8 bg-cream-bg">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md bg-white-card border-2 border-primary-teal p-8 space-y-6"
            >
              <div className="text-center space-y-2">
                <span className="font-mono text-[10px] font-bold text-gold-yellow uppercase tracking-[0.2em] bg-dark-green px-3 py-1">
                  Access Protected
                </span>
                <h3 className="font-display text-xl font-black uppercase">
                  Verify Credentials
                </h3>
                <p className="font-sans text-xs text-gray-body/70 leading-relaxed">
                  Enter the creator passphrase to unlock the live food blog and recipe manager database.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] font-bold uppercase tracking-wider text-primary-teal">
                    Secret Creator Passphrase
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassphrase ? "text" : "password"}
                      value={passphrase}
                      onChange={(e) => setPassphrase(e.target.value)}
                      placeholder="e.g. becca-paradise"
                      className="w-full px-4 py-3 bg-cream-bg border-2 border-primary-teal font-sans text-xs text-primary-teal placeholder-primary-teal/40 focus:outline-none focus:border-gold-yellow"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassphrase(!showPassphrase)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-teal/60 hover:text-primary-teal cursor-pointer"
                    >
                      {showPassphrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="font-mono text-[9px] font-bold text-pink-red bg-pink-red/10 p-2.5 border border-pink-red uppercase">
                    {authError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-gold-yellow hover:bg-gold-yellow/90 text-dark-green font-mono text-xs font-bold uppercase tracking-wider border-2 border-gold-yellow cursor-pointer transition-colors"
                >
                  Unlock Creator Console →
                </button>
              </form>

              <div className="bg-primary-teal/5 border border-primary-teal/10 p-4 text-center">
                <span className="font-mono text-[9px] uppercase text-primary-teal/60 block">
                  Default Dev Passphrase
                </span>
                <span className="font-mono text-xs font-black text-primary-teal">
                  becca-paradise
                </span>
              </div>
            </motion.div>
          </div>
        ) : (
          /* AUTHENTICATED: Creator Console */
          <div className="flex-1 flex overflow-hidden">
            
            {/* Sidebar Controls */}
            <div className="w-56 border-r-2 border-primary-teal bg-primary-teal/5 flex flex-col justify-between shrink-0 font-mono">
              <div className="p-4 space-y-2">
                <button
                  onClick={() => { setActiveTab("recipes"); setShowRecipeForm(false); setShowArticleForm(false); }}
                  className={`w-full px-4 py-3.5 border-2 text-left text-xs font-bold uppercase tracking-wider flex items-center space-x-2.5 transition-all cursor-pointer ${
                    activeTab === "recipes"
                      ? "bg-primary-teal text-white-card border-primary-teal"
                      : "bg-transparent text-primary-teal border-transparent hover:border-primary-teal/30 hover:bg-primary-teal/5"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Recipes ({recipes.length})</span>
                </button>

                <button
                  onClick={() => { setActiveTab("articles"); setShowRecipeForm(false); setShowArticleForm(false); }}
                  className={`w-full px-4 py-3.5 border-2 text-left text-xs font-bold uppercase tracking-wider flex items-center space-x-2.5 transition-all cursor-pointer ${
                    activeTab === "articles"
                      ? "bg-primary-teal text-white-card border-primary-teal"
                      : "bg-transparent text-primary-teal border-transparent hover:border-primary-teal/30 hover:bg-primary-teal/5"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Blog Articles ({articles.length})</span>
                </button>

                <button
                  onClick={() => { setActiveTab("settings"); setShowRecipeForm(false); setShowArticleForm(false); }}
                  className={`w-full px-4 py-3.5 border-2 text-left text-xs font-bold uppercase tracking-wider flex items-center space-x-2.5 transition-all cursor-pointer ${
                    activeTab === "settings"
                      ? "bg-primary-teal text-white-card border-primary-teal"
                      : "bg-transparent text-primary-teal border-transparent hover:border-primary-teal/30 hover:bg-primary-teal/5"
                  }`}
                >
                  <Key className="w-4 h-4" />
                  <span>Auth Settings</span>
                </button>
              </div>

              <div className="p-4 border-t border-primary-teal/10">
                <button
                  onClick={() => { setIsAuthenticated(false); setPassphrase(""); }}
                  className="w-full py-2.5 bg-pink-red text-white-card border-2 border-pink-red hover:bg-pink-red/90 font-bold text-[10px] uppercase tracking-wider text-center flex items-center justify-center space-x-2 cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Main Editor Console Stage */}
            <div className="flex-1 flex flex-col bg-white-card overflow-y-auto">
              
              {/* RECIPES TAB VIEW */}
              {activeTab === "recipes" && !showRecipeForm && (
                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-primary-teal/10 pb-5">
                    <div>
                      <h3 className="font-display text-2xl font-black uppercase tracking-tight">
                        Live Recipes Registry
                      </h3>
                      <p className="font-sans text-xs text-gray-body/70">
                        Create and edit real-time cooking guides and macronutrient logs.
                      </p>
                    </div>
                    
                    <button
                      onClick={handleOpenNewRecipe}
                      className="px-5 py-2.5 bg-bright-lime text-dark-green border-2 border-bright-lime hover:bg-bright-lime/90 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors flex items-center space-x-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Recipe</span>
                    </button>
                  </div>

                  {/* Recipes List Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recipes.map((item) => (
                      <div 
                        key={item.id}
                        className="bg-cream-bg border-2 border-primary-teal p-4 flex gap-4 items-start relative group hover:shadow-md transition-shadow"
                      >
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-20 h-20 object-cover border border-primary-teal shrink-0"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/images/sandwich.png"; }}
                        />
                        <div className="flex-1 min-w-0 space-y-1 text-primary-teal">
                          <span className="font-mono text-[8px] font-bold px-2 py-0.5 bg-primary-teal/10 border border-primary-teal/20 uppercase">
                            {item.categoryLabel}
                          </span>
                          <h4 className="font-display font-black text-sm uppercase truncate leading-tight mt-1">
                            {item.name}
                          </h4>
                          <p className="font-sans text-[11px] text-gray-body/80 line-clamp-2 leading-tight">
                            {item.description}
                          </p>
                          <div className="font-mono text-[8px] text-primary-teal/60 uppercase flex gap-2 pt-0.5">
                            <span>{item.nutrition.calories} kcal</span>
                            <span>|</span>
                            <span>{item.prepTime}</span>
                          </div>
                        </div>

                        {/* Quick edit buttons */}
                        <div className="absolute top-2 right-2 flex space-x-1.5 bg-cream-bg/90 p-1 border border-primary-teal/10">
                          <button
                            onClick={() => handleOpenEditRecipe(item)}
                            className="p-1 hover:text-gold-yellow text-primary-teal/70 cursor-pointer"
                            title="Edit Recipe"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRecipe(item.id)}
                            className="p-1 hover:text-pink-red text-primary-teal/70 cursor-pointer"
                            title="Delete Recipe"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {recipes.length === 0 && (
                      <div className="col-span-full py-16 text-center font-mono text-xs uppercase tracking-widest text-primary-teal/40">
                        No recipes found. Click "Create Recipe" to write your first entry.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* RECIPES FORM EDITOR */}
              {activeTab === "recipes" && showRecipeForm && editingRecipe && (
                <form onSubmit={handleSaveRecipeForm} className="p-6 md:p-8 space-y-6">
                  <div className="border-b border-primary-teal/10 pb-4 flex items-center justify-between">
                    <h3 className="font-display text-xl font-black uppercase">
                      {editingRecipe.id ? "Edit Cooking Recipe" : "Publish New Recipe"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => { setShowRecipeForm(false); setEditingRecipe(null); }}
                      className="font-mono text-[10px] font-bold text-primary-teal/60 hover:text-primary-teal uppercase cursor-pointer"
                    >
                      ← Back to Registry
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
                    
                    {/* Left Column Fields */}
                    <div className="md:col-span-4 space-y-4">
                      
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] font-bold uppercase tracking-wider">Recipe Title</label>
                        <input 
                          type="text"
                          value={editingRecipe.name || ""}
                          onChange={(e) => setEditingRecipe({ ...editingRecipe, name: e.target.value })}
                          placeholder="e.g. Traditional Spicy Kenyan Pilau"
                          className="w-full px-3.5 py-2.5 bg-cream-bg border border-primary-teal font-sans text-xs text-primary-teal focus:outline-none focus:border-gold-yellow"
                          required
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] font-bold uppercase tracking-wider">Short Teaser Description</label>
                        <textarea 
                          rows={2}
                          value={editingRecipe.description || ""}
                          onChange={(e) => setEditingRecipe({ ...editingRecipe, description: e.target.value })}
                          placeholder="Provide a delicious one or two sentence introduction for this dish..."
                          className="w-full px-3.5 py-2.5 bg-cream-bg border border-primary-teal font-sans text-xs text-primary-teal focus:outline-none focus:border-gold-yellow"
                          required
                        />
                      </div>

                      {/* Ingredients list textarea */}
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] font-bold uppercase tracking-wider block">
                          Ingredients Checklist (one ingredient per line)
                        </label>
                        <textarea 
                          rows={5}
                          value={editingRecipe.ingredients?.join("\n") || ""}
                          onChange={(e) => setEditingRecipe({ ...editingRecipe, ingredients: e.target.value.split("\n").filter(Boolean) })}
                          placeholder="e.g.&#10;2 cups Basmati Rice&#10;1 lb grass-fed beef cubes&#10;2 large red onions, thinly sliced&#10;1 tbsp fragrant Pilau Masala spice"
                          className="w-full px-3.5 py-2.5 bg-cream-bg border border-primary-teal font-sans text-xs text-primary-teal focus:outline-none focus:border-gold-yellow"
                        />
                      </div>

                      {/* Recipe steps list textarea */}
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] font-bold uppercase tracking-wider block">
                          Cooking Directions / Steps (one step per line)
                        </label>
                        <textarea 
                          rows={6}
                          value={editingRecipe.recipeSteps?.join("\n") || ""}
                          onChange={(e) => setEditingRecipe({ ...editingRecipe, recipeSteps: e.target.value.split("\n").filter(Boolean) })}
                          placeholder="e.g.&#10;In a heavy pan, heat oil and brown the onions deeply.&#10;Add beef and cook until juices evaporate.&#10;Stir in pilau spices and salt, followed by rice.&#10;Pour in water, cover tightly, and simmer on low for 15-20 mins."
                          className="w-full px-3.5 py-2.5 bg-cream-bg border border-primary-teal font-sans text-xs text-primary-teal focus:outline-none focus:border-gold-yellow"
                        />
                      </div>

                    </div>

                    {/* Right Column Metadata */}
                    <div className="md:col-span-2 space-y-4">
                      
                      {/* Category Selection */}
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] font-bold uppercase tracking-wider">Category Category</label>
                        <select 
                          value={editingRecipe.category || "dinner"}
                          onChange={(e) => setEditingRecipe({ ...editingRecipe, category: e.target.value })}
                          className="w-full px-3 py-2 bg-cream-bg border border-primary-teal font-sans text-xs text-primary-teal focus:outline-none focus:border-gold-yellow"
                        >
                          <option value="breakfast">Breakfast</option>
                          <option value="lunch">Lunch</option>
                          <option value="dinner">Dinner</option>
                          <option value="healthy">Healthy Foods</option>
                          <option value="weightloss">Weight Loss</option>
                          <option value="kenyan">Kenyan Cuisines</option>
                        </select>
                      </div>

                      {/* Cooking Logistics */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <label className="font-mono text-[8px] font-bold uppercase">Prep Time</label>
                          <input 
                            type="text"
                            value={editingRecipe.prepTime || "15 mins"}
                            onChange={(e) => setEditingRecipe({ ...editingRecipe, prepTime: e.target.value })}
                            className="w-full px-2 py-1.5 bg-cream-bg border border-primary-teal font-sans text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[8px] font-bold uppercase">Cook Time</label>
                          <input 
                            type="text"
                            value={editingRecipe.cookTime || "20 mins"}
                            onChange={(e) => setEditingRecipe({ ...editingRecipe, cookTime: e.target.value })}
                            className="w-full px-2 py-1.5 bg-cream-bg border border-primary-teal font-sans text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[8px] font-bold uppercase">Servings</label>
                          <input 
                            type="text"
                            value={editingRecipe.servings || "4"}
                            onChange={(e) => setEditingRecipe({ ...editingRecipe, servings: e.target.value })}
                            className="w-full px-2 py-1.5 bg-cream-bg border border-primary-teal font-sans text-xs"
                          />
                        </div>
                      </div>

                      {/* Nutrition Info Card */}
                      <div className="border border-primary-teal/25 p-3 space-y-2 bg-primary-teal/5">
                        <span className="font-mono text-[8px] font-bold uppercase tracking-wider block text-center">
                          Macronutrient Nutrition (per portion)
                        </span>
                        
                        <div className="grid grid-cols-2 gap-2 font-mono text-[9px]">
                          <div>
                            <span className="text-gray-body/60 block">Calories (kcal)</span>
                            <input 
                              type="number"
                              value={editingRecipe.nutrition?.calories || 350}
                              onChange={(e) => setEditingRecipe({ 
                                ...editingRecipe, 
                                nutrition: { ...editingRecipe.nutrition!, calories: parseInt(e.target.value) || 0 } 
                              })}
                              className="w-full px-2 py-1 bg-white-card border border-primary-teal font-sans text-xs"
                            />
                          </div>
                          <div>
                            <span className="text-gray-body/60 block">Protein (g)</span>
                            <input 
                              type="number"
                              value={editingRecipe.nutrition?.protein || 20}
                              onChange={(e) => setEditingRecipe({ 
                                ...editingRecipe, 
                                nutrition: { ...editingRecipe.nutrition!, protein: parseInt(e.target.value) || 0 } 
                              })}
                              className="w-full px-2 py-1 bg-white-card border border-primary-teal font-sans text-xs"
                            />
                          </div>
                          <div>
                            <span className="text-gray-body/60 block">Carbs (g)</span>
                            <input 
                              type="number"
                              value={editingRecipe.nutrition?.carbs || 35}
                              onChange={(e) => setEditingRecipe({ 
                                ...editingRecipe, 
                                nutrition: { ...editingRecipe.nutrition!, carbs: parseInt(e.target.value) || 0 } 
                              })}
                              className="w-full px-2 py-1 bg-white-card border border-primary-teal font-sans text-xs"
                            />
                          </div>
                          <div>
                            <span className="text-gray-body/60 block">Fats (g)</span>
                            <input 
                              type="number"
                              value={editingRecipe.nutrition?.fats || 12}
                              onChange={(e) => setEditingRecipe({ 
                                ...editingRecipe, 
                                nutrition: { ...editingRecipe.nutrition!, fats: parseInt(e.target.value) || 0 } 
                              })}
                              className="w-full px-2 py-1 bg-white-card border border-primary-teal font-sans text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Image Preset Selector */}
                      <div className="space-y-1.5">
                        <label className="font-mono text-[9px] font-bold uppercase tracking-wider block">
                          Visual Image Asset
                        </label>
                        <select
                          value={selectedPresetImage}
                          onChange={(e) => setSelectedPresetImage(e.target.value)}
                          className="w-full px-3 py-2 bg-cream-bg border border-primary-teal font-sans text-xs text-primary-teal focus:outline-none"
                        >
                          {IMAGE_PRESETS.map((preset, idx) => (
                            <option key={idx} value={preset.url}>
                              Preset: {preset.label}
                            </option>
                          ))}
                        </select>
                        <div className="aspect-video w-full border border-primary-teal overflow-hidden bg-cream-bg">
                          <img 
                            src={selectedPresetImage} 
                            alt="Selected preset"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Checkboxes */}
                      <div className="flex items-center space-x-2.5 pt-2">
                        <input 
                          type="checkbox"
                          id="signature-recipe"
                          checked={editingRecipe.signature || false}
                          onChange={(e) => setEditingRecipe({ ...editingRecipe, signature: e.target.checked })}
                          className="w-4 h-4 border-2 border-primary-teal rounded-none text-primary-teal focus:ring-0"
                        />
                        <label htmlFor="signature-recipe" className="font-mono text-[10px] font-bold uppercase tracking-wider cursor-pointer">
                          Mark as Highly Rated
                        </label>
                      </div>

                    </div>
                  </div>

                  {/* Form actions */}
                  <div className="pt-6 border-t border-primary-teal/10 flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-primary-teal hover:bg-primary-teal/95 text-white-card font-mono text-xs font-bold uppercase tracking-widest border-2 border-primary-teal cursor-pointer transition-colors text-center"
                    >
                      Publish to Live Website
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowRecipeForm(false); setEditingRecipe(null); }}
                      className="px-6 py-3 bg-transparent hover:bg-primary-teal/5 text-primary-teal font-mono text-xs font-bold uppercase tracking-widest border-2 border-primary-teal cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}


              {/* ARTICLES TAB VIEW */}
              {activeTab === "articles" && !showArticleForm && (
                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-primary-teal/10 pb-5">
                    <div>
                      <h3 className="font-display text-2xl font-black uppercase tracking-tight">
                        Live Blog Registry
                      </h3>
                      <p className="font-sans text-xs text-gray-body/70">
                        Create, modify, and manage healthy lifestyle articles and food advice columns.
                      </p>
                    </div>
                    
                    <button
                      onClick={handleOpenNewArticle}
                      className="px-5 py-2.5 bg-bright-lime text-dark-green border-2 border-bright-lime hover:bg-bright-lime/90 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors flex items-center space-x-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Write Article</span>
                    </button>
                  </div>

                  {/* Articles List Grid */}
                  <div className="grid grid-cols-1 gap-4">
                    {articles.map((article) => (
                      <div 
                        key={article.id}
                        className="bg-cream-bg border-2 border-primary-teal p-4 flex gap-4 items-center justify-between relative group hover:shadow-md transition-shadow"
                      >
                        <div className="flex gap-4 items-center min-w-0">
                          <img 
                            src={article.image} 
                            alt={article.title}
                            className="w-16 h-16 object-cover border border-primary-teal shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).src = "/images/street.png"; }}
                          />
                          <div className="min-w-0 space-y-1 text-primary-teal">
                            <span className="font-mono text-[8px] font-bold px-2 py-0.5 bg-primary-teal/10 border border-primary-teal/20 uppercase">
                              {article.date} ({article.readTime})
                            </span>
                            <h4 className="font-display font-black text-sm uppercase truncate leading-tight mt-1">
                              {article.title}
                            </h4>
                            <p className="font-sans text-[11px] text-gray-body/80 line-clamp-1 leading-tight">
                              {article.excerpt}
                            </p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex space-x-1.5 shrink-0 ml-4">
                          <button
                            onClick={() => handleOpenEditArticle(article)}
                            className="p-2 border border-primary-teal/20 hover:bg-primary-teal hover:text-white-card transition-colors text-primary-teal cursor-pointer"
                            title="Edit Article"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article.id)}
                            className="p-2 border border-primary-teal/20 hover:bg-pink-red hover:text-white-card transition-colors text-primary-teal cursor-pointer"
                            title="Delete Article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {articles.length === 0 && (
                      <div className="py-16 text-center font-mono text-xs uppercase tracking-widest text-primary-teal/40">
                        No articles published. Click "Write Article" to craft your first advice column.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ARTICLES FORM EDITOR */}
              {activeTab === "articles" && showArticleForm && editingArticle && (
                <form onSubmit={handleSaveArticleForm} className="p-6 md:p-8 space-y-6">
                  <div className="border-b border-primary-teal/10 pb-4 flex items-center justify-between">
                    <h3 className="font-display text-xl font-black uppercase">
                      {editingArticle.id ? "Edit Blog Post" : "Compose New Article"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => { setShowArticleForm(false); setEditingArticle(null); }}
                      className="font-mono text-[10px] font-bold text-primary-teal/60 hover:text-primary-teal uppercase cursor-pointer"
                    >
                      ← Back to Articles
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
                    
                    {/* Left side editor */}
                    <div className="md:col-span-4 space-y-4">
                      
                      {/* Title */}
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] font-bold uppercase tracking-wider">Article Title</label>
                        <input 
                          type="text"
                          value={editingArticle.title || ""}
                          onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                          placeholder="e.g. 5 Simple Secrets to Perfect Kenyan Ndengu (Green Grams)"
                          className="w-full px-3.5 py-2.5 bg-cream-bg border border-primary-teal font-sans text-xs text-primary-teal focus:outline-none focus:border-gold-yellow"
                          required
                        />
                      </div>

                      {/* Excerpt */}
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] font-bold uppercase tracking-wider">Teaser Excerpt</label>
                        <textarea 
                          rows={2}
                          value={editingArticle.excerpt || ""}
                          onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                          placeholder="Provide a spicy introduction teaser sentence that entices readers to click read more..."
                          className="w-full px-3.5 py-2.5 bg-cream-bg border border-primary-teal font-sans text-xs text-primary-teal focus:outline-none focus:border-gold-yellow"
                          required
                        />
                      </div>

                      {/* Content rich text / html */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="font-mono text-[9px] font-bold uppercase tracking-wider">Full HTML Article Body</label>
                          <span className="font-mono text-[8px] text-primary-teal/40 uppercase">Supports HTML tags like &lt;p&gt;, &lt;h3&gt;, &lt;strong&gt;, &lt;ol&gt;</span>
                        </div>
                        <textarea 
                          rows={12}
                          value={editingArticle.content || ""}
                          onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                          placeholder="<h3>Our Journey</h3><p>Start writing beautiful blog copy here...</p>"
                          className="w-full px-3.5 py-2.5 bg-cream-bg border border-primary-teal font-mono text-xs text-primary-teal focus:outline-none focus:border-gold-yellow"
                          required
                        />
                      </div>

                    </div>

                    {/* Right side controls */}
                    <div className="md:col-span-2 space-y-4">
                      
                      {/* Read Time & Date */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="font-mono text-[8px] font-bold uppercase">Publish Date</label>
                          <input 
                            type="text"
                            value={editingArticle.date || "16 Jul 2026"}
                            onChange={(e) => setEditingArticle({ ...editingArticle, date: e.target.value })}
                            className="w-full px-2 py-1.5 bg-cream-bg border border-primary-teal font-sans text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[8px] font-bold uppercase">Read Time</label>
                          <input 
                            type="text"
                            value={editingArticle.readTime || "5 min read"}
                            onChange={(e) => setEditingArticle({ ...editingArticle, readTime: e.target.value })}
                            className="w-full px-2 py-1.5 bg-cream-bg border border-primary-teal font-sans text-xs"
                          />
                        </div>
                      </div>

                      {/* Image Preset selector */}
                      <div className="space-y-1.5">
                        <label className="font-mono text-[9px] font-bold uppercase tracking-wider block">
                          Featured Thumbnail Image
                        </label>
                        <select
                          value={selectedPresetImage}
                          onChange={(e) => setSelectedPresetImage(e.target.value)}
                          className="w-full px-3 py-2 bg-cream-bg border border-primary-teal font-sans text-xs text-primary-teal focus:outline-none"
                        >
                          {IMAGE_PRESETS.map((preset, idx) => (
                            <option key={idx} value={preset.url}>
                              Preset: {preset.label}
                            </option>
                          ))}
                        </select>
                        <div className="aspect-video w-full border border-primary-teal overflow-hidden bg-cream-bg">
                          <img 
                            src={selectedPresetImage} 
                            alt="Selected preset"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-primary-teal/10 flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-primary-teal hover:bg-primary-teal/95 text-white-card font-mono text-xs font-bold uppercase tracking-widest border-2 border-primary-teal cursor-pointer transition-colors text-center"
                    >
                      Publish Article to Live Blog
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowArticleForm(false); setEditingArticle(null); }}
                      className="px-6 py-3 bg-transparent hover:bg-primary-teal/5 text-primary-teal font-mono text-xs font-bold uppercase tracking-widest border-2 border-primary-teal cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}


              {/* SETTINGS TAB VIEW */}
              {activeTab === "settings" && (
                <div className="p-6 md:p-8 max-w-xl space-y-6">
                  <div>
                    <h3 className="font-display text-2xl font-black uppercase tracking-tight">
                      Security & Passphrase Settings
                    </h3>
                    <p className="font-sans text-xs text-gray-body/70">
                      Update the secret phrase used to log in to this Food Creator Admin Panel.
                    </p>
                  </div>

                  <form onSubmit={handleUpdatePassphrase} className="bg-cream-bg border-2 border-primary-teal p-6 space-y-4">
                    
                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] font-bold uppercase tracking-wider text-primary-teal">
                        New Passphrase
                      </label>
                      <input 
                        type="password"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 bg-white-card border border-primary-teal font-sans text-xs text-primary-teal focus:outline-none focus:border-gold-yellow"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] font-bold uppercase tracking-wider text-primary-teal">
                        Confirm New Passphrase
                      </label>
                      <input 
                        type="password"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 bg-white-card border border-primary-teal font-sans text-xs text-primary-teal focus:outline-none focus:border-gold-yellow"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gold-yellow hover:bg-gold-yellow/90 text-dark-green font-mono text-xs font-bold uppercase tracking-wider border-2 border-gold-yellow cursor-pointer transition-colors"
                    >
                      Update Passphrase
                    </button>
                  </form>
                </div>
              )}

            </div>

          </div>
        )}
      </motion.div>
    </div>
  );
}
