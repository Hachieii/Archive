"use client";

import {
  use,
  useEffect,
  useState,
  useMemo,
  useRef,
  memo,
  useLayoutEffect,
} from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Hash,
  BookOpen,
  Clock,
  Copy,
  Check,
  List,
  User,
  X,
  ZoomIn,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { competitionsData } from "@/lib/ctf-data";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { gruvboxDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// --- CONSTANTS ---
// FIX: Định nghĩa kiểu cụ thể [number, number, number, number] để khớp với Easing của framer-motion
const M3_EASE_STANDARD: [number, number, number, number] = [0.2, 0.0, 0, 1.0];
const ANIMATION_DURATION = 0.3;
const HEADER_OFFSET = 100;

// --- GLOBAL STATE ---
let hasPlayedSidebarAnimation = false;

// --- SKELETONS ---
const TocSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="w-full px-1 space-y-1"
  >
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className={cn(
          "relative py-2 px-3 flex items-center",
          i % 2 === 0 ? "pl-6" : "pl-3"
        )}
      >
        <div
          className={cn(
            "h-5 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse",
            i % 2 === 0 ? "w-[70%]" : "w-[50%]"
          )}
        />
      </div>
    ))}
  </motion.div>
);

const ContentSkeleton = () => (
  <div className="w-full space-y-8 mt-4">
    <div className="space-y-4 mb-16">
      <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        <div className="h-10 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
      </div>
    </div>
    <div className="space-y-12">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-4">
          <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-48 w-full bg-zinc-200/50 dark:bg-zinc-800/50 rounded-xl animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

// --- CODE BLOCK ---
const CodeBlock = ({ language, code }: { language: string; code: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error(err);
      }
    }
  };
  return (
    <div className="relative my-6 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm group font-mono text-sm bg-[#1d2021] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-700 bg-[#282828]">
        <span className="text-xs font-medium text-[#a89984] uppercase tracking-wider">
          {language || "text"}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-[#a89984] hover:text-[#ebdbb2] hover:bg-white/10 active:scale-95 transition-transform"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-[#b8bb26]" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>
      <div className="w-full overflow-x-auto">
        <SyntaxHighlighter
          language={language || "text"}
          style={customGruvbox}
          wrapLongLines={false}
          customStyle={{
            margin: 0,
            padding: "1.5rem",
            fontSize: "0.9rem",
            lineHeight: "1.5",
            fontFamily: "inherit",
            fontWeight: "500",
            backgroundColor: "transparent",
            minWidth: "100%",
          }}
          codeTagProps={{
            className: "font-mono",
            style: { fontWeight: "500" },
          }}
          showLineNumbers={true}
          lineNumberStyle={{
            minWidth: "2.5em",
            paddingRight: "1em",
            color: "#665c54",
            textAlign: "right",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
const customGruvbox = { ...gruvboxDark };
Object.keys(customGruvbox).forEach((key) => {
  customGruvbox[key].fontWeight = "500";
  customGruvbox[key].textShadow = "none";
});

// --- MARKDOWN ---
const MemoizedMarkdown = memo(
  ({
    content,
    onImageClick,
  }: {
    content: string;
    onImageClick: (src: string) => void;
  }) => (
    <div style={{ contain: "layout paint" }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <CodeBlock
                language={match[1]}
                code={String(children).replace(/\n$/, "")}
              />
            ) : (
              <code
                className="relative rounded bg-zinc-800 px-[0.4rem] py-[0.2rem] font-mono text-sm font-medium text-zinc-300 border border-zinc-700"
                {...props}
              >
                {children}
              </code>
            );
          },
          img: ({ node, ...props }) => (
            <div
              className="group relative my-8 w-full cursor-pointer rounded-xl border border-border/50 shadow-md overflow-hidden"
              onClick={() => props.src && onImageClick(String(props.src))}
            >
              <img
                className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
                {...props}
                alt={props.alt || ""}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ),
          h1: (props) => (
            <h2
              id={props.id}
              className="scroll-mt-32 border-b border-zinc-800 pb-2 text-3xl font-bold tracking-tight mt-10 mb-6 text-zinc-200"
              {...props}
            />
          ),
          h2: (props) => (
            <h3
              id={props.id}
              className="scroll-mt-32 text-2xl font-bold tracking-tight mt-8 mb-4 text-zinc-200"
              {...props}
            />
          ),
          h3: (props) => (
            <h4
              id={props.id}
              className="scroll-mt-32 text-xl font-semibold tracking-tight mt-6 mb-3 text-zinc-200"
              {...props}
            />
          ),
          p: (props) => <div className="leading-7 not-first:mt-6" {...props} />,
          a: (props) => (
            <a
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
              {...props}
            />
          ),
          blockquote: (props) => (
            <blockquote
              className="mt-6 border-l-4 border-primary/50 bg-muted/30 pl-6 py-2 italic text-muted-foreground rounded-r-lg"
              {...props}
            />
          ),
          hr: (props) => <hr className="my-8 border-zinc-800" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  ),
  (p, n) => p.content === n.content
);
MemoizedMarkdown.displayName = "MemoizedMarkdown";

// --- MAIN COMPONENT ---
interface WriteupClientProps {
  id: string;
  category: string;
  slug: string;
}

export default function WriteupClient({
  id,
  category,
  slug,
}: WriteupClientProps) {
  const [tocItems, setTocItems] = useState<
    { id: string; title: string; level: number }[]
  >([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const [tocStatus, setTocStatus] = useState<"loading" | "ready" | "empty">(
    "loading"
  );

  const nextCompetition = competitionsData.find((c) => c.id === id);
  const nextChallenge = nextCompetition?.challenges.find(
    (c) => c.slug === slug
  );

  // STATE
  const [displayedChallenge, setDisplayedChallenge] = useState(nextChallenge);
  const [displayedCompetition, setDisplayedCompetition] =
    useState(nextCompetition);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isManualScrolling = useRef(false);
  const activeChallengeRef = useRef<HTMLAnchorElement>(null);
  const shouldAnimateSidebar = useRef(!hasPlayedSidebarAnimation).current;

  const categoryChallenges = useMemo(
    () =>
      nextCompetition?.challenges.filter(
        (c) => c.category.toLowerCase() === category.toLowerCase()
      ) || [],
    [nextCompetition, category]
  );

  // --- 1. INSTANT PAGE NAV (PURE FADE) ---
  useLayoutEffect(() => {
    if (nextChallenge?.slug !== displayedChallenge?.slug && !isTransitioning) {
      document.documentElement.style.scrollBehavior = "auto";

      setIsTransitioning(true);
      setTocItems([]);
      setTocStatus("loading");

      setTimeout(() => {
        window.scrollTo(0, 0);
        setDisplayedChallenge(nextChallenge);
        setDisplayedCompetition(nextCompetition);
        setIsTransitioning(false);
      }, 200);
    }

    if (isInitialLoading) {
      window.scrollTo(0, 0);
      setTimeout(() => setIsInitialLoading(false), 500);
    }

    if (!hasPlayedSidebarAnimation) hasPlayedSidebarAnimation = true;
  }, [
    slug,
    nextChallenge,
    nextCompetition,
    displayedChallenge,
    isTransitioning,
    isInitialLoading,
  ]);

  // --- 2. INSTANT TOC NAV ---
  const handleTocClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      setActiveId(targetId);
      isManualScrolling.current = true;

      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - HEADER_OFFSET;

      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo({ top: offsetPosition, behavior: "auto" });

      requestAnimationFrame(() => {
        isManualScrolling.current = false;
      });
    }
  };

  // --- 3. TOC SCANNER ---
  useEffect(() => {
    if (isTransitioning || isInitialLoading) return;

    let attempts = 0;
    const maxAttempts = 15;

    const scan = () => {
      const headings = Array.from(
        document.querySelectorAll(
          ".markdown-content h2, .markdown-content h3, .markdown-content h4"
        )
      );
      if (headings.length > 0) {
        setTocItems(
          headings.map((h) => ({
            id: h.id,
            title: h.textContent || "",
            level: h.tagName === "H3" ? 2 : h.tagName === "H4" ? 3 : 1,
          }))
        );
        setTocStatus("ready");
      } else {
        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(scan, 100);
        } else {
          setTocStatus("empty");
        }
      }
    };
    scan();
  }, [displayedChallenge, isTransitioning, isInitialLoading]);

  // --- 4. SCROLL SPY ---
  useEffect(() => {
    if (tocStatus !== "ready") return;
    const handleScroll = () => {
      if (isManualScrolling.current) return;
      requestAnimationFrame(() => {
        const scrollTrigger = window.scrollY + 120;
        let currentId = "";
        for (const item of tocItems) {
          const element = document.getElementById(item.id);
          if (element && element.offsetTop <= scrollTrigger)
            currentId = item.id;
          else break;
        }
        if (currentId && currentId !== activeId) setActiveId(currentId);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tocItems, activeId, tocStatus]);

  // --- 5. SIDEBAR SCROLL ---
  useLayoutEffect(() => {
    if (activeChallengeRef.current)
      activeChallengeRef.current.scrollIntoView({
        block: "nearest",
        behavior: "auto",
      });
  }, [slug]);

  if (!displayedChallenge || !displayedCompetition) return notFound();

  const pillAnimationProps = {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
    transition: { duration: 0.2, ease: M3_EASE_STANDARD },
  };

  return (
    <div className="min-h-screen lg:pl-8 transition-all duration-300">
      <div className="fixed inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-10"
            onClick={() => setZoomedImage(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white/70 hover:text-white"
              onClick={() => setZoomedImage(null)}
            >
              <X className="w-8 h-8" />
            </Button>
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={zoomedImage}
              alt="Zoomed"
              className="max-h-full max-w-full rounded-lg shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container max-w-400 mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 relative items-start">
        {/* MAIN CONTENT */}
        <div className="lg:col-span-9 min-w-0 pb-40 min-h-screen">
          <AnimatePresence mode="wait">
            {isInitialLoading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ContentSkeleton />
              </motion.div>
            ) : (
              <motion.div
                key={displayedChallenge.slug}
                // --- FIX: BỎ SCALE UP ---
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: ANIMATION_DURATION,
                  ease: M3_EASE_STANDARD,
                }}
                className="w-full"
              >
                <div className="flex flex-col gap-8 mb-16">
                  <Link href={`/ctf-writeup/${id}`} passHref>
                    <div className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer w-fit active:scale-95 duration-200">
                      <div className="w-8 h-8 rounded-md border border-border bg-background flex items-center justify-center group-hover:border-primary group-hover:text-primary transition-all shadow-sm">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                      </div>
                      <span className="text-sm font-medium">
                        Back to {displayedCompetition.name}
                      </span>
                    </div>
                  </Link>
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
                      <Badge
                        variant="outline"
                        className="rounded-md border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors uppercase"
                      >
                        {displayedCompetition.name}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                      <span className="text-foreground font-semibold">
                        {displayedChallenge.category}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                      <span>{displayedChallenge.slug}</span>
                    </div>
                    <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl text-zinc-100">
                      {displayedChallenge.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{displayedCompetition.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{displayedChallenge.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{displayedChallenge.readTime} read</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono font-bold text-foreground bg-muted px-2 py-0.5 rounded">
                        <Hash className="w-3.5 h-3.5" />
                        {displayedChallenge.points} PTS
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full text-zinc-400 dark:text-zinc-300 text-base font-normal markdown-content">
                  <MemoizedMarkdown
                    content={displayedChallenge.content}
                    onImageClick={(src) => setZoomedImage(src)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 self-start">
          <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
            {/* CONTAINER 1: CHALLENGES */}
            <div
              className={cn(
                "rounded-xl border bg-card/50 backdrop-blur-sm p-4 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden origin-top-right",
                shouldAnimateSidebar && "animate-m3-scale-in"
              )}
            >
              <div className="flex items-center gap-2 font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground shrink-0">
                <List className="w-4 h-4" />
                Challenges
              </div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-1">
                {categoryChallenges.map((chall) => {
                  const isActive = chall.slug === slug;
                  return (
                    <Link
                      key={chall.slug}
                      href={`/ctf-writeup/${id}/${category}/${chall.slug}`}
                      ref={isActive ? activeChallengeRef : null}
                      className="relative block px-3 py-2 text-sm transition-colors rounded-lg group shrink-0 active:scale-95 duration-100"
                      scroll={false}
                    >
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            {...pillAnimationProps}
                            className="absolute inset-0 bg-primary/10 rounded-lg"
                          />
                        )}
                      </AnimatePresence>

                      <div className="relative z-10 flex justify-between items-center">
                        <span
                          className={cn(
                            "font-medium transition-colors line-clamp-1",
                            isActive
                              ? "text-primary font-bold"
                              : "text-muted-foreground group-hover:text-foreground"
                          )}
                        >
                          {chall.title}
                        </span>
                        {isActive && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0 ml-2" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* CONTAINER 2: CONTENTS (TOC) */}
            <div
              className={cn(
                "rounded-xl border bg-card/50 backdrop-blur-sm p-4 shadow-sm flex flex-col h-[35%] shrink-0 min-h-0 overflow-hidden relative origin-bottom-right",
                shouldAnimateSidebar && "animate-m3-scale-in delay-75"
              )}
            >
              <div className="flex items-center gap-2 font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground shrink-0">
                <BookOpen className="w-4 h-4" />
                Contents
              </div>
              <div className="flex-1 relative w-full h-full min-h-0">
                <div className="absolute inset-0 overflow-y-auto pr-2">
                  <AnimatePresence mode="wait">
                    {tocStatus === "loading" && (
                      <motion.div
                        key="toc-loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TocSkeleton />
                      </motion.div>
                    )}

                    {tocStatus === "ready" && (
                      <motion.nav
                        key="toc-list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: M3_EASE_STANDARD }}
                        className="space-y-1"
                      >
                        {tocItems.map((item) => {
                          const isTocActive = activeId === item.id;
                          return (
                            <Link
                              key={item.id}
                              href={`#${item.id}`}
                              onClick={(e) => handleTocClick(e, item.id)}
                              className={cn(
                                "relative block px-3 py-2 text-sm transition-colors rounded-lg group shrink-0 active:scale-95 duration-100",
                                item.level === 2
                                  ? "pl-6"
                                  : item.level === 3
                                  ? "pl-9"
                                  : "pl-3"
                              )}
                            >
                              <AnimatePresence>
                                {isTocActive && (
                                  <motion.div
                                    {...pillAnimationProps}
                                    className="absolute inset-0 bg-primary/10 rounded-lg"
                                  />
                                )}
                              </AnimatePresence>

                              <div className="relative z-10 flex justify-between items-center">
                                <span
                                  className={cn(
                                    "transition-colors line-clamp-1",
                                    isTocActive
                                      ? "text-primary font-bold"
                                      : "text-muted-foreground hover:text-foreground"
                                  )}
                                >
                                  {item.title}
                                </span>
                                {isTocActive && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0 ml-2" />
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </motion.nav>
                    )}

                    {tocStatus === "empty" && (
                      <motion.p
                        key="toc-empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 text-sm text-muted-foreground italic pl-4 py-2"
                      >
                        No headings
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
