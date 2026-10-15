"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { capturarOrigem } from "@/lib/origem";
import { rastrear } from "@/lib/meta";

/** Em toda página: guarda o canal (?ref= / utm_source) e manda PageView (e ViewContent no /app). */
export default function Rastreio() {
  const pathname = usePathname();

  useEffect(() => {
    capturarOrigem();
    rastrear("PageView");
    if (pathname === "/app") rastrear("ViewContent", { content_name: "assistente" });
  }, [pathname]);

  return null;
}
