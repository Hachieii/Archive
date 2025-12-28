import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Flag } from "lucide-react";

export default function CleanCardNoFloat() {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen w-full bg-background p-4">
        <Card className="w-full max-w-3/5 bg-card border-2 border-primary/20 rounded-[32px] shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-6 p-8">
            <div className="w-full sm:flex-[1.5] space-y-8 animate-m3-fade-in">
              <div>
                <div className="font-brand font-bold text-primary text-sm tracking-widest uppercase mb-2">
                  notebook
                </div>
                <h2 className="font-brand text-3xl font-bold text-foreground">
                  Hachieii
                </h2>
              </div>

              <p className="text-muted-foreground leading-relaxed animate-m3-fade-in delay-100">
                I store my university learning notes and CTF writeup here
              </p>

              <div className="flex flex-wrap gap-4 pt-4 animate-m3-fade-in delay-200 justify-center sm:justify-start">
                <Link href="/ctf-writeup">
                  <Button className="group h-12 px-6 rounded-full border border-primary/20 bg-foreground/5 text-primary transition-all duration-500 ease-m3-emphasized hover:bg-primary/20 hover:border-foreground/10 hover:shadow-md active:scale-[0.98] active:shadow-none">
                    <div className="mr-2 p-1 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300 ease-m3-emphasized">
                      <Flag className="w-4 h-4" />
                    </div>
                    <span className="font-semibold tracking-wide">
                      CTF Writeups
                    </span>
                  </Button>
                </Link>

                <Link href="/notes">
                  <Button className="group h-12 px-6 rounded-full border border-primary/20 bg-foreground/5 text-primary transition-all duration-500 ease-m3-emphasized hover:bg-primary/20 hover:border-foreground/10 hover:shadow-md active:scale-[0.98] active:shadow-none">
                    <div className="mr-2 p-1 rounded-full bg-foreground/10 group-hover:bg-foreground/20 transition-colors duration-300 ease-m3-emphasized">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="font-semibold tracking-wide">
                      Learning Notes
                    </span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="w-full sm:flex-1 flex justify-center self-center animate-m3-scale-in delay-300">
              <div className="group flex h-52 w-52 items-center justify-center rounded-full overflow-hidden border border-primary/10 bg-primary/5 text-primary transition-all duration-500 ease-m3-emphasized hover:bg-primary/10 hover:shadow-md mask-[radial-gradient(white,black)]">
                <Image
                  src="/images/avatar.png"
                  alt="Hachieii Profile"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
