import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CleanCardNoFloat() {
  return (
    <>
      {/* Chỉ giữ lại hiệu ứng xuất hiện (Pop In Bounce), bỏ Float */}
      <style>{`
        @keyframes popInBounce {
          0% { opacity: 0; transform: scale(0.5); }
          70% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        .animate-pop-in-bounce {
          animation: popInBounce 0.8s cubic-bezier(0.05, 0.7, 0.1, 1.0) both;
        }
      `}</style>

      <div className="flex items-center justify-center min-h-screen w-full bg-background p-4">
        {/* THIẾT KẾ LẠI MÀU NỀN:
            - bg-card: Quay về nền sáng chuẩn của theme để dễ đọc chữ.
            - border-primary/20: Viền xanh nhạt tinh tế.
        */}
        <Card className="w-full max-w-3/5 bg-card border-2 border-primary/20 rounded-[32px] shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-6 p-8">
            {/* === PHẦN TEXT (BÊN TRÁI) === */}
            <div className="w-full sm:flex-[1.5] space-y-4 animate-m3-fade-in">
              <div>
                <div className="font-brand font-bold text-primary text-sm tracking-widest uppercase mb-2">
                  Minimal Design
                </div>
                <h2 className="font-brand text-3xl font-bold text-foreground">
                  Dự án Matcha Clean
                </h2>
              </div>

              <p className="text-muted-foreground leading-relaxed animate-m3-fade-in delay-[100ms]">
                Đã loại bỏ hiệu ứng lơ lửng để logo đứng yên, tạo cảm giác vững
                chãi (Static & Stable). Màu nền được đưa về dạng tối giản, giúp
                tôn lên nội dung chính và logo xanh rêu.
              </p>

              <div className="flex gap-2 flex-wrap pt-2 animate-m3-fade-in delay-200">
                <Badge
                  variant="secondary"
                  className="hover:bg-primary/20 transition-colors"
                >
                  Clean
                </Badge>
                <Badge
                  variant="secondary"
                  className="hover:bg-primary/20 transition-colors"
                >
                  Static
                </Badge>
              </div>
            </div>

            {/* === PHẦN LOGO (BÊN PHẢI) === */}
            {/* animate-pop-in-bounce: Chỉ nảy nhẹ 1 lần lúc mới hiện ra rồi đứng yên */}
            <div className="w-full sm:flex-1 flex justify-center self-center animate-pop-in-bounce delay-300">
              {/* VÒNG TRÒN LOGO:
                  - bg-primary/5: Nền xanh cực nhạt, tạo cảm giác "Matcha loãng".
                  - hover:bg-primary/10: Đậm hơn chút xíu khi di chuột vào.
                  - Đã xóa animate-float.
              */}
              <div className="group flex h-52 w-52 items-center justify-center rounded-full border border-primary/10 bg-primary/5 text-primary transition-all duration-500 ease-m3-emphasized hover:scale-105 hover:bg-primary/10 hover:shadow-md">
                <div className="text-center">
                  {/* Icon to lên một chút */}
                  <div className="text-5xl drop-shadow-sm transition-transform duration-300 ">
                    🐻🍵
                  </div>
                  <div className="font-brand font-bold text-sm mt-3 tracking-wide">
                    Gấu Dev
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
