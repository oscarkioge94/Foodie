import { useState, useMemo, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Clock, Users, BookOpen, ChevronRight, X, Heart, Award, MessageSquare, Send, Check } from "lucide-react";
import { MenuItem, Article } from "../types";
import { MENU_ITEMS, ARTICLES } from "../data/foodData";

interface RecipeParadiseProps {
  onToggleSaveRecipe: (item: MenuItem) => void;
  savedRecipeIds: string[];
  viewRecipe?: MenuItem | null;
  onClearViewRecipe?: () => void;
}

interface Comment {
  id: string;
  name: string;
  text: string;
  date: string;
}

export default function RecipeParadise({
  onToggleSaveRecipe,
  savedRecipeIds,
  viewRecipe,
  onClearViewRecipe,
}: RecipeParadiseProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeRecipe, setActiveRecipe] = useState<MenuItem | null>(null);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  // Trigger showing recipe when selected from saved drawer
  useEffect(() => {
    if (viewRecipe) {
      setActiveRecipe(viewRecipe);
      if (onClearViewRecipe) {
        onClearViewRecipe();
      }
    }
  }, [viewRecipe, onClearViewRecipe]);

  // Comments state inside the active recipe modal
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

  const categories = [
    { id: "all", label: "All Recipes" },
    { id: "breakfast", label: "Breakfast" },
    { id: "lunch", label: "Lunch" },
    { id: "dinner", label: "Dinner" },
    { id: "healthy", label: "Healthy Foods" },
    { id: "weightloss", label: "Weight Loss" },
    { id: "kenyan", label: "Kenyan Cuisines" },
  ];

  // Filter MENU_ITEMS to only keep the real migrated recipes
  const foodBlogRecipes = useMemo(() => {
    return MENU_ITEMS.filter((item) => item.id.startsWith("migrated-recipe-"));
  }, []);

  // Filter recipes based on search query and category tags
  const filteredRecipes = useMemo(() => {
    return foodBlogRecipes.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (selectedCategory === "all") return true;

      // Category filter matching logic
      if (selectedCategory === "breakfast") {
        return item.category === "breakfast";
      }
      if (selectedCategory === "lunch") {
        return item.category === "lunch" || item.category === "kenyan";
      }
      if (selectedCategory === "dinner") {
        return item.category === "dinner" || item.category === "kenyan";
      }
      if (selectedCategory === "healthy") {
        return item.category === "healthy" || item.category === "breakfast";
      }
      if (selectedCategory === "weightloss") {
        return item.category === "weightloss" || item.nutrition.calories < 350;
      }
      if (selectedCategory === "kenyan") {
        return item.category === "kenyan";
      }

      return item.category === selectedCategory;
    });
  }, [foodBlogRecipes, selectedCategory, searchQuery]);

  // Load comments when activeRecipe opens
  useEffect(() => {
    if (activeRecipe) {
      const saved = localStorage.getItem(`becca_comments_${activeRecipe.id}`);
      if (saved) {
        try {
          setComments(JSON.parse(saved));
        } catch (err) {
          console.error("Error loading comments:", err);
        }
      } else {
        // Seed initial comments if none exist to make it feel organic and lively
        const initialSeeds: Comment[] = [
          {
            id: "seed-1",
            name: "Faith Wambui",
            text: `I tried cooking this over the weekend and my whole family loved it! The instructions were very clear and easy to follow.`,
            date: "Jul 10, 2026",
          },
          {
            id: "seed-2",
            name: "John Kamau",
            text: `Authentic taste and perfectly portioned. Will definitely bookmark this for my meal prep next week!`,
            date: "Jul 12, 2026",
          },
        ];
        setComments(initialSeeds);
        localStorage.setItem(`becca_comments_${activeRecipe.id}`, JSON.stringify(initialSeeds));
      }
    }
  }, [activeRecipe]);

  // Handle comment submit
  const handleCommentSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim() || !activeRecipe) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      name: newCommentName.trim(),
      text: newCommentText.trim(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem(`becca_comments_${activeRecipe.id}`, JSON.stringify(updated));
    setNewCommentName("");
    setNewCommentText("");
  };

  return (
    <section className="bg-[#FDFBF7] py-20 border-t-2 border-[#1A1A1A]/10" id="recipes">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Welcome Banner */}
        <div className="bg-[#E6F4F0] border-2 border-[#1A1A1A] p-8 md:p-16 text-center space-y-6 relative overflow-hidden mb-20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#C4A484]/10 rounded-full blur-2xl -mr-8 -mt-8" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#C4A484] block">
            Welcome to Becca's Food Paradise
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase text-[#1A1A1A] tracking-tight leading-[0.95] max-w-3xl mx-auto">
            Discover a World of Wholesome Recipes
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#1A1A1A]/70 max-w-2xl mx-auto leading-relaxed font-light">
            Discover a world of delicious recipes, healthy meal ideas and culinary inspiration designed for every food lover. From traditional Kenyan comfort meals like Ugali and fragrant Pilau, to modern weight-loss smoothies and salads, we bring you easy-to-follow guides that make cooking fun, nutritious and enjoyable.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-lg mx-auto">
            <div className="relative w-full flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/40" />
              <input
                type="text"
                placeholder="Search recipes by keyword or ingredient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-none border-2 border-[#1A1A1A] bg-[#FDFBF7] font-mono text-xs uppercase tracking-wider focus:outline-none focus:border-[#C4A484] text-[#1A1A1A]"
              />
            </div>
            <button
              onClick={() => {
                const element = document.getElementById("discover-recipes");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto px-8 py-3 bg-[#C4A484] hover:bg-[#1A1A1A] hover:text-[#FDFBF7] text-[#1A1A1A] font-mono text-xs font-bold uppercase tracking-widest border-2 border-[#1A1A1A] transition-colors cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>

        {/* 2. Explore Foods by Categories Section */}
        <div className="mb-16 text-center space-y-4" id="discover-recipes">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#C4A484]">
            Curated Categories
          </span>
          <h3 className="font-display text-3xl sm:text-4xl font-black uppercase text-[#1A1A1A] tracking-tighter">
            Explore Foods by Categories
          </h3>
          <p className="font-sans text-xs text-[#1A1A1A]/50 max-w-md mx-auto font-light uppercase tracking-wider">
            Click a tag to instantly filter traditional stews, breakfast treats, or healthy weight-loss options
          </p>

          <div className="flex flex-wrap justify-center gap-2 pt-6 max-w-4xl mx-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-3 border-2 font-mono text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[#C4A484] text-[#1A1A1A] border-[#1A1A1A]"
                    : "bg-[#FDFBF7] text-[#1A1A1A] border-[#1A1A1A]/10 hover:border-[#1A1A1A] hover:bg-[#1A1A1A]/5"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Discover Delicious Recipes Section */}
        <div className="space-y-6 mb-24">
          <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-4">
            <h4 className="font-display font-black text-xl uppercase text-[#1A1A1A] tracking-tight">
              Discover Delicious Recipes
            </h4>
            <span className="font-mono text-xs text-[#1A1A1A]/60 uppercase">
              Showing {filteredRecipes.length} recipes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredRecipes.map((item, index) => {
                const isSaved = savedRecipeIds.includes(item.id);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-[#FDFBF7] border-2 border-[#1A1A1A] flex flex-col h-full overflow-hidden group hover:shadow-lg transition-all"
                  >
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden border-b border-[#1A1A1A]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/50 via-transparent to-transparent" />
                      <span className="absolute top-4 left-4 bg-[#FDFBF7] text-[#1A1A1A] border border-[#1A1A1A] font-mono text-[8px] font-bold px-3 py-1 uppercase tracking-widest">
                        {item.categoryLabel}
                      </span>
                      {item.signature && (
                        <span className="absolute top-4 right-4 bg-[#C4A484] text-[#1A1A1A] border border-[#1A1A1A] font-mono text-[8px] font-bold px-3 py-1 uppercase tracking-widest flex items-center space-x-1">
                          <Award className="w-3 h-3" />
                          <span>Highly Rated</span>
                        </span>
                      )}
                      <span className="absolute bottom-0 right-0 bg-[#1A1A1A] text-[#FDFBF7] font-mono text-[10px] font-bold px-3.5 py-1.5 border-l border-t border-[#1A1A1A]">
                        Recipe & Steps
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <h4 className="font-display text-base font-black uppercase tracking-tight text-[#1A1A1A] line-clamp-1 group-hover:text-[#C4A484] transition-colors">
                          {item.name}
                        </h4>
                        <p className="font-sans text-xs text-[#1A1A1A]/70 leading-relaxed font-light line-clamp-2">
                          {item.description}
                        </p>
                        
                        {/* Prep / Cook times summary */}
                        <div className="flex items-center space-x-4 pt-1.5 font-mono text-[9px] text-[#1A1A1A]/50 uppercase">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Prep: {item.prepTime || "15m"}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-3.5 h-3.5" />
                            <span>Serves: {item.servings || "2-4"}</span>
                          </div>
                        </div>

                        {/* Calories & Macronutrients */}
                        <div className="mt-2 inline-flex flex-wrap items-center gap-x-2 gap-y-1 bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 px-2.5 py-1 font-mono text-[9px] font-bold text-[#1A1A1A]/70 uppercase">
                          <span className="text-[#C4A484]">{item.nutrition.calories} kcal</span>
                          <span className="text-[#1A1A1A]/20">|</span>
                          <span>P: {item.nutrition.protein}g</span>
                          <span>C: {item.nutrition.carbs}g</span>
                          <span>F: {item.nutrition.fats}g</span>
                        </div>
                      </div>

                      {/* Interactive Buttons */}
                      <div className="pt-6 mt-6 border-t border-[#1A1A1A]/10 flex items-center justify-between">
                        <button
                          onClick={() => setActiveRecipe(item)}
                          className="flex items-center space-x-1 font-mono text-[10px] font-bold tracking-wider text-[#1A1A1A] hover:text-[#C4A484] uppercase cursor-pointer"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>View Recipe →</span>
                        </button>

                        <button
                          onClick={() => onToggleSaveRecipe(item)}
                          className={`px-4 py-2 border-2 border-[#1A1A1A] font-mono text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-colors flex items-center space-x-1 ${
                            isSaved
                              ? "bg-[#C4A484] text-[#1A1A1A]"
                              : "bg-[#1A1A1A] text-[#FDFBF7] hover:bg-[#1A1A1A]/90"
                          }`}
                        >
                          <Heart className={`w-3 h-3 ${isSaved ? "fill-current" : ""}`} />
                          <span>{isSaved ? "Saved" : "Save"}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredRecipes.length === 0 && (
              <div className="col-span-full text-center py-12 font-mono text-xs text-[#1A1A1A]/50 uppercase tracking-widest">
                No recipes match your active filter. Try "All Recipes".
              </div>
            )}
          </div>
        </div>

        {/* 4. Latest Articles & Food Tips Section */}
        <div className="space-y-6 pt-12 border-t border-[#1A1A1A]/10" id="articles">
          <div className="text-center space-y-3 mb-12">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#C4A484] block">
              Culinary Insights
            </span>
            <h3 className="font-display text-3xl sm:text-4xl font-black uppercase text-[#1A1A1A] tracking-tight">
              Latest Articles & Food Tips
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#1A1A1A]/60 max-w-xl mx-auto font-light">
              Stay inspired with healthy eating tips, portion control guides, nutrition advice, and delicious food stories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ARTICLES.map((article) => (
              <div
                key={article.id}
                className="bg-[#FDFBF7] border-2 border-[#1A1A1A] flex flex-col h-full overflow-hidden group hover:shadow-lg transition-all"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden border-b border-[#1A1A1A]">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute bottom-4 left-4 bg-[#FDFBF7] text-[#1A1A1A] border border-[#1A1A1A] font-mono text-[8px] font-bold px-2.5 py-1 uppercase tracking-widest">
                    {article.date}
                  </span>
                  <span className="absolute bottom-4 right-4 bg-[#1A1A1A] text-[#FDFBF7] font-mono text-[8px] font-bold px-2.5 py-1 uppercase tracking-widest">
                    {article.readTime}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-display text-base font-black uppercase tracking-tight text-[#1A1A1A] line-clamp-2 leading-tight group-hover:text-[#C4A484] transition-colors">
                      {article.title}
                    </h4>
                    <p className="font-sans text-xs text-[#1A1A1A]/70 leading-relaxed font-light line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#1A1A1A]/10">
                    <button
                      onClick={() => setActiveArticle(article)}
                      className="px-5 py-2.5 w-full bg-[#1A1A1A]/5 hover:bg-[#1A1A1A] hover:text-[#FDFBF7] border-2 border-[#1A1A1A] font-mono text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] text-center cursor-pointer transition-colors"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* --- POPUPS / MODALS --- */}
      {/* 1. Recipe Detail Modal */}
      <AnimatePresence>
        {activeRecipe && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveRecipe(null)}
              className="absolute inset-0 bg-[#1A1A1A]/75 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-[#FDFBF7] border-4 border-[#1A1A1A] max-h-[85vh] overflow-y-auto z-10 flex flex-col text-[#1A1A1A]"
            >
              {/* Image banner */}
              <div className="relative h-64 md:h-80 shrink-0 border-b-2 border-[#1A1A1A]">
                <img
                  src={activeRecipe.image}
                  alt={activeRecipe.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-[#1A1A1A]/20 to-transparent" />
                
                {/* Close Button */}
                <button
                  onClick={() => setActiveRecipe(null)}
                  className="absolute top-4 right-4 p-2 bg-[#FDFBF7] border-2 border-[#1A1A1A] hover:bg-[#C4A484] transition-colors cursor-pointer text-[#1A1A1A]"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-6 left-6 right-6 text-[#FDFBF7] space-y-1.5 font-display">
                  <span className="font-mono text-[10px] font-bold uppercase bg-[#C4A484] text-[#1A1A1A] border border-[#1A1A1A] px-2.5 py-0.5 tracking-wider">
                    {activeRecipe.categoryLabel}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                    {activeRecipe.name}
                  </h3>
                </div>
              </div>

              {/* Cooking statistics metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 border-b-2 border-[#1A1A1A] bg-[#1A1A1A]/5 text-center font-mono text-[10px] font-bold uppercase divide-x divide-y md:divide-y-0 divide-[#1A1A1A]/10 text-[#1A1A1A]/80">
                <div className="p-3 flex flex-col justify-center">
                  <span className="text-[8px] text-[#1A1A1A]/40">PREP TIME</span>
                  <span>{activeRecipe.prepTime || "15 mins"}</span>
                </div>
                <div className="p-3 flex flex-col justify-center">
                  <span className="text-[8px] text-[#1A1A1A]/40">COOK TIME</span>
                  <span>{activeRecipe.cookTime || "20 mins"}</span>
                </div>
                <div className="p-3 flex flex-col justify-center">
                  <span className="text-[8px] text-[#1A1A1A]/40">SERVINGS</span>
                  <span>{activeRecipe.servings || "2-4 portions"}</span>
                </div>
                <div className="p-3 flex flex-col justify-center">
                  <span className="text-[8px] text-[#1A1A1A]/40">CALORIES</span>
                  <span>{activeRecipe.nutrition.calories} kcal</span>
                </div>
              </div>

              {/* Content Grid */}
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left col: Ingredients and Nutrition facts */}
                <div className="md:col-span-5 space-y-6">
                  <div className="space-y-3">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#C4A484] block">
                      Ingredients Checklist
                    </span>
                    <ul className="space-y-2.5 font-sans text-xs">
                      {activeRecipe.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-start space-x-2 text-[#1A1A1A]/80">
                          <Check className="w-4 h-4 text-[#C4A484] shrink-0 mt-0.5" />
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Nutrition details card */}
                  <div className="border-t border-[#1A1A1A]/10 pt-5 space-y-3">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#C4A484] block">
                      Macronutrient Balance
                    </span>
                    <div className="bg-[#1A1A1A]/5 p-3.5 border border-[#1A1A1A]/10 font-mono text-[9px] uppercase tracking-wider grid grid-cols-3 gap-2 text-center">
                      <div>
                        <span className="block text-[#1A1A1A]/40 text-[8px]">PROTEIN</span>
                        <span className="text-[#1A1A1A] font-bold">{activeRecipe.nutrition.protein}g</span>
                      </div>
                      <div>
                        <span className="block text-[#1A1A1A]/40 text-[8px]">CARBS</span>
                        <span className="text-[#1A1A1A] font-bold">{activeRecipe.nutrition.carbs}g</span>
                      </div>
                      <div>
                        <span className="block text-[#1A1A1A]/40 text-[8px]">FATS</span>
                        <span className="text-[#1A1A1A] font-bold">{activeRecipe.nutrition.fats}g</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right col: Method Steps */}
                <div className="md:col-span-7 space-y-6">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#C4A484] block">
                    Step-by-Step Directions
                  </span>
                  {activeRecipe.recipeSteps ? (
                    <ol className="space-y-4 font-sans text-xs text-[#1A1A1A]/80 font-light">
                      {activeRecipe.recipeSteps.map((step, idx) => (
                        <li key={idx} className="flex space-x-3.5">
                          <span className="font-mono font-black text-xs text-[#C4A484] shrink-0 border-2 border-[#1A1A1A] w-6 h-6 rounded-none flex items-center justify-center bg-[#FDFBF7]">
                            {idx + 1}
                          </span>
                          <p className="leading-relaxed pt-0.5">{step}</p>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <div className="font-sans text-xs text-[#1A1A1A]/60 italic font-light leading-relaxed">
                      Detailed step-by-step cooking logs are ready. Enjoy cooking this delicious home meal!
                    </div>
                  )}

                  {/* Bookmark CTA */}
                  <div className="pt-6 mt-6 border-t border-[#1A1A1A]/10">
                    <button
                      onClick={() => {
                        onToggleSaveRecipe(activeRecipe);
                      }}
                      className={`w-full font-mono text-xs font-bold tracking-widest uppercase py-3 border-2 border-[#1A1A1A] rounded-none cursor-pointer flex items-center justify-center space-x-2 transition-colors ${
                        savedRecipeIds.includes(activeRecipe.id)
                          ? "bg-[#C4A484] text-[#1A1A1A] hover:bg-[#C4A484]/90"
                          : "bg-[#1A1A1A] text-[#FDFBF7] hover:bg-[#1A1A1A]/90"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${savedRecipeIds.includes(activeRecipe.id) ? "fill-current" : ""}`} />
                      <span>
                        {savedRecipeIds.includes(activeRecipe.id) ? "Recipe Saved (Remove)" : "Save to My Saved Recipes"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="border-t-2 border-[#1A1A1A] bg-[#1A1A1A]/5 p-6 md:p-8 space-y-6">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-[#C4A484]" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A1A] block">
                    Reader Comments & Reviews ({comments.length})
                  </span>
                </div>

                {/* Comment Form */}
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-1">
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        value={newCommentName}
                        onChange={(e) => setNewCommentName(e.target.value)}
                        className="w-full px-3 py-2 border border-[#1A1A1A]/30 bg-[#FDFBF7] font-sans text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none focus:border-[#C4A484]"
                      />
                    </div>
                    <div className="sm:col-span-3 flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Leave a comment about this recipe..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        className="w-full px-3 py-2 border border-[#1A1A1A]/30 bg-[#FDFBF7] font-sans text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none focus:border-[#C4A484]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#1A1A1A] text-[#FDFBF7] hover:bg-[#C4A484] hover:text-[#1A1A1A] font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 flex items-center justify-center"
                      >
                        <Send className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4 max-h-56 overflow-y-auto pr-2">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-[#FDFBF7] border border-[#1A1A1A]/10 p-4 space-y-1">
                      <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider">
                        <span className="font-bold text-[#1A1A1A]">{comment.name}</span>
                        <span className="text-[#1A1A1A]/40">{comment.date}</span>
                      </div>
                      <p className="font-sans text-xs text-[#1A1A1A]/80 leading-relaxed font-light">
                        {comment.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Article Reader Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveArticle(null)}
              className="absolute inset-0 bg-[#1A1A1A]/75 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#FDFBF7] border-4 border-[#1A1A1A] max-h-[85vh] overflow-y-auto z-10 flex flex-col text-[#1A1A1A]"
            >
              {/* Header block */}
              <div className="p-6 md:p-8 border-b-2 border-[#1A1A1A] space-y-4">
                <div className="flex items-center justify-between text-mono text-[9px] text-[#1A1A1A]/50 uppercase tracking-widest">
                  <span>Becca's Food Logs</span>
                  <span>{activeArticle.readTime}</span>
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-black uppercase text-[#1A1A1A] tracking-tight leading-tight">
                  {activeArticle.title}
                </h3>
                
                {/* Close Button */}
                <button
                  onClick={() => setActiveArticle(null)}
                  className="absolute top-4 right-4 p-2 bg-[#FDFBF7] border-2 border-[#1A1A1A] hover:bg-[#C4A484] transition-colors cursor-pointer text-[#1A1A1A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Image banner */}
              <div className="relative h-56 md:h-64 shrink-0 border-b-2 border-[#1A1A1A]">
                <img
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content body */}
              <div className="p-6 md:p-8 space-y-6 overflow-y-auto">
                <p className="font-sans text-xs md:text-sm text-[#1A1A1A]/90 font-medium leading-relaxed bg-[#C4A484]/10 p-4 border-l-4 border-[#C4A484]">
                  {activeArticle.excerpt}
                </p>
                <div className="font-sans text-xs md:text-sm text-[#1A1A1A]/80 leading-relaxed font-light space-y-4 prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: activeArticle.content }} />
                </div>

                <div className="pt-6 border-t border-[#1A1A1A]/10 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="flex-1 py-3 bg-[#1A1A1A] hover:bg-[#1A1A1A]/95 text-[#FDFBF7] font-mono text-xs font-bold tracking-widest uppercase border-2 border-[#1A1A1A] text-center cursor-pointer"
                  >
                    Close Article
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
