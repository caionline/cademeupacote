import { ImageResponse } from "next/og";

export const alt = "Cadê meu pacote? — Reclamação com força de lei em 3 minutos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FAFAF9 0%, #FFF7ED 100%)",
          fontFamily: "sans-serif",
          padding: "60px",
          gap: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 36 }}>
          <span style={{ fontSize: 88 }}>📦</span>
          <span style={{ fontSize: 56, fontWeight: 700, color: "#1C1917", letterSpacing: "-1px" }}>
            Cadê meu pacote?
          </span>
        </div>

        <div
          style={{
            fontSize: 92,
            fontStyle: "italic",
            fontFamily: "serif",
            color: "#F97316",
            marginBottom: 12,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          A loja não cumpriu?
        </div>

        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#1C1917",
            marginBottom: 52,
            textAlign: "center",
            letterSpacing: "-1px",
          }}
        >
          A gente desamarra.
        </div>

        <div
          style={{
            display: "flex",
            background: "#F97316",
            color: "#fff",
            borderRadius: 40,
            padding: "14px 32px",
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "0.2px",
          }}
        >
          Reclamação com força de lei • Grátis • 3 minutos
        </div>
      </div>
    ),
    { ...size },
  );
}
