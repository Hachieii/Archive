"use client";

import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Flag } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// --- M3 ANIMATION VARIANTS ---
const M3_EASE_STANDARD: [number, number, number, number] = [0.2, 0.0, 0, 1.0];

const containerVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: M3_EASE_STANDARD,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: M3_EASE_STANDARD },
  },
};

export default function CleanCardNoFloat() {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen w-full bg-background p-4">
        {/* Card Container */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          // Thêm fix vào container chính
          className="w-full flex justify-center transform-gpu [will-change:transform]"
        >
          <Card className="w-full max-w-[60%] bg-card border-2 border-primary/20 rounded-[32px] shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center gap-6 p-8">
              {/* Left Content */}
              <div className="w-full sm:flex-[1.5] space-y-8">
                {/* Header Text Block */}
                <motion.div
                  variants={itemVariants}
                  // Thêm fix vào khối text header
                  className="transform-gpu [will-change:transform]"
                >
                  <div className="font-brand font-bold text-primary text-sm tracking-widest uppercase mb-2">
                    notebook
                  </div>
                  <h2 className="font-brand text-3xl font-bold text-foreground">
                    Hachieii
                  </h2>
                </motion.div>

                {/* Description Text */}
                <motion.p
                  variants={itemVariants}
                  // Thêm fix vào đoạn văn
                  className="text-muted-foreground leading-relaxed transform-gpu [will-change:transform]"
                >
                  I store my university learning notes and CTF writeup here
                </motion.p>

                {/* Buttons Wrapper */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-wrap gap-4 pt-4 justify-center sm:justify-start transform-gpu [will-change:transform]"
                >
                  {/* Button 1 */}
                  <Link
                    href="/ctf-writeup"
                    className={cn(
                      buttonVariants({ variant: "default", size: "default" }),
                      // Thêm fix vào Button Link
                      "group h-12 px-6 rounded-full border border-primary/20 bg-foreground/5 text-primary transition-all duration-500 ease-m3-emphasized hover:bg-primary/20 hover:border-foreground/10 hover:shadow-md active:scale-[0.98] active:shadow-none transform-gpu [will-change:transform]"
                    )}
                  >
                    <div className="mr-2 p-1 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300">
                      <Flag className="w-4 h-4" />
                    </div>
                    <span className="font-semibold tracking-wide">
                      CTF Writeups
                    </span>
                  </Link>

                  {/* Button 2 */}
                  <Link
                    href="/notes"
                    className={cn(
                      buttonVariants({ variant: "default", size: "default" }),
                      // Thêm fix vào Button Link
                      "group h-12 px-6 rounded-full border border-primary/20 bg-foreground/5 text-primary transition-all duration-500 ease-m3-emphasized hover:bg-primary/20 hover:border-foreground/10 hover:shadow-md active:scale-[0.98] active:shadow-none transform-gpu [will-change:transform]"
                    )}
                  >
                    <div className="mr-2 p-1 rounded-full bg-foreground/10 group-hover:bg-foreground/20 transition-colors duration-300">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="font-semibold tracking-wide">
                      Learning Notes
                    </span>
                  </Link>
                </motion.div>
              </div>

              {/* Right Avatar */}
              <motion.div
                variants={itemVariants}
                className="w-full sm:flex-1 flex justify-center self-center"
              >
                {/* Avatar Container: Đã fix lỗi nhảy ảnh và giữ nguyên độ nét */}
                <div className="group flex h-52 w-52 items-center justify-center rounded-full overflow-hidden border border-primary/10 bg-primary/5 text-primary transition-all duration-500 ease-m3-emphasized hover:bg-primary/10 hover:shadow-md transform-gpu [will-change:transform]">
                  <Image
                    src="/images/avatar.png"
                    alt="Hachieii Profile"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
