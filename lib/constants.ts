export type Problem = {
  id: string;
  emoji: string;
  title: string;
  sub: string;
  hot?: boolean;
};

export const PROBLEMS: Problem[] = [
  { id: "late",   emoji: "⏰", title: "Meu pedido atrasou",            sub: "Passou do prazo prometido" },
  { id: "lost",   emoji: "📭", title: "Diz entregue, mas não recebi",  sub: "Sumiu no caminho", hot: true },
  { id: "broken", emoji: "💥", title: "Chegou quebrado ou com defeito", sub: "Não dá pra usar" },
  { id: "wrong",  emoji: "🔀", title: "Veio o produto errado",         sub: "Outro modelo, cor ou tamanho" },
  { id: "refund", emoji: "💸", title: "Não devolveram meu dinheiro",   sub: "Cancelei e o estorno não veio" },
  { id: "other",  emoji: "❓", title: "Outro problema",                 sub: "Conto nos detalhes" },
];

export const STORES = [
  { id: "shein",      name: "Shein",          emoji: "👗" },
  { id: "shopee",     name: "Shopee",         emoji: "🛒" },
  { id: "amazon",     name: "Amazon",         emoji: "📦" },
  { id: "magalu",     name: "Magalu",         emoji: "🏪" },
  { id: "mercadolivre", name: "Mercado Livre", emoji: "🛍️" },
  { id: "aliexpress", name: "AliExpress",     emoji: "🧧" },
  { id: "casasbahia", name: "Casas Bahia",    emoji: "📱" },
  { id: "renner",     name: "Renner",         emoji: "👕" },
  { id: "cea",        name: "C&A",            emoji: "👖" },
  { id: "americanas", name: "Americanas",        emoji: "🏠" },
  { id: "submarino",  name: "Submarino",         emoji: "🌐" },
  { id: "tokstok",    name: "Tok&Stok",          emoji: "🛏️" },
  { id: "mobly",      name: "Mobly",             emoji: "🛋️" },
  { id: "sephora",    name: "Sephora",           emoji: "💄" },
  { id: "drogariasp", name: "Drogaria São Paulo", emoji: "💊" },
  { id: "centauro",   name: "Centauro",          emoji: "🥾" },
  { id: "netshoes",   name: "Netshoes",          emoji: "⚽" },
  { id: "saraiva",    name: "Saraiva",           emoji: "📚" },
  { id: "kabum",      name: "Kabum",             emoji: "🎮" },
  { id: "dell",       name: "Dell",              emoji: "💻" },
  { id: "samsung",    name: "Samsung",           emoji: "📱" },
  { id: "apple",      name: "Apple",             emoji: "🍎" },
  { id: "other",      name: "Outra loja",        emoji: "🏬" },
];

export type Channel = "whatsapp" | "reclameaqui" | "consumidor";

export const CHANNELS: Record<Channel, { name: string; description: string; icon: string }> = {
  whatsapp:    { name: "SAC / WhatsApp", description: "Tom direto. Curto e firme.", icon: "💬" },
  reclameaqui: { name: "Reclame Aqui",   description: "Tom público. Pressão social.", icon: "⚠️" },
  consumidor:  { name: "Consumidor.gov", description: "Tom formal. Embasado no CDC.", icon: "🏛️" },
};

export type FormState = {
  problem: string | null;
  store: string | null;
  storeOtherName: string;
  purchaseDate: string;
  promisedDate: string;
  product: string;
  value: string;
  orderNumber: string;
  details: string;
  name: string;
  cpf: string;
  email: string;
};

export const initialFormState: FormState = {
  problem: null,
  store: null,
  storeOtherName: "",
  purchaseDate: "",
  promisedDate: "",
  product: "",
  value: "",
  orderNumber: "",
  details: "",
  name: "",
  cpf: "",
  email: "",
};
