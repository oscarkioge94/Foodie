import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Menu, X, Leaf } from "lucide-react";

interface NavbarProps {
  savedCount: number;
  onOpenSaved: () => void;
}

export default function Navbar({ savedCount, onOpenSaved }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "About Blog", href: "#philosophy" },
    { name: "Discover Recipes", href: "#recipes" },
    { name: "Latest Articles", href: "#articles" },
  ];

  const handleLinkClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header id="main-header" className="fixed top-0 left-0 right-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#1A1A1A]/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              className="text-[#1A1A1A]"
            >
              <Leaf className="w-5 h-5 text-[#3D4B3A] fill-[#3D4B3A]/10" />
            </motion.div>
            <span className="font-display font-black text-2xl tracking-tighter uppercase text-[#1A1A1A]">
              Becca<span className="italic font-serif font-normal lowercase text-[#C4A484]">Foodies</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleLinkClick(link.href)}
                className="font-sans text-[11px] font-semibold text-[#1A1A1A]/80 hover:text-black tracking-[0.2em] uppercase relative py-1 group cursor-pointer"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#1A1A1A] transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center space-x-5">
            {/* Saved Recipes Bookmarks Toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenSaved}
              className="px-6 py-2 border-2 border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FDFBF7] transition-all duration-200 text-[11px] font-bold tracking-[0.15em] uppercase text-[#1A1A1A] cursor-pointer flex items-center space-x-2"
              id="desktop-saved-recipes-button"
            >
              <Heart className="w-4 h-4 text-[#C4A484] fill-[#C4A484]" />
              <span>SAVED RECIPES</span>
              <AnimatePresence>
                {savedCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="bg-[#1A1A1A] text-[#FDFBF7] text-[9px] font-mono font-bold px-2 py-0.5 rounded-none ml-1"
                  >
                    {savedCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Mobile Actions / Toggle */}
          <div className="flex items-center space-x-3 md:hidden">
            {/* Saved Recipes Button Mobile */}
            <button
              onClick={onOpenSaved}
              className="relative p-2 rounded-full hover:bg-[#1A1A1A]/5 text-[#1A1A1A]"
              id="mobile-saved-recipes-button"
            >
              <Heart className="w-5 h-5 text-[#C4A484] fill-[#C4A484]" />
              {savedCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#1A1A1A] text-[#FDFBF7] text-[8px] font-mono font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#1A1A1A] hover:bg-[#1A1A1A]/5 rounded-full"
              id="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#FDFBF7] border-t border-[#1A1A1A]/10 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-4">
              <nav className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleLinkClick(link.href)}
                    className="text-left py-2 text-sm font-semibold text-[#1A1A1A]/80 hover:text-black uppercase tracking-widest border-b border-[#1A1A1A]/5"
                  >
                    {link.name}
                  </button>
                ))}
              </nav>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenSaved();
                  }}
                  className="w-full text-center py-3 border-2 border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FDFBF7] transition-all duration-200 text-xs font-bold tracking-[0.2em] uppercase text-[#1A1A1A] flex items-center justify-center space-x-2"
                  id="mobile-saved-action-btn"
                >
                  <Heart className="w-4 h-4 text-[#C4A484] fill-[#C4A484]" />
                  <span>VIEW SAVED RECIPES ({savedCount})</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
