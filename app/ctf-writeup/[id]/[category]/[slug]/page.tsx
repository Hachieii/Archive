import { competitionsData } from "@/lib/ctf-data";
import WriteupClient from "./WriteupClient"; // Import component client vừa tách

// 1. HÀM BUILD-TIME (SERVER SIDE)
// Hàm này sẽ báo cho Next.js biết cần tạo sẵn những trang HTML nào
export async function generateStaticParams() {
  const params = [];

  for (const competition of competitionsData) {
    for (const challenge of competition.challenges) {
      params.push({
        id: competition.id,
        category: challenge.category,
        // Lưu ý: Đảm bảo slug/category khớp chính xác với URL
        slug: challenge.slug,
      });
    }
  }

  return params;
}

// 2. TRANG CHÍNH (SERVER COMPONENT)
// File này KHÔNG có "use client"
export default async function Page({
  params,
}: {
  params: Promise<{ id: string; category: string; slug: string }>;
}) {
  // Trong Next.js 15, params là Promise cần await
  const { id, category, slug } = await params;

  // Truyền dữ liệu xuống Client Component để hiển thị
  return <WriteupClient id={id} category={category} slug={slug} />;
}
