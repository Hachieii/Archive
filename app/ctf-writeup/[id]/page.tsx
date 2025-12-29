"use client";

import { useState, useMemo, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Trophy,
  Clock,
  Hash,
  ArrowUpRight,
  Flag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { competitionsData } from "@/lib/ctf-data";

// --- M3 CONSTANTS (SYNCED) ---
const M3_EASE_STANDARD: [number, number, number, number] = [0.2, 0.0, 0, 1.0];
const ANIMATION_DURATION = 0.3;

export default function CompetitionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const competition = competitionsData.find((c) => c.id === id);

  if (!competition) {
    return notFound();
  }

  const categories = useMemo(
    () => Array.from(new Set(competition.challenges.map((c) => c.category))),
    [competition]
  );
  const [activeTab, setActiveTab] = useState(categories[0]);

  const currentChallenges = useMemo(
    () => competition.challenges.filter((c) => c.category === activeTab),
    [competition.challenges, activeTab]
  );

  // Animation props dùng chung cho Pill (Tab)
  const pillAnimationProps = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2, ease: M3_EASE_STANDARD },
  };

  return (
    <div className="container max-w-5xl mx-auto px-6 py-12 min-h-screen pb-40">
      {/* NAVIGATION: Fade In + Scale nhẹ */}
      <Link href="/ctf-writeup">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: M3_EASE_STANDARD }}
          className="group flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors cursor-pointer w-fit"
        >
          <div className="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span className="text-sm font-medium">Back to Archives</span>
        </motion.div>
      </Link>

      {/* HERO HEADER: Chỉ Fade + Scale (Bỏ trượt dọc) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: M3_EASE_STANDARD }}
        className="relative rounded-[32px] bg-card border-2 border-border/40 overflow-hidden p-8 md:p-12 mb-12 shadow-sm"
      >
        <Flag className="absolute -right-6 -bottom-12 w-64 h-64 text-foreground/5 rotate-12 pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-wrap gap-3">
            <Badge
              variant="outline"
              className="bg-background/40 backdrop-blur-md border-primary/20 text-foreground px-3 py-1.5 h-auto text-sm gap-2 font-normal"
            >
              <Calendar className="w-4 h-4 text-primary" />
              {competition.date}
            </Badge>
            <Badge
              variant="outline"
              className="bg-background/40 backdrop-blur-md border-primary/20 text-foreground px-3 py-1.5 h-auto text-sm gap-2 font-normal"
            >
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="font-bold">{competition.totalPoints} pts</span>
            </Badge>
            <Badge
              variant="outline"
              className="bg-background/40 backdrop-blur-md border-primary/20 text-foreground px-3 py-1.5 h-auto text-sm gap-2 font-normal"
            >
              <Hash className="w-4 h-4 text-primary" />
              {competition.challenges.length} challenges
            </Badge>
          </div>

          <div className="space-y-4 max-w-3xl">
            <h1 className="font-brand text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-tight">
              {competition.name}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {competition.description}
            </p>
          </div>
        </div>
      </motion.div>

      {/* TABS SECTION */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex items-center gap-2 px-2"
        >
          <h2 className="text-xl font-bold font-brand">Challenges</h2>
          <div className="h-px flex-1 bg-border/50 ml-4" />
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-wrap gap-2 mb-8 bg-transparent p-0 w-full justify-start h-auto">
            {categories.map((cat) => {
              const isActive = activeTab === cat;
              return (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className={cn(
                    "group/tab relative isolate rounded-full px-6 py-2.5 text-sm outline-none ring-0 cursor-pointer transition-all duration-300",
                    "bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                    "hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                  )}
                >
                  <span
                    className={cn(
                      "relative z-20 font-medium transition-colors duration-200",
                      isActive
                        ? "text-primary font-bold"
                        : "text-muted-foreground"
                    )}
                  >
                    {cat}
                  </span>

                  {/* PILL: SYNC STYLE (Ghost Pill, Scale Animation) */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        {...pillAnimationProps}
                        className="absolute inset-0 bg-primary/10 rounded-full z-10"
                      />
                    )}
                  </AnimatePresence>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="relative min-h-50">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                // CONTENT: Fade In + Scale 0.98 -> 1 (Không trượt)
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{
                  duration: ANIMATION_DURATION,
                  ease: M3_EASE_STANDARD,
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {currentChallenges.map((chall) => (
                  <Link
                    key={chall.slug}
                    href={`/ctf-writeup/${id}/${chall.category.toLowerCase()}/${
                      chall.slug
                    }`}
                    className="group/card block h-full"
                  >
                    <motion.div
                      layout="position" // Giữ layout animation khi re-order (optional)
                      className="h-full p-6 rounded-[24px] bg-card border-2 border-border/40 hover:border-primary/40 hover:shadow-xl hover:bg-card/80 hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                          <Badge
                            variant="secondary"
                            className="bg-secondary/50 text-secondary-foreground font-normal px-3"
                          >
                            {chall.category}
                          </Badge>
                          <span className="font-mono text-sm font-bold text-primary flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md">
                            <Hash className="w-3.5 h-3.5" />
                            {chall.points}
                          </span>
                        </div>

                        <h3 className="font-brand text-xl font-bold text-foreground mb-3 group-hover/card:text-primary transition-colors">
                          {chall.title}
                        </h3>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1 leading-relaxed">
                          {chall.description}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-dashed border-border/40 mt-auto">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{chall.readTime} read</span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-background border border-border/50 flex items-center justify-center text-muted-foreground group-hover/card:text-primary group-hover/card:border-primary transition-colors">
                            <ArrowUpRight className="w-4 h-4 group-hover/card:rotate-45 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
