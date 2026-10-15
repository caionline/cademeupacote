import { ImageResponse } from "next/og";

// Ícone do site (aba do navegador, resultados do Google, tela inicial do celular).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F97316",
          borderRadius: "22%",
          fontSize: 110,
        }}
      >
        📦
      </div>
    ),
    size,
  );
}
