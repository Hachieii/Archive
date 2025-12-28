"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Trophy,
  FolderOpen,
  Calendar,
  ChevronDown,
  Hash,
  Clock,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { competitionsData } from "@/lib/ctf-data";

const M3_EMPHASIZED = { duration: 0.4, ease: [0.05, 0.7, 0.1, 1.0] as const };
const M3_ENTER = { duration: 0.3, ease: [0.2, 0.0, 0.0, 1.0] as const };

const CompetitionCard = ({
  comp,
  isExpanded,
  onToggle,
}: {
  comp: any;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const categories = useMemo(
    () =>
      Array.from(
        new Set(comp.challenges.map((c: any) => c.category))
      ) as string[],
    [comp]
  );

  const [activeTab, setActiveTab] = useState(categories[0]);
  const cardRef = useRef<HTMLDivElement>(null);

  const sortedChallenges = useMemo(() => {
    return [...comp.challenges]
      .filter((c: any) => c.category === activeTab)
      .sort((a, b) => a.points - b.points);
  }, [comp.challenges, activeTab]);

  const handleToggle = () => {
    onToggle();
    if (!isExpanded && cardRef.current) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  };

  return (
    <motion.div
      layout
      transition={M3_EMPHASIZED}
      className={cn(
        "group rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-card overflow-hidden",
        isExpanded
          ? "border-primary shadow-xl ring-1 ring-primary/20"
          : "hover:border-primary/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
      )}
    >
      <motion.div
        layout="position"
        onClick={handleToggle}
        className="relative p-8 cursor-pointer select-none"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm text-muted-foreground font-mono">
              <Calendar className="w-4 h-4" />
              <span>{comp.date}</span>
              <span className="w-1 h-1 rounded-full bg-primary/50" />
              <span
                className={cn(
                  "transition-colors duration-300",
                  isExpanded && "text-primary font-bold"
                )}
              >
                {comp.challenges.length} challenges
              </span>
            </div>
            <h2 className="font-brand text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              {comp.name}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-primary backdrop-blur-sm">
              <Trophy className="w-4 h-4" />
              <span className="font-bold">{comp.totalPoints} pts</span>
            </div>

            <Link
              href={`/ctf-writeup/${comp.id}`}
              onClick={(e) => e.stopPropagation()}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-zinc-200 dark:border-zinc-700 text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>

            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={M3_EMPHASIZED}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border",
                isExpanded
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-zinc-200 dark:border-zinc-700 group-hover:border-primary/50"
              )}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            layout
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={M3_EMPHASIZED}
            style={{ overflow: "hidden" }}
          >
            <div className="px-8 pb-8 pt-2 relative z-10">
              <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 mb-6" />

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="flex flex-wrap gap-2 mb-8 bg-transparent p-0 w-full justify-start h-auto">
                  {categories.map((cat) => (
                    <TabsTrigger
                      key={cat}
                      value={cat}
                      className={cn(
                        "group/tab relative isolate rounded-full px-6 py-2 text-sm outline-none ring-0 transition-all duration-300 cursor-pointer",
                        "bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                        "hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                      )}
                    >
                      <span
                        className="relative z-20 font-medium transition-colors duration-200"
                        style={{
                          color:
                            activeTab === cat
                              ? "var(--primary-foreground)"
                              : "var(--foreground)",
                          fontWeight: activeTab === cat ? 600 : 500,
                        }}
                      >
                        {cat}
                      </span>

                      {activeTab === cat && (
                        <motion.div
                          layoutId={`pill-${comp.id}`}
                          className="absolute inset-0 bg-primary rounded-full z-10 shadow-md"
                          transition={M3_EMPHASIZED}
                        />
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="relative min-h-[100px]">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={activeTab}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={M3_ENTER}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {sortedChallenges.map((chall: any) => (
                        <Link
                          key={chall.slug}
                          href={`/ctf-writeup/${
                            comp.id
                          }/${chall.category.toLowerCase()}/${chall.slug}`}
                          className="group/card block h-full"
                        >
                          <motion.div
                            layout="position"
                            className="h-full p-5 rounded-[24px] bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-primary/50 hover:shadow-lg hover:bg-background hover:-translate-y-1 transition-all duration-300 flex flex-col"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <Badge
                                variant="secondary"
                                className="bg-zinc-200/50 dark:bg-zinc-800/50 text-foreground font-normal border-zinc-200 dark:border-zinc-700"
                              >
                                {chall.category}
                              </Badge>
                              <span className="font-mono text-sm font-bold text-primary flex items-center gap-1">
                                <Hash className="w-3 h-3" />
                                {chall.points}
                              </span>
                            </div>
                            <h3 className="font-brand text-lg font-bold text-foreground mb-2 group-hover/card:text-primary transition-colors">
                              {chall.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                              {chall.description}
                            </p>
                            <div className="flex items-center justify-between pt-3 border-t border-dashed border-zinc-200 dark:border-zinc-800 mt-auto">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>{chall.readTime}</span>
                              </div>
                              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover/card:text-primary group-hover/card:rotate-45 transition-transform" />
                            </div>
                          </motion.div>
                        </Link>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </Tabs>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function WriteupListingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredCompetitions = useMemo(
    () =>
      competitionsData
        .map((comp) => {
          const matchingChallenges = comp.challenges.filter(
            (chall) =>
              chall.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              chall.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              comp.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          if (matchingChallenges.length > 0)
            return { ...comp, challenges: matchingChallenges };
          return null;
        })
        .filter(Boolean),
    [searchQuery]
  );

  return (
    <div className="container max-w-5xl mx-auto px-6 py-12 min-h-screen animate-m3-fade-in">
      <div className="mb-12 space-y-4">
        <div className="flex items-center gap-2 text-primary font-mono text-sm tracking-widest uppercase">
          <FolderOpen className="w-4 h-4" />
          <span>Root / Writeups</span>
        </div>
        <h1 className="font-brand text-5xl font-bold text-foreground">
          CTF Archive
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          My CTF writeup collection
        </p>
      </div>

      <div className="sticky top-4 z-40 mb-10 group">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search here"
            className="pl-12 bg-background/80 backdrop-blur-xl border-zinc-200 dark:border-zinc-800 focus:border-primary/50 h-14 rounded-2xl text-lg shadow-sm transition-all duration-300 hover:border-primary/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-6 pb-40">
        {filteredCompetitions.length > 0 ? (
          filteredCompetitions.map((comp: any) => (
            <CompetitionCard
              key={comp.id}
              comp={comp}
              isExpanded={expandedId === comp.id}
              onToggle={() =>
                setExpandedId(expandedId === comp.id ? null : comp.id)
              }
            />
          ))
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            No writeups found matching "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
}
