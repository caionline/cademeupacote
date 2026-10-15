"use client";

import { useEffect } from "react";
import { pixel } from "@/lib/meta";

/** Compra no Pixel da Meta. Mesmo id do evento enviado pelo servidor: a Meta conta uma vez só. */
export default function PixelCompra({ id, valor, plano }: { id: string; valor: number; plano: string }) {
  useEffect(() => {
    pixel("Purchase", { value: valor, currency: "BRL", content_name: plano }, `compra-${id}`);
  }, [id, valor, plano]);
  return null;
}
