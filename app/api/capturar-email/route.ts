import { NextResponse } from "next/server";
import { capturarEmail } from "@/lib/kv";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const { email, storeId, problemId } = await req.json();

    if (!email || !EMAIL_REGEX.test(String(email))) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    }

    try {
      await capturarEmail({
        email:     String(email),
        storeId:   String(storeId ?? "unknown"),
        problemId: String(problemId ?? "unknown"),
      });
    } catch (kvErr) {
      console.error("KV capturarEmail error:", kvErr);
      // KV not configured — still return ok so user isn't frustrated
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro interno." }, { status: 500 });
  }
}
