import { NextResponse } from "next/server";
import { capturarEmail, entrarWaitlistPro } from "@/lib/db";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const { email, storeId, problemId } = await req.json();

    if (!email || !EMAIL_REGEX.test(String(email))) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    }

    try {
      if (problemId === "pro-waitlist") {
        await entrarWaitlistPro(String(email));
        return NextResponse.json({ ok: true });
      }
      await capturarEmail({
        email:     String(email),
        storeId:   String(storeId ?? "unknown"),
        problemId: String(problemId ?? "unknown"),
      });
    } catch (kvErr) {
      console.error("[KV ERROR] capturarEmail falhou:", kvErr instanceof Error ? kvErr.message : kvErr, kvErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro interno." }, { status: 500 });
  }
}
