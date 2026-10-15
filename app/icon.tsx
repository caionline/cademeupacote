import { ImageResponse } from "next/og";

// Ícone do site (aba do navegador, resultados do Google, tela inicial do celular).
export const size = { width: 48, height: 48 };
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
          fontSize: 30,
        }}
      >
        📦
      </div>
    ),
    size,
  );
}
