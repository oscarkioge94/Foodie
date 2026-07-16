import { motion } from "motion/react";
import { X, Heart, Clock, Users, BookOpen, Trash2 } from "lucide-react";
import { MenuItem } from "../types";
import { getImageUrl } from "../utils/image";

interface SavedRecipesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedRecipes: MenuItem[];
  onRemoveRecipe: (id: string) => void;
  onViewRecipe: (recipe: MenuItem) => void;
}

export default function SavedRecipesDrawer({
  isOpen,
  onClose,
  savedRecipes,
  onRemoveRecipe,
  onViewRecipe,
}: SavedRecipesDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#1A1A1A]/50 backdrop-blur-sm"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-screen max-w-md bg-[#FDFBF7] border-l-4 border-[#1A1A1A] shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b-2 border-[#1A1A1A] flex items-center justify-between bg-[#1A1A1A]/5">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-[#C4A484] fill-[#C4A484]" />
              <h2 className="font-display font-black text-lg uppercase tracking-tight text-[#1A1A1A]">
                Saved Recipes ({savedRecipes.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 border-2 border-[#1A1A1A] bg-[#FDFBF7] hover:bg-[#1A1A1A] hover:text-[#FDFBF7] transition-all cursor-pointer text-[#1A1A1A]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {savedRecipes.length > 0 ? (
              savedRecipes.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#FDFBF7] border-2 border-[#1A1A1A] p-4 flex gap-4 hover:shadow-md transition-all group"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 shrink-0 border border-[#1A1A1A] overflow-hidden bg-[#1A1A1A]/5">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-350"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-[8px] uppercase tracking-wider text-[#C4A484] block font-bold mb-0.5">
                        {item.categoryLabel}
                      </span>
                      <h4 className="font-display text-xs font-black uppercase text-[#1A1A1A] tracking-tight line-clamp-1 group-hover:text-[#C4A484] transition-colors">
                        {item.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 font-mono text-[8px] text-[#1A1A1A]/40 uppercase">
                        <span className="flex items-center space-x-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{item.prepTime || "15m"}</span>
                        </span>
                        <span className="flex items-center space-x-0.5">
                          <Users className="w-3 h-3" />
                          <span>Serves {item.servings || "2"}</span>
                        </span>
                        <span className="text-[#C4A484] font-bold">
                          {item.nutrition.calories} kcal
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#1A1A1A]/10">
                      <button
                        onClick={() => {
                          onViewRecipe(item);
                          onClose();
                        }}
                        className="flex items-center space-x-1 font-mono text-[9px] font-bold text-[#1A1A1A] hover:text-[#C4A484] uppercase cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Cook Now</span>
                      </button>

                      <button
                        onClick={() => onRemoveRecipe(item.id)}
                        className="p-1 border border-[#1A1A1A]/20 hover:border-red-600 hover:bg-red-50 text-[#1A1A1A]/60 hover:text-red-600 transition-all rounded-none cursor-pointer"
                        title="Remove from bookmarks"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#1A1A1A]/25 flex items-center justify-center text-[#1A1A1A]/25">
                  <Heart className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-black text-sm uppercase text-[#1A1A1A]">
                    No saved recipes yet
                  </h4>
                  <p className="font-sans text-xs text-[#1A1A1A]/50 leading-relaxed font-light">
                    Browse our food blog recipes and tap the heart or bookmark buttons to keep your favorite meals here!
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#C4A484] hover:text-[#1A1A1A] text-[#FDFBF7] font-mono text-[9px] font-bold uppercase tracking-widest border-2 border-[#1A1A1A] cursor-pointer"
                >
                  Explore Recipes
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
