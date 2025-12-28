import fs from "fs-extra";
import path from "path";
import matter from "gray-matter";

// CONFIG
const WRITEUP_ROOT = path.resolve(process.cwd(), "WriteUp-CTF");
const PUBLIC_ASSETS_DIR = path.join(process.cwd(), "public/images/writeups");
const OUTPUT_DATA_FILE = path.join(process.cwd(), "lib/ctf-data.ts");

// Helper Types
interface Challenge {
  id: string;
  slug: string;
  title: string;
  category: string;
  author: string;
  points: number;
  difficulty: string;
  readTime: string;
  date: string;
  description: string;
  content: string; // Markdown raw content
  tags: string[];
}

interface Competition {
  id: string;
  name: string;
  date: string;
  description: string;
  bgGradient: string;
  totalPoints: number;
  challenges: Challenge[];
}

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

async function main() {
  console.log("🚀 Starting Writeup Import...");
  await fs.emptyDir(PUBLIC_ASSETS_DIR);

  const competitions: Competition[] = [];

  if (!fs.existsSync(WRITEUP_ROOT)) {
    console.error(`❌ Missing directory: ${WRITEUP_ROOT}`);
    process.exit(1);
  }

  const competitionFolders = fs
    .readdirSync(WRITEUP_ROOT)
    .filter(
      (f) =>
        fs.statSync(path.join(WRITEUP_ROOT, f)).isDirectory() &&
        !f.startsWith(".")
    );

  for (const compFolder of competitionFolders) {
    const compPath = path.join(WRITEUP_ROOT, compFolder);
    let compMeta = {
      name: compFolder.replace(/_/g, " "),
      date: "Unknown",
      description: "",
      bgGradient: "from-zinc-500/20 via-zinc-500/5 to-transparent",
    };

    if (fs.existsSync(path.join(compPath, "meta.json"))) {
      try {
        compMeta = {
          ...compMeta,
          ...fs.readJsonSync(path.join(compPath, "meta.json")),
        };
      } catch (e) {}
    }

    const challenges: Challenge[] = [];
    let totalPoints = 0;

    const categories = fs
      .readdirSync(compPath)
      .filter((f) => fs.statSync(path.join(compPath, f)).isDirectory());

    for (const category of categories) {
      const catPath = path.join(compPath, category);
      const challFolders = fs
        .readdirSync(catPath)
        .filter((f) => fs.statSync(path.join(catPath, f)).isDirectory());

      for (const challFolder of challFolders) {
        const challPath = path.join(catPath, challFolder);
        const readmePath = path.join(challPath, "README.md");

        if (fs.existsSync(readmePath)) {
          const fileContent = fs.readFileSync(readmePath, "utf8");
          const { data: frontmatter, content } = matter(fileContent);

          // Copy Assets
          const assetsSrcPath = path.join(challPath, "assets");
          if (fs.existsSync(assetsSrcPath)) {
            const assetsDestPath = path.join(
              PUBLIC_ASSETS_DIR,
              compFolder,
              category,
              challFolder
            );
            await fs.copy(assetsSrcPath, assetsDestPath);
          }

          // Xử lý Content: Thay thế đường dẫn ảnh
          // Regex này bắt tất cả các dạng: ![](assets/img.png), ![alt](assets/img.png)
          const publicUrlBase = `/images/writeups/${compFolder}/${category}/${challFolder}`;
          // QUAN TRỌNG: Dùng replaceAll hoặc regex với cờ 'g' để thay thế TẤT CẢ ảnh
          const processedContent = content.replace(
            /\]\(assets\//g,
            `](${publicUrlBase}/`
          );

          const challengeData: Challenge = {
            id: frontmatter.id || slugify(challFolder),
            slug: slugify(challFolder),
            title: frontmatter.title || challFolder,
            category: category,
            author: frontmatter.author || "Unknown",
            points: frontmatter.points || 0,
            difficulty: frontmatter.difficulty || "Medium",
            readTime: frontmatter.readTime || "5 min",
            date: frontmatter.date || compMeta.date,
            description:
              frontmatter.description ||
              content.slice(0, 150).replace(/[#*`]/g, "").trim() + "...",
            content: processedContent, // Nội dung FULL, đã fix link ảnh
            tags: frontmatter.tags || [],
          };

          challenges.push(challengeData);
          totalPoints += challengeData.points;
        }
      }
    }

    competitions.push({
      id: slugify(compFolder),
      ...compMeta,
      totalPoints,
      challenges,
    });
  }

  const outputContent = `// AUTO-GENERATED FILE
export const competitionsData = ${JSON.stringify(competitions, null, 2)};`;

  fs.writeFileSync(OUTPUT_DATA_FILE, outputContent);
  console.log(`✅ Success! Data written to ${OUTPUT_DATA_FILE}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
