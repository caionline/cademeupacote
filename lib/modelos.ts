// Modelos de reclamação prontos pra copiar (SEO: "modelo de reclamação ...").
// Os textos usam [colchetes] onde a pessoa completa. Base legal citada com precisão; não é assessoria jurídica.

export type Modelo = {
  slug: string;
  titulo: string;      // H1
  tituloSeo: string;   // <title>
  descricao: string;   // meta description
  quando: string;      // quando usar
  modelo: string;      // texto pronto
  dicas: string[];
  faq: { p: string; r: string }[];
  problema?: string;   // id do problema no gerador
  guia?: string;       // slug do guia relacionado
};

export const MODELOS: Modelo[] = [
  {
    slug: "reclamacao-atraso-na-entrega",
    titulo: "Modelo de reclamação por atraso na entrega",
    tituloSeo: "Modelo de reclamação por atraso na entrega (pronto pra copiar) | Cadê Meu Pacote",
    descricao: "Modelo pronto de reclamação para pedido atrasado, com base nos arts. 30 e 35 do CDC. Copie, complete os dados e envie pro SAC, Reclame Aqui ou Consumidor.gov.",
    quando: "Use quando o prazo de entrega informado pela loja já passou e o produto não chegou.",
    modelo: `Olá, [nome da loja].

Meu nome é [seu nome] e fiz a compra do pedido nº [número do pedido], em [data da compra], do produto [nome do produto], no valor de R$ [valor]. O prazo de entrega informado foi [data prometida], que já passou, e até hoje o produto não foi entregue.

O prazo de entrega faz parte da oferta e obriga a loja (art. 30 do Código de Defesa do Consumidor). Diante do descumprimento, o art. 35 do CDC me garante escolher entre exigir a entrega, aceitar um produto equivalente ou cancelar a compra com devolução integral do valor pago, corrigido.

Solicito [a entrega do produto até [nova data] / o cancelamento com reembolso integral de R$ [valor]], com confirmação por escrito, em até 48 horas. Sem solução, registrarei reclamação no Consumidor.gov.br e no Procon.

Atenciosamente,
[seu nome]`,
    dicas: [
      "Tire print do pedido mostrando a data prometida antes que a página mude.",
      "Anote o protocolo de cada contato com a loja.",
      "Diga claramente o que você quer: entrega com nova data ou dinheiro de volta.",
    ],
    faq: [
      { p: "Quanto tempo posso esperar antes de reclamar?", r: "Assim que o prazo informado vencer você já pode reclamar. Não precisa esperar semanas." },
      { p: "A loja pode culpar a transportadora?", r: "Não. A loja responde pela entrega, inclusive pela transportadora que ela escolheu." },
      { p: "Posso pedir o dinheiro de volta em vez do produto?", r: "Sim. Com o prazo descumprido, o art. 35, III, do CDC permite cancelar e receber o valor pago, corrigido." },
    ],
    problema: "late",
    guia: "prazo-de-entrega-o-que-diz-a-lei",
  },
  {
    slug: "reclamacao-produto-nao-entregue",
    titulo: "Modelo de reclamação: consta entregue, mas não recebi",
    tituloSeo: "Modelo de reclamação: pedido consta como entregue, mas não recebi | Cadê Meu Pacote",
    descricao: "Modelo pronto para quando o rastreio diz 'entregue' e o pacote não chegou. Peça a prova da entrega e o reenvio ou reembolso, com base no CDC.",
    quando: "Use quando o rastreio marca o pedido como entregue, mas você não recebeu nada.",
    modelo: `Olá, [nome da loja].

Sou [seu nome], cliente do pedido nº [número do pedido], feito em [data da compra], do produto [nome do produto], no valor de R$ [valor]. O rastreio informa que o pedido foi entregue em [data e hora informadas], mas eu não recebi o produto. [Eu estava no endereço nesse horário / A portaria não recebeu nenhuma encomenda.]

Solicito a comprovação da entrega (data, horário, local e nome de quem recebeu). Cabe ao fornecedor comprovar a entrega, e o CDC permite a inversão do ônus da prova a favor do consumidor (art. 6º, VIII).

Não havendo comprovação, peço [o reenvio do produto / o reembolso integral de R$ [valor]], conforme o art. 35 do CDC, em até 48 horas e com confirmação por escrito.

Atenciosamente,
[seu nome]`,
    dicas: [
      "Antes de reclamar, confira com vizinhos, portaria e a foto de entrega (se houver).",
      "Peça sempre a prova de quem recebeu: é a loja que precisa provar que entregou.",
      "Boletim de ocorrência não é obrigatório, mas ajuda se houver suspeita de fraude.",
    ],
    faq: [
      { p: "Quem tem que provar que o produto foi entregue?", r: "A loja. Em relações de consumo, o juiz pode inverter o ônus da prova a favor do consumidor (CDC, art. 6º, VIII)." },
      { p: "E se a loja mandar uma foto de entrega em outro lugar?", r: "Guarde a foto: ela ajuda a mostrar que a entrega foi feita no endereço errado. Peça o reenvio ou o reembolso." },
      { p: "Posso reclamar no Consumidor.gov ou no Procon?", r: "Sim. Se a loja não resolver, esses são os próximos passos, antes do Juizado Especial." },
    ],
    problema: "lost",
    guia: "amazon-pedido-entregue-nao-recebi",
  },
  {
    slug: "reclamacao-produto-com-defeito",
    titulo: "Modelo de reclamação por produto com defeito",
    tituloSeo: "Modelo de reclamação por produto com defeito (CDC art. 18) | Cadê Meu Pacote",
    descricao: "Modelo pronto para produto com defeito ou quebrado: prazo de 30 dias para conserto (art. 18 do CDC) e, depois, troca, devolução ou abatimento à sua escolha.",
    quando: "Use quando o produto chegou quebrado ou apresentou defeito durante o uso.",
    modelo: `Olá, [nome da loja].

Sou [seu nome] e comprei, em [data da compra], o produto [nome do produto], pedido nº [número do pedido], no valor de R$ [valor]. [Ao receber em [data], / Em [data],] o produto apresentou o seguinte defeito: [descreva o defeito]. Envio fotos/vídeo em anexo.

Pelo art. 18 do Código de Defesa do Consumidor, o fornecedor responde pelo vício do produto e tem até 30 dias para saná-lo. Não sendo resolvido nesse prazo, posso escolher entre a troca por outro produto, a devolução do valor pago, corrigido, ou o abatimento do preço.

Solicito a solução do problema, com as instruções para envio ou coleta do produto sem custo para mim, e a confirmação por escrito com o número de protocolo.

Atenciosamente,
[seu nome]`,
    dicas: [
      "Fotografe e filme o defeito assim que perceber.",
      "Atenção ao prazo pra reclamar: 30 dias para produtos não duráveis e 90 para duráveis (CDC, art. 26).",
      "A reclamação formal comprovada suspende esse prazo. Guarde o protocolo.",
    ],
    faq: [
      { p: "A loja pode me mandar para o fabricante?", r: "A loja e o fabricante respondem juntos pelo defeito (art. 18). Você pode cobrar de qualquer um deles." },
      { p: "Preciso esperar os 30 dias do conserto?", r: "Em regra, sim. Mas se o conserto comprometer a qualidade ou o valor do produto, ou se ele for essencial, você pode exigir a solução imediata (art. 18, § 3º)." },
      { p: "Quem paga o frete de envio para conserto?", r: "Os custos para resolver o defeito são do fornecedor. Peça a coleta ou o envio sem custo." },
    ],
    problema: "broken",
    guia: "produto-com-defeito-troca-conserto-ou-dinheiro",
  },
  {
    slug: "reclamacao-pedido-cancelado",
    titulo: "Modelo de reclamação: a loja cancelou meu pedido",
    tituloSeo: "Modelo de reclamação para pedido cancelado pela loja | Cadê Meu Pacote",
    descricao: "Modelo pronto para exigir o cumprimento da oferta quando a loja cancela o pedido (CDC, arts. 30 e 35). Inclui o aviso sobre erro de preço grosseiro.",
    quando: "Use quando a loja cancelou um pedido já confirmado, por exemplo numa promoção, alegando indisponibilidade ou sem explicar.",
    modelo: `Olá, [nome da loja].

Sou [seu nome] e fiz o pedido nº [número do pedido], em [data da compra], do produto [nome do produto], pelo valor anunciado de R$ [valor]. O pedido foi confirmado e, em [data do cancelamento], foi cancelado pela loja [sem justificativa / com a justificativa de "[motivo informado]"].

A oferta veiculada obriga o fornecedor (art. 30 do Código de Defesa do Consumidor). Diante da recusa em cumpri-la, o art. 35, I, do CDC me garante exigir o cumprimento forçado da oferta, nos termos anunciados.

Solicito o restabelecimento do pedido e a entrega do produto pelo preço anunciado de R$ [valor], com confirmação por escrito em até 48 horas. Sem solução, registrarei reclamação no Consumidor.gov.br e no Procon.

Atenciosamente,
[seu nome]`,
    dicas: [
      "Tire print do anúncio, do pedido confirmado e do e-mail de cancelamento.",
      "Se o produto continua à venda (às vezes mais caro), tire print: isso enfraquece a desculpa de 'indisponível'.",
      "Seja honesto: se o erro de preço era gritante (uma TV de R$ 5.000 por R$ 50), a Justiça costuma aceitar o cancelamento.",
    ],
    faq: [
      { p: "Tenho direito ao produto pelo preço da promoção?", r: "Em regra, sim: a oferta obriga a loja (arts. 30 e 35 do CDC). A exceção é o erro de preço grosseiro, evidente para qualquer pessoa." },
      { p: "O estorno já caiu. Ainda posso reclamar?", r: "Pode. O estorno não impede você de exigir o cumprimento da oferta." },
      { p: "Cancelar pedido é prática abusiva?", r: "Recusar a venda a quem se dispõe a pagar é prática abusiva (CDC, art. 39, II e IX), salvo justificativa legítima." },
    ],
    problema: "cancelled",
    guia: "loja-cancelou-pedido-promocao",
  },
  {
    slug: "reclamacao-estorno-nao-realizado",
    titulo: "Modelo de reclamação: estorno não realizado",
    tituloSeo: "Modelo de reclamação por estorno ou reembolso não realizado | Cadê Meu Pacote",
    descricao: "Modelo pronto para cobrar estorno ou reembolso que não caiu, com base no art. 49 e no art. 35 do CDC. Copie, complete e envie.",
    quando: "Use quando a compra foi cancelada (por você ou pela loja) e o dinheiro não voltou no prazo.",
    modelo: `Olá, [nome da loja].

Sou [seu nome], cliente do pedido nº [número do pedido], do produto [nome do produto], no valor de R$ [valor]. A compra foi cancelada em [data do cancelamento] [por mim, dentro do prazo de arrependimento / pela loja], com protocolo [número, se houver]. Até hoje o valor não foi devolvido [no cartão, após [número] faturas / na conta / no Pix].

A devolução dos valores pagos deve ser imediata e monetariamente atualizada (art. 49, parágrafo único, do Código de Defesa do Consumidor, no caso de arrependimento; art. 35, III, nos demais casos).

Solicito o estorno integral de R$ [valor] e o envio do comprovante do estorno (com data e código de processamento) em até 48 horas.

Atenciosamente,
[seu nome]`,
    dicas: [
      "No cartão, o estorno pode aparecer só na fatura seguinte por causa do ciclo da operadora.",
      "Peça o comprovante do estorno: com ele, o banco consegue localizar o crédito.",
      "Sem solução, você também pode pedir a contestação da compra ao banco do cartão.",
    ],
    faq: [
      { p: "Qual o prazo para o estorno cair?", r: "A lei fala em devolução imediata. No cartão, o crédito pode aparecer na fatura atual ou na próxima, conforme a data de fechamento." },
      { p: "A loja pode me dar vale-compras em vez de dinheiro?", r: "Só se você aceitar. No arrependimento e no descumprimento da oferta, você tem direito ao dinheiro de volta." },
      { p: "O frete também volta?", r: "No direito de arrependimento, a devolução abrange os valores pagos, incluindo o frete." },
    ],
    problema: "refund",
    guia: "estorno-nao-caiu-prazo",
  },
  {
    slug: "reclamacao-produto-errado",
    titulo: "Modelo de reclamação: recebi o produto errado",
    tituloSeo: "Modelo de reclamação por produto errado ou diferente do anunciado | Cadê Meu Pacote",
    descricao: "Modelo pronto para quando chega produto diferente do comprado (modelo, cor, tamanho). Peça a troca ou o dinheiro de volta, com base nos arts. 30, 35 e 18 do CDC.",
    quando: "Use quando o produto entregue é diferente do anunciado: outro modelo, cor, tamanho ou quantidade.",
    modelo: `Olá, [nome da loja].

Sou [seu nome] e comprei, em [data da compra], o produto [produto anunciado], pedido nº [número do pedido], no valor de R$ [valor]. Em [data da entrega], recebi [descreva o que chegou], diferente do que foi anunciado e comprado. Envio fotos em anexo.

A oferta obriga o fornecedor (art. 30 do Código de Defesa do Consumidor) e o produto entregue não corresponde a ela. Pelos arts. 35 e 18 do CDC, posso exigir o produto correto ou a devolução do valor pago.

Solicito [o envio do produto correto / o reembolso integral de R$ [valor]], com a coleta do item errado por conta da loja, e a confirmação por escrito em até 48 horas.

Atenciosamente,
[seu nome]`,
    dicas: [
      "Fotografe a etiqueta, a embalagem e o produto recebido ao lado do anúncio.",
      "Não descarte a embalagem: ela pode ser pedida na devolução.",
      "A coleta ou o frete de devolução do item errado é custo da loja.",
    ],
    faq: [
      { p: "Quem paga o frete para devolver o produto errado?", r: "A loja. O erro foi dela, então o custo da troca ou da devolução não pode ficar com você." },
      { p: "Posso ficar com o produto errado e pedir desconto?", r: "Se o produto tiver valor menor ou não servir ao uso, você pode negociar abatimento. A escolha é sua." },
      { p: "Tenho prazo pra reclamar?", r: "Reclame o quanto antes. Para problemas aparentes, o CDC prevê 30 dias (não duráveis) ou 90 dias (duráveis) a partir do recebimento." },
    ],
    problema: "wrong",
    guia: "produto-errado-o-que-fazer",
  },
  {
    slug: "carta-de-desistencia-arrependimento",
    titulo: "Modelo de pedido de cancelamento por arrependimento (7 dias)",
    tituloSeo: "Modelo de carta de arrependimento de compra online (CDC art. 49) | Cadê Meu Pacote",
    descricao: "Modelo pronto para desistir de uma compra online em até 7 dias do recebimento, sem justificar, com devolução integral do valor (art. 49 do CDC).",
    quando: "Use para desistir de uma compra feita pela internet, app ou telefone, em até 7 dias do recebimento do produto.",
    modelo: `Olá, [nome da loja].

Sou [seu nome] e fiz a compra do pedido nº [número do pedido], do produto [nome do produto], no valor de R$ [valor], recebido em [data do recebimento].

Comunico que desisto da compra, exercendo o direito de arrependimento previsto no art. 49 do Código de Defesa do Consumidor, dentro do prazo de 7 dias contados do recebimento.

Solicito as instruções para a devolução do produto, sem custo para mim, e a devolução imediata e integral dos valores pagos, incluindo o frete, monetariamente atualizados, conforme o parágrafo único do art. 49.

Peço a confirmação deste pedido por escrito, com número de protocolo.

Atenciosamente,
[seu nome]`,
    dicas: [
      "Envie dentro dos 7 dias contados do recebimento e guarde o comprovante do envio.",
      "Não precisa explicar o motivo nem o produto precisa ter defeito.",
      "Use canais escritos (e-mail, chat, formulário) pra ter prova da data.",
    ],
    faq: [
      { p: "Vale para produto em promoção?", r: "Sim. O direito de arrependimento não depende do preço." },
      { p: "Quem paga o frete de devolução?", r: "O custo da devolução não deve ficar com o consumidor no direito de arrependimento." },
      { p: "Conta 7 dias da compra ou da entrega?", r: "Do recebimento do produto (ou da contratação, no caso de serviços)." },
    ],
    problema: "refund",
    guia: "direito-de-arrependimento-7-dias",
  },
];

export function getModelo(slug: string): Modelo | undefined {
  return MODELOS.find(m => m.slug === slug);
}
