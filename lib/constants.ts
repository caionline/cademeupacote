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

export type Store = {
  id: string;
  name: string;
  emoji: string;
  sacUrl: string | null;
};

export const STORES: Store[] = [
  { id: "shein",        name: "Shein",             emoji: "👗", sacUrl: "https://br.shein.com/contact-us.html" },
  { id: "shopee",       name: "Shopee",            emoji: "🛒", sacUrl: "https://help.shopee.com.br/portal/4/article/78354" },
  { id: "amazon",       name: "Amazon",            emoji: "📦", sacUrl: "https://www.amazon.com.br/gp/help/customer/contact-us" },
  { id: "magalu",       name: "Magalu",            emoji: "🏪", sacUrl: "https://www.magazineluiza.com.br/central-de-atendimento/" },
  { id: "mercadolivre", name: "Mercado Livre",     emoji: "🛍️", sacUrl: "https://www.mercadolivre.com.br/ajuda" },
  { id: "aliexpress",   name: "AliExpress",        emoji: "🧧", sacUrl: "https://helppage.aliexpress.com/contactus.htm" },
  { id: "casasbahia",   name: "Casas Bahia",       emoji: "📱", sacUrl: "https://www.casasbahia.com.br/atendimento" },
  { id: "renner",       name: "Renner",            emoji: "👕", sacUrl: "https://www.lojasrenner.com.br/atendimento" },
  { id: "cea",          name: "C&A",               emoji: "👖", sacUrl: "https://www.cea.com.br/atendimento" },
  { id: "americanas",   name: "Americanas",        emoji: "🏠", sacUrl: "https://www.americanas.com.br/hotsite/atendimento-ao-cliente" },
  { id: "submarino",    name: "Submarino",         emoji: "🌐", sacUrl: "https://www.submarino.com.br/sac/index.asp" },
  { id: "tokstok",      name: "Tok&Stok",          emoji: "🛏️", sacUrl: "https://www.tokstok.com.br/atendimento-ao-cliente" },
  { id: "mobly",        name: "Mobly",             emoji: "🛋️", sacUrl: "https://www.mobly.com.br/atendimento/" },
  { id: "sephora",      name: "Sephora",           emoji: "💄", sacUrl: "https://www.sephora.com.br/atendimento-ao-cliente" },
  { id: "drogariasp",   name: "Drogaria São Paulo", emoji: "💊", sacUrl: "https://www.drogariasaopaulo.com.br/atendimento" },
  { id: "centauro",     name: "Centauro",          emoji: "🥾", sacUrl: "https://www.centauro.com.br/atendimento" },
  { id: "netshoes",     name: "Netshoes",          emoji: "⚽", sacUrl: "https://atendimento.netshoes.com.br/" },
  { id: "saraiva",      name: "Saraiva",           emoji: "📚", sacUrl: "https://www.saraiva.com.br/atendimento" },
  { id: "kabum",        name: "Kabum",             emoji: "🎮", sacUrl: "https://www.kabum.com.br/atendimento-ao-cliente" },
  { id: "dell",         name: "Dell",              emoji: "💻", sacUrl: "https://www.dell.com/support/contents/pt-br/category/contact-information" },
  { id: "samsung",      name: "Samsung",           emoji: "🖥️", sacUrl: "https://www.samsung.com/br/info/contactus/" },
  { id: "apple",        name: "Apple",             emoji: "🍎", sacUrl: "https://support.apple.com/pt-br/contact" },
  { id: "other",        name: "Outra loja",        emoji: "🏬", sacUrl: null },
];

export type Channel = "whatsapp" | "reclameaqui" | "consumidor";

export const CHANNELS: Record<Channel, { name: string; description: string; icon: string }> = {
  whatsapp:    { name: "SAC da loja", description: "Tom direto. Curto e firme.", icon: "💬" },
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
