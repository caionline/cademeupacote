import { NextResponse } from "next/server";
import { concederPro, getAdmin } from "@/lib/admin";

export const runtime = "nodejs";

// Só o admin libera Pro manualmente.
export async function POST(req: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
  const { email, dias } = await req.json().catch(() => ({}));
  const n = Number(dias);
  if (typeof email !== "string" || !email.includes("@") || ![7, 30, 90, 365].includes(n)) {
    return NextResponse.json({ error: "E-mail ou período inválido." }, { status: 400 });
  }
  const r = await concederPro(email, n);
  if (!r.ok) return NextResponse.json({ error: r.erro }, { status: 400 });
  console.log(`[ADMIN] Pro liberado: ${email} +${n} dias`);
  return NextResponse.json({ ate: r.ate });
}
