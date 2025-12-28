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

// LIB
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { gruvboxDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// --- UTILS ---
const waitNextFrame = () =>
  new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });

const waitScroll = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// --- GLOBAL STATE TRACKER ---
// Biến này nằm ngoài component để giữ giá trị xuyên suốt quá trình điều hướng client-side
// Nó sẽ reset về false khi người dùng F5 (refresh cứng) trang.
let hasPlayedSidebarAnimation = false;

// --- SKELETONS ---
const TocSkeleton = () => (
  <div className="w-full px-1 space-y-1">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div
        key={i}
        className={cn(
          "relative py-2 border-l-2 -ml-px flex items-center border-zinc-200/20 dark:border-zinc-800/50",
          i % 3 === 0 ? "pl-6" : "pl-3"
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
  </div>
);

const ContentSkeleton = () => (
  <div className="w-full space-y-8 mt-4 animate-pulse">
    <div className="space-y-4 mb-16">
      <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
      <div className="space-y-2">
        <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-10 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
      </div>
      <div className="flex gap-4 pt-2">
        <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
      </div>
    </div>
    <hr className="border-zinc-100 dark:border-zinc-800" />
    <div className="space-y-12">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="space-y-4">
          <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-[95%] bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-[90%] bg-zinc-200 dark:bg-zinc-800 rounded" />
          {i % 2 === 0 ? (
            <div className="h-48 w-full bg-zinc-200/50 dark:bg-zinc-800/50 rounded-xl mt-6 border border-border/50" />
          ) : (
            <div className="h-64 w-full bg-zinc-200/30 dark:bg-zinc-800/30 rounded-xl mt-6" />
          )}
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
          className="h-6 w-6 text-[#a89984] hover:text-[#ebdbb2] hover:bg-white/10 active:animate-m3-press transition-colors"
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
  }) => {
    return (
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
                  className="relative rounded bg-zinc-800 px-[0.4rem] py-[0.2rem] font-mono text-sm font-medium text-zinc-300 border border-zinc-700 wrap-break-word whitespace-pre-wrap box-decoration-clone"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            img: ({ node, ...props }) => (
              <div
                className="group relative my-8 w-full cursor-pointer rounded-xl border border-border/50 shadow-md overflow-hidden"
                style={{ minHeight: "200px" }}
                onClick={() => props.src && onImageClick(String(props.src))}
              >
                <img
                  className="w-full object-cover transition-transform duration-500 ease-m3-emphasized group-hover:scale-[1.02]"
                  loading="lazy"
                  {...props}
                  alt={props.alt || ""}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors duration-500 ease-m3-emphasized">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 drop-shadow-md" />
                </div>
              </div>
            ),
            h1: ({ node, ...props }) => (
              <h2
                id={props.id}
                className="scroll-mt-32 border-b border-zinc-800 pb-2 text-3xl font-bold tracking-tight mt-10 mb-6 text-zinc-200"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h3
                id={props.id}
                className="scroll-mt-32 text-2xl font-bold tracking-tight mt-8 mb-4 text-zinc-200"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h4
                id={props.id}
                className="scroll-mt-32 text-xl font-semibold tracking-tight mt-6 mb-3 text-zinc-200"
                {...props}
              />
            ),
            p: ({ node, ...props }) => (
              <div className="leading-7 not-first:mt-6" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul
                className="my-6 ml-6 list-disc marker:text-primary"
                {...props}
              />
            ),
            ol: ({ node, ...props }) => (
              <ol
                className="my-6 ml-6 list-decimal marker:font-bold"
                {...props}
              />
            ),
            li: ({ node, ...props }) => <li className="mt-2" {...props} />,
            a: ({ node, ...props }) => (
              <a
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
                {...props}
              />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="mt-6 border-l-4 border-primary/50 bg-muted/30 pl-6 py-2 italic text-muted-foreground rounded-r-lg"
                {...props}
              />
            ),
            hr: ({ node, ...props }) => (
              <hr className="my-8 border-zinc-800" {...props} />
            ),
            strong: ({ node, ...props }) => (
              <strong className="font-semibold text-zinc-200" {...props} />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  },
  (prev, next) => prev.content === next.content
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
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [isSkeletonRemoved, setIsSkeletonRemoved] = useState(false);
  const [tocStatus, setTocStatus] = useState<"loading" | "ready" | "empty">(
    "loading"
  );
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const competition = competitionsData.find((c) => c.id === id);
  const challenge = competition?.challenges.find((c) => c.slug === slug);
  const categoryChallenges = useMemo(
    () =>
      competition?.challenges.filter(
        (c) => c.category.toLowerCase() === category.toLowerCase()
      ) || [],
    [competition, category]
  );
  const activeChallengeRef = useRef<HTMLAnchorElement>(null);

  // --- LOGIC ANIMATION SIDEBAR ---
  // Sử dụng useRef để lưu trạng thái "có nên animate không" cho component instance hiện tại.
  // Nếu hasPlayedSidebarAnimation đã là true (từ lần load trước), biến này sẽ là false.
  const shouldAnimateSidebar = useRef(!hasPlayedSidebarAnimation).current;

  useEffect(() => {
    // Ngay sau khi mount lần đầu tiên, đánh dấu là đã animate.
    // Các lần mount sau (do đổi slug) sẽ đọc được giá trị true và không animate nữa.
    hasPlayedSidebarAnimation = true;
  }, []);
  // ------------------------------

  // 1. SCROLL SIDEBAR
  useLayoutEffect(() => {
    if (activeChallengeRef.current)
      activeChallengeRef.current.scrollIntoView({
        block: "nearest",
        behavior: "auto",
      });
  }, [slug]);

  // 2. LOADING & RENDER CONTROLLER
  useEffect(() => {
    let isMounted = true;
    const renderSequence = async () => {
      setIsContentLoading(true);
      setIsSkeletonRemoved(false);
      setTocStatus("loading");
      setTocItems([]);
      window.scrollTo({ top: 0, behavior: "smooth" });
      await waitScroll(300);
      if (!isMounted) return;
      setIsContentLoading(false);
      await waitNextFrame();
      if (!isMounted) return;
      setIsSkeletonRemoved(true);
    };
    renderSequence();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  // 3. SCAN TOC
  useEffect(() => {
    if (isContentLoading) return;
    const scan = () => {
      const article = document.querySelector(".markdown-content");
      if (!article) return;
      const headings = Array.from(article.querySelectorAll("h2, h3, h4"));
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
        setTocStatus("empty");
      }
    };
    requestAnimationFrame(scan);
  }, [isContentLoading, slug]);

  // 4. SCROLL SPY
  useEffect(() => {
    if (tocStatus !== "ready") return;
    const handleScroll = () => {
      requestAnimationFrame(() => {
        const scrollTrigger = window.scrollY + 150;
        let currentId = "";
        for (const item of tocItems) {
          const element = document.getElementById(item.id);
          if (element && element.offsetTop <= scrollTrigger)
            currentId = item.id;
          else break;
        }
        if (currentId) setActiveId(currentId);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tocStatus, tocItems]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomedImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleTocClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!competition || !challenge) return notFound();

  return (
    <div className="min-h-screen scroll-smooth lg:pl-32 transition-all duration-300">
      <div className="fixed inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.05, 0.7, 0.1, 1] }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-10"
            onClick={() => setZoomedImage(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white/70 hover:text-white active:animate-m3-press"
              onClick={() => setZoomedImage(null)}
            >
              <X className="w-8 h-8" />
            </Button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.05, 0.7, 0.1, 1] }}
              src={zoomedImage}
              alt="Zoomed"
              className="max-h-full max-w-full rounded-lg shadow-2xl object-contain cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container max-w-400 mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 relative items-start">
        {/* MAIN CONTENT */}
        <div className="lg:col-span-9 min-w-0 pb-40 min-h-screen">
          <div className="grid grid-cols-1 grid-rows-1">
            <div
              className={cn(
                "col-start-1 row-start-1 w-full transition-opacity duration-500 ease-m3-emphasized pointer-events-none",
                isContentLoading ? "opacity-100 z-10" : "opacity-0",
                isSkeletonRemoved && "hidden"
              )}
            >
              <ContentSkeleton />
            </div>
            {!isContentLoading && (
              <div
                key={slug}
                className="col-start-1 row-start-1 w-full z-20 animate-m3-fade-in"
              >
                <div className="flex flex-col gap-8 mb-16">
                  <Link href={`/ctf-writeup/${id}`} passHref>
                    <div className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer w-fit active:animate-m3-press">
                      <div className="w-8 h-8 rounded-md border border-border bg-background flex items-center justify-center group-hover:border-primary group-hover:text-primary transition-all shadow-sm">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform ease-m3-decelerate" />
                      </div>
                      <span className="text-sm font-medium">
                        Back to {competition.name}
                      </span>
                    </div>
                  </Link>
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
                      <Badge
                        variant="outline"
                        className="rounded-md border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors uppercase"
                      >
                        {competition.name}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                      <span className="text-foreground font-semibold">
                        {challenge.category}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                      <span>{challenge.slug}</span>
                    </div>
                    <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl text-zinc-100">
                      {challenge.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{competition.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{challenge.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{challenge.readTime} read</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono font-bold text-foreground bg-muted px-2 py-0.5 rounded">
                        <Hash className="w-3.5 h-3.5" />
                        {challenge.points} PTS
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full text-zinc-400 dark:text-zinc-300 text-base font-normal markdown-content">
                  <MemoizedMarkdown
                    content={challenge.content}
                    onImageClick={(src) => setZoomedImage(src)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 self-start">
          <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
            {/* CONTAINER 1: CHALLENGES LIST */}
            <div
              className={cn(
                "rounded-xl border bg-card/50 backdrop-blur-sm p-4 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden origin-top-right",
                // CHỈ ANIMATE NẾU LÀ LẦN ĐẦU
                shouldAnimateSidebar && "animate-m3-scale-in"
              )}
            >
              <div className="flex items-center gap-2 font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground shrink-0">
                <List className="w-4 h-4" />
                {category} Challenges
              </div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-1 [scrollbar-gutter:stable] [scrollbar-width:thin] [scrollbar-color:var(--border)_transparent]">
                {categoryChallenges.map((chall) => {
                  const isActive = chall.slug === slug;
                  return (
                    <Link
                      key={chall.slug}
                      href={`/ctf-writeup/${id}/${category}/${chall.slug}`}
                      ref={isActive ? activeChallengeRef : null}
                      className="relative block px-3 py-2 text-sm transition-colors rounded-lg group shrink-0 active:animate-m3-press"
                      scroll={false}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 bg-primary/10 rounded-lg"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
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

            {/* CONTAINER 2: TABLE OF CONTENTS */}
            <div
              className={cn(
                "rounded-xl border bg-card/50 backdrop-blur-sm p-4 shadow-sm flex flex-col h-[35%] shrink-0 min-h-0 overflow-hidden relative origin-bottom-right",
                // CHỈ ANIMATE NẾU LÀ LẦN ĐẦU (có delay)
                shouldAnimateSidebar && "animate-m3-scale-in delay-75"
              )}
            >
              <div className="flex items-center gap-2 font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground shrink-0">
                <BookOpen className="w-4 h-4" />
                Contents
              </div>
              <div className="flex-1 relative w-full h-full min-h-0">
                <div
                  className={cn(
                    "absolute inset-0 overflow-y-auto pr-2 [scrollbar-gutter:stable] transition-opacity duration-300",
                    tocStatus === "loading"
                      ? "opacity-100 z-10"
                      : "opacity-0 pointer-events-none"
                  )}
                >
                  <TocSkeleton />
                </div>
                <div
                  className={cn(
                    "absolute inset-0 overflow-y-auto pr-2 [scrollbar-gutter:stable] transition-opacity duration-300",
                    tocStatus === "ready" ? "opacity-100 z-20" : "opacity-0"
                  )}
                >
                  <nav className="space-y-1">
                    {tocItems.map((item) => (
                      <Link
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => handleTocClick(e, item.id)}
                        className={cn(
                          "block text-sm transition-all duration-200 relative py-2 border-l-2 -ml-px shrink-0 active:animate-m3-press",
                          item.level === 2
                            ? "pl-6"
                            : item.level === 3
                            ? "pl-10"
                            : "pl-3",
                          activeId === item.id
                            ? "text-primary font-bold border-primary bg-primary/5"
                            : "text-muted-foreground hover:text-foreground border-transparent hover:border-border"
                        )}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </nav>
                </div>
                <div
                  className={cn(
                    "absolute inset-0 transition-opacity duration-300",
                    tocStatus === "empty"
                      ? "opacity-100 z-20"
                      : "opacity-0 pointer-events-none"
                  )}
                >
                  <p className="text-sm text-muted-foreground italic pl-4 py-2">
                    No headings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
