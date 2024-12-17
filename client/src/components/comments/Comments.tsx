"use client";

import { useEffect, useRef, useState } from "react";

export default function Comments({ id }: { id: string }) {
  const [idLocal, setIdLocal] = useState<string>("");
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Chỉ xử lý khi id mới khác với idLocal
    if (id !== idLocal) {
      const element = ref.current;

      if (element) {
        // Xóa script cũ và nội dung trong ref
        while (element.children.length > 0) {
          element.removeChild(element.children[0]);
        }

        // Tạo script mới
        const scriptElement = document.createElement("script");
        scriptElement.src = "https://utteranc.es/client.js";
        scriptElement.async = true;
        scriptElement.crossOrigin = "anonymous";
        scriptElement.setAttribute("theme", "github-light");
        scriptElement.setAttribute("issue-term", "url");
        scriptElement.setAttribute("repo", "vanhieu-2108/ucademy-app");
        scriptElement.setAttribute("async", "true");

        // Gắn script vào ref
        element.appendChild(scriptElement);
      }

      // Cập nhật idLocal để theo dõi id hiện tại
      setIdLocal(id);
    }
  }, [id, idLocal]);

  return (
    <div className="w-full space-y-2">
      <div ref={ref} />
    </div>
  );
}
