// Navegador: reduz prints antes de mandar pra IA (lado maior até 1280px, JPEG). Corta custo e tempo.
const LADO_MAX = 1280;

export async function reduzirImagem(arquivo: File): Promise<{ mediaType: "image/jpeg"; base64: string }> {
  const url = URL.createObjectURL(arquivo);
  try {
    const img = await new Promise<HTMLImageElement>((ok, erro) => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = () => erro(new Error("imagem inválida"));
      i.src = url;
    });
    const escala = Math.min(1, LADO_MAX / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * escala);
    canvas.height = Math.round(img.naturalHeight * escala);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return { mediaType: "image/jpeg", base64: canvas.toDataURL("image/jpeg", 0.8).split(",")[1] };
  } finally {
    URL.revokeObjectURL(url);
  }
}
