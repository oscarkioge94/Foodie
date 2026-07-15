import { motion } from "motion/react";
import { Leaf, Compass, Earth } from "lucide-react";

export default function Philosophy() {
  const pillars = [
    {
      num: "01",
      title: "Authentic Traditions",
      icon: <Earth className="w-5 h-5 text-[#1A1A1A] group-hover:text-[#C4A484] transition-colors" />,
      description: "We celebrate rich regional heritages. From fragrant Swahili coastal pilau and biryani to comforting highland ugali with traditional terere and githeri, we honor local crops and cooking roots.",
    },
    {
      num: "02",
      title: "Balanced Living",
      icon: <Leaf className="w-5 h-5 text-[#1A1A1A] group-hover:text-[#C4A484] transition-colors" />,
      description: "Smart eating is about understanding your body's needs. We share portion control guidelines, nutritional breakdowns, and healthy ingredient options to support sustained energy and weight-conscious goals.",
    },
    {
      num: "03",
      title: "Home Cooking Joy",
      icon: <Compass className="w-5 h-5 text-[#1A1A1A] group-hover:text-[#C4A484] transition-colors" />,
      description: "Cooking should be accessible, creative, and fun. Our detailed, easy-to-follow directions ensure that home-cooked meals become a space for family gathering, bonding, and everyday comfort.",
    },
  ];

  return (
    <section className="bg-[#FDFBF7] py-24 border-t border-[#1A1A1A]/10" id="philosophy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headings */}
        <div className="max-w-3xl mb-16 space-y-4">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#C4A484]"
          >
            The Blog Mission
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl sm:text-5xl font-black tracking-tighter uppercase text-[#1A1A1A]"
          >
            Our Culinary Philosophy
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-lg text-[#1A1A1A]/70 leading-relaxed font-light"
          >
            We believe that good food is the heartbeat of a healthy life. Our blog brings you wholesome recipes, practical lifestyle tips, and cooking guides that honor both your health and cultural traditions.
          </motion.p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="bg-[#FDFBF7] border-2 border-[#1A1A1A] rounded-none p-8 relative group hover:bg-[#1A1A1A] transition-all duration-300"
              id={`philosophy-card-${pillar.num}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-[#1A1A1A]/5 rounded-none border border-[#1A1A1A]/10 group-hover:bg-[#FDFBF7]/10 group-hover:border-[#FDFBF7]/25 transition-all">
                  {pillar.icon}
                </div>
                <span className="font-serif text-3xl italic font-normal text-[#C4A484] group-hover:text-[#C4A484] transition-colors">
                  {pillar.num}
                </span>
              </div>

              <h3 className="font-display text-lg font-black uppercase tracking-tight text-[#1A1A1A] group-hover:text-[#FDFBF7] mb-4 transition-colors">
                {pillar.title}
              </h3>

              <p className="font-sans text-xs text-[#1A1A1A]/70 group-hover:text-[#FDFBF7]/80 leading-relaxed transition-colors font-light">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Highlight Banner Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 bg-[#1A1A1A] text-[#FDFBF7] rounded-none p-8 sm:p-12 relative overflow-hidden border-2 border-[#1A1A1A]"
          id="philosophy-quote-banner"
        >
          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#C4A484]/10 blur-3xl" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C4A484] font-bold">
              Becca Vance's Vision
            </span>
            <p className="font-serif text-xl sm:text-2xl font-light italic leading-relaxed text-[#FDFBF7]/95">
              "Healthy eating is not a temporary restriction — it’s a lifelong journey of nourishing yourself with balance, cultural pride, and wholesome joy."
            </p>
            <div className="flex items-center space-x-3 pt-4">
              <div className="w-10 h-10 rounded-full bg-[#FDFBF7]/10 flex items-center justify-center font-serif text-sm italic text-[#C4A484]">
                B
              </div>
              <div>
                <h4 className="font-display text-xs font-bold tracking-wider uppercase">Becca Vance</h4>
                <p className="font-mono text-[9px] uppercase tracking-widest text-[#FDFBF7]/60">Food Blogger & Home Chef</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
