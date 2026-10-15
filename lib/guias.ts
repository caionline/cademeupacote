// Guias de SEO: respostas diretas para as dúvidas mais buscadas de quem comprou online.
// Cuidado jurídico: citar o CDC com precisão, não prometer resultado, não é assessoria jurídica.

export type Secao = { titulo: string; paragrafos?: string[]; lista?: string[] };

export type Guia = {
  slug: string;
  titulo: string;          // H1
  tituloSeo: string;       // <title>
  descricao: string;       // meta description
  resumo: string;          // resposta direta, logo no topo
  secoes: Secao[];
  faq: { p: string; r: string }[];
  cta: { problema?: string; loja?: string; texto: string };
  lojaRelacionada?: string;
  atualizado: string;      // AAAA-MM-DD
};

export const GUIAS: Guia[] = [
  {
    slug: "como-reclamar-da-shopee",
    titulo: "Como reclamar da Shopee: pedido que não chegou, reembolso e vendedor sumido",
    tituloSeo: "Como reclamar da Shopee (passo a passo com o CDC) | Cadê Meu Pacote",
    descricao: "Pedido da Shopee não chegou, veio errado ou o reembolso não caiu? Veja a ordem certa pra reclamar: app, Reclame Aqui, Consumidor.gov e Juizado.",
    resumo: "Comece pelo próprio app da Shopee, antes de confirmar o recebimento: abra uma solicitação de devolução/reembolso no pedido e guarde o número. Se não resolver, suba o tom no Reclame Aqui e depois no Consumidor.gov.br. A Shopee faz parte da cadeia de venda, então você pode cobrar dela e não só do vendedor.",
    secoes: [
      {
        titulo: "1. Não confirme o recebimento se o pedido não chegou",
        paragrafos: [
          "Enquanto o pedido não é confirmado como recebido, o dinheiro costuma ficar retido pela plataforma. Confirmar o recebimento de um pacote que não chegou atrapalha a sua reclamação.",
        ],
      },
      {
        titulo: "2. Abra a solicitação no app",
        lista: [
          "Em \"Meus pedidos\", abra o pedido e procure a opção de devolução ou reembolso.",
          "Explique o problema em poucas linhas e anexe prints (rastreio, anúncio, conversa com o vendedor).",
          "Anote o número da solicitação e a data. Isso é a sua prova de que tentou resolver.",
        ],
      },
      {
        titulo: "3. Se a Shopee não resolver: Reclame Aqui e Consumidor.gov",
        paragrafos: [
          "Grandes plataformas acompanham de perto a reputação no Reclame Aqui e costumam responder rápido por lá. Se mesmo assim não houver solução, registre no Consumidor.gov.br (a empresa tem 10 dias para responder) ou no Procon do seu estado.",
          "O Código de Defesa do Consumidor diz que todos os que participam da cadeia de fornecimento respondem pelos danos ao consumidor (art. 7º, parágrafo único, e art. 25, § 1º). Por isso faz sentido incluir a Shopee na reclamação, e não só o vendedor.",
        ],
      },
      {
        titulo: "O que pedir",
        lista: [
          "Pedido não chegou: entrega do produto ou devolução integral do valor (CDC, art. 35).",
          "Produto errado ou com defeito: troca ou devolução do valor (CDC, arts. 18 e 35).",
          "Reembolso aprovado e não pago: devolução imediata, corrigida.",
        ],
      },
    ],
    faq: [
      { p: "A Shopee é responsável se o problema foi do vendedor?", r: "O CDC prevê responsabilidade de todos que participam da cadeia de fornecimento. Na prática, a plataforma costuma ser incluída nas reclamações e, muitas vezes, é ela quem resolve." },
      { p: "Quanto tempo a Shopee tem para responder no Consumidor.gov?", r: "Pelas regras da plataforma do governo, a empresa tem até 10 dias para responder à reclamação." },
      { p: "Posso ir direto ao Juizado?", r: "Pode, mas ter tentado resolver antes (com protocolos) fortalece o seu caso. Em causas de até 20 salários mínimos você pode entrar sem advogado." },
    ],
    cta: { problema: "lost", loja: "shopee", texto: "Gerar minha reclamação contra a Shopee" },
    lojaRelacionada: "shopee",
    atualizado: "2026-10-15",
  },
  {
    slug: "mercado-livre-compra-nao-chegou",
    titulo: "Compra do Mercado Livre não chegou: o que fazer",
    tituloSeo: "Compra do Mercado Livre não chegou? Veja como resolver | Cadê Meu Pacote",
    descricao: "Passou o prazo e a compra do Mercado Livre não chegou? Veja como abrir a reclamação no próprio site, quando escalar e quais direitos o CDC garante.",
    resumo: "Abra uma reclamação na própria página da compra, em \"Tive um problema\", e guarde o número. Se o prazo de entrega passou, você pode exigir a entrega ou o dinheiro de volta (CDC, art. 35). Sem solução, leve ao Reclame Aqui e ao Consumidor.gov.br.",
    secoes: [
      {
        titulo: "1. Confira o rastreio e o prazo",
        paragrafos: ["Veja na página da compra qual era a data prometida. Se ela já passou, você está diante de um descumprimento de oferta: o prazo anunciado faz parte do que foi vendido (CDC, art. 30)."],
      },
      {
        titulo: "2. Reclame na página da compra",
        lista: [
          "Entre em \"Minhas compras\", abra o pedido e escolha a opção de problema com a entrega.",
          "Descreva o que aconteceu com datas e anexe prints do rastreio.",
          "Guarde o número da reclamação. Se o vendedor não resolver, peça a mediação do Mercado Livre.",
        ],
      },
      {
        titulo: "3. Seus direitos",
        paragrafos: [
          "Com o prazo descumprido, o CDC (art. 35) deixa você escolher: exigir a entrega, aceitar um produto equivalente ou cancelar com devolução integral do valor pago, corrigido.",
          "A loja responde pela entrega, inclusive quando a falha é da transportadora que ela escolheu.",
        ],
      },
      {
        titulo: "4. Se não resolver",
        lista: [
          "Reclame Aqui: reclamação pública, que pesa na reputação.",
          "Consumidor.gov.br: a empresa tem 10 dias para responder.",
          "Procon do seu estado: pode notificar a loja, marcar conciliação e aplicar multa.",
          "Juizado Especial Cível: sem custas na 1ª instância e, até 20 salários mínimos, sem advogado.",
        ],
      },
    ],
    faq: [
      { p: "Quanto tempo esperar antes de reclamar?", r: "Assim que o prazo prometido vencer você já pode reclamar. Não precisa esperar semanas." },
      { p: "O rastreio diz entregue, mas não recebi. E agora?", r: "Peça a comprovação da entrega (quem recebeu e onde). Cabe à loja provar que entregou. Abra a reclamação na compra e guarde os protocolos." },
      { p: "Posso pedir o dinheiro de volta em vez do produto?", r: "Sim. Com o prazo descumprido, o art. 35 do CDC permite cancelar e receber de volta o valor pago, corrigido." },
    ],
    cta: { problema: "late", loja: "mercadolivre", texto: "Gerar minha reclamação contra o Mercado Livre" },
    lojaRelacionada: "mercadolivre",
    atualizado: "2026-10-15",
  },
  {
    slug: "shein-pedido-atrasado-ou-taxado",
    titulo: "Shein: pedido atrasado ou taxado na entrega, o que fazer",
    tituloSeo: "Pedido da Shein atrasado ou taxado? Saiba o que fazer | Cadê Meu Pacote",
    descricao: "Pedido da Shein atrasou, travou na alfândega ou veio cobrança de imposto? Veja como reclamar, o que pedir e quando escalar.",
    resumo: "Se o pedido passou do prazo, reclame no atendimento da Shein pedindo entrega ou reembolso (CDC, art. 35). Se a compra foi feita com os impostos já incluídos no checkout e chegou uma nova cobrança na entrega, guarde o comprovante e conteste com a loja antes de pagar de novo.",
    secoes: [
      {
        titulo: "Pedido atrasado",
        lista: [
          "Confira no app a data prevista de entrega.",
          "Abra um chamado no atendimento da Shein e anote o número.",
          "Peça a entrega ou o cancelamento com reembolso integral (CDC, art. 35).",
        ],
      },
      {
        titulo: "Cobrança de imposto na entrega",
        paragrafos: [
          "Em compras internacionais, as regras de importação mudam com frequência. Em muitos casos, os tributos já são cobrados no momento da compra e aparecem no resumo do pedido.",
          "Se você já pagou os impostos no checkout e recebeu outra cobrança, junte o comprovante do pedido (com os tributos destacados) e a cobrança recebida e conteste com a Shein antes de pagar. Se a loja não resolver, use o Reclame Aqui, o Consumidor.gov.br ou o Procon.",
        ],
      },
      {
        titulo: "Pedido parado na alfândega",
        paragrafos: ["Atrasos na fiscalização acontecem, mas o prazo prometido continua valendo para a loja. Passado o prazo, você pode pedir o cancelamento com reembolso."],
      },
    ],
    faq: [
      { p: "A Shein é obrigada a seguir o Código de Defesa do Consumidor?", r: "Sim. Quem vende para consumidores no Brasil, inclusive pela internet, está sujeito ao CDC." },
      { p: "Quanto tempo a Shein tem para devolver o dinheiro?", r: "Em caso de arrependimento (até 7 dias do recebimento), a devolução deve ser imediata (CDC, art. 49). No cartão, o estorno pode levar uma ou duas faturas para aparecer, por causa da operadora." },
      { p: "Vale reclamar no Consumidor.gov?", r: "Vale. Se a loja estiver cadastrada, ela tem 10 dias para responder." },
    ],
    cta: { problema: "late", loja: "shein", texto: "Gerar minha reclamação contra a Shein" },
    lojaRelacionada: "shein",
    atualizado: "2026-10-15",
  },
  {
    slug: "amazon-pedido-entregue-nao-recebi",
    titulo: "Amazon: aparece \"pedido entregue\", mas eu não recebi",
    tituloSeo: "Amazon diz entregue mas não recebi: passo a passo | Cadê Meu Pacote",
    descricao: "O rastreio da Amazon diz que foi entregue, mas o pacote não chegou? Veja o que conferir, como reclamar e o que a lei garante.",
    resumo: "Primeiro confira com vizinhos e portaria e veja se há foto da entrega no pedido. Não achou? Fale com o atendimento da Amazon pedindo a comprovação de quem recebeu, e o reenvio ou o reembolso. Cabe à loja provar que entregou.",
    secoes: [
      {
        titulo: "1. Confira antes de reclamar",
        lista: [
          "Veja no pedido se há foto ou local de entrega informado.",
          "Pergunte na portaria e a vizinhos.",
          "Confira se o endereço do pedido está certo.",
        ],
      },
      {
        titulo: "2. Fale com a Amazon",
        lista: [
          "No pedido, use a opção de problema com a entrega ou o atendimento.",
          "Peça a comprovação da entrega: data, hora, local e nome de quem recebeu.",
          "Peça o reenvio ou o reembolso integral, e anote o protocolo.",
        ],
      },
      {
        titulo: "3. O que diz a lei",
        paragrafos: [
          "A loja responde pela entrega, inclusive pela transportadora. Se a entrega não aconteceu de fato, o consumidor pode exigir o cumprimento ou o dinheiro de volta (CDC, art. 35).",
          "Em relações de consumo, o juiz pode inverter o ônus da prova a favor do consumidor (CDC, art. 6º, VIII). Na prática, quem precisa provar a entrega é a empresa.",
        ],
      },
    ],
    faq: [
      { p: "E se a Amazon disser que a entrega foi feita?", r: "Peça a prova: assinatura, foto ou nome de quem recebeu. Sem isso, siga para o Reclame Aqui e depois para o Consumidor.gov.br ou o Procon." },
      { p: "Preciso fazer boletim de ocorrência?", r: "Não é obrigatório para reclamar com a loja. Pode ajudar se houver suspeita de extravio ou fraude." },
      { p: "Quanto tempo tenho para reclamar?", r: "Reclame o quanto antes. Problemas na entrega podem ser cobrados mesmo depois, mas a rapidez facilita a investigação." },
    ],
    cta: { problema: "lost", loja: "amazon", texto: "Gerar minha reclamação contra a Amazon" },
    lojaRelacionada: "amazon",
    atualizado: "2026-10-15",
  },
  {
    slug: "loja-cancelou-pedido-promocao",
    titulo: "A loja cancelou meu pedido da promoção: tenho direito?",
    tituloSeo: "Loja cancelou pedido da promoção: tenho direito? | Cadê Meu Pacote",
    descricao: "Comprou na promoção e a loja cancelou? Entenda quando a oferta obriga a loja a entregar (CDC, arts. 30 e 35) e quando o erro de preço grosseiro muda o jogo.",
    resumo: "Em regra, sim: a oferta anunciada obriga a loja (CDC, art. 30), e você pode exigir que ela cumpra o pedido pelo preço anunciado (art. 35, I). A exceção é o erro de preço grosseiro, evidente para qualquer pessoa (por exemplo, uma TV de R$ 5.000 por R$ 50): nesses casos a Justiça costuma aceitar o cancelamento.",
    secoes: [
      {
        titulo: "O que diz a lei",
        lista: [
          "A oferta suficientemente precisa obriga o fornecedor (CDC, art. 30).",
          "Se a loja se recusar, o consumidor pode exigir o cumprimento forçado, aceitar produto equivalente ou cancelar com devolução do valor (art. 35).",
          "Recusar venda a quem se dispõe a pagar é prática abusiva (art. 39, II e IX).",
        ],
      },
      {
        titulo: "A exceção: erro grosseiro",
        paragrafos: [
          "Os tribunais costumam proteger a loja quando o preço é absurdamente baixo, a ponto de qualquer pessoa perceber que é um erro. Já descontos agressivos, mas plausíveis (cupom, liquidação, \"bug\" de cupom moderado), costumam ser defendidos com base na oferta.",
          "Seja honesto na avaliação: um caso forte vale o esforço; um erro gritante dificilmente vai prosperar.",
        ],
      },
      {
        titulo: "Como reclamar",
        lista: [
          "Tire print do anúncio, do pedido confirmado e do e-mail de cancelamento.",
          "Peça à loja, por escrito, o cumprimento do pedido pelo preço anunciado.",
          "Sem solução: Reclame Aqui, Consumidor.gov.br ou Procon e, se valer a pena, Juizado Especial.",
        ],
      },
    ],
    faq: [
      { p: "A loja pode cancelar dizendo que o produto ficou indisponível?", r: "Se o produto continua à venda (às vezes por um preço maior), o argumento de indisponibilidade fica fraco. Guarde prints mostrando isso." },
      { p: "Se o dinheiro já foi devolvido, ainda posso reclamar?", r: "Pode. O estorno não impede você de exigir o cumprimento da oferta, mas avalie se vale o esforço no seu caso." },
      { p: "O que é erro grosseiro?", r: "Um preço tão fora da realidade que qualquer consumidor perceberia o engano. Cada caso é analisado individualmente pela Justiça." },
    ],
    cta: { problema: "cancelled", texto: "Gerar minha reclamação de pedido cancelado" },
    atualizado: "2026-10-15",
  },
  {
    slug: "estorno-nao-caiu-prazo",
    titulo: "Estorno não caiu: qual o prazo e como cobrar",
    tituloSeo: "Estorno não caiu? Prazo e como cobrar a loja | Cadê Meu Pacote",
    descricao: "Cancelou a compra e o estorno não apareceu? Veja o que diz o CDC, por que no cartão pode demorar uma fatura e como cobrar a loja.",
    resumo: "Quando você desiste da compra online em até 7 dias, a devolução deve ser imediata e corrigida (CDC, art. 49, parágrafo único). No cartão de crédito, o crédito pode aparecer só na fatura seguinte por causa do ciclo da operadora. Se passou disso, cobre a loja com o protocolo do cancelamento.",
    secoes: [
      {
        titulo: "Prazos na prática",
        lista: [
          "Pix ou débito: a devolução costuma ser rápida. Dias de espera sem explicação já justificam cobrar.",
          "Cartão de crédito: o estorno pode aparecer na fatura atual ou na próxima, dependendo da data de fechamento.",
          "Passou de duas faturas sem estorno? Algo está errado: cobre a loja e fale com o banco.",
        ],
      },
      {
        titulo: "Como cobrar",
        lista: [
          "Peça à loja o comprovante do estorno (com o código ou a data de processamento).",
          "Com o comprovante, pergunte ao banco ou à operadora onde está o crédito.",
          "Sem solução, registre no Consumidor.gov.br e no Procon. No cartão, você também pode pedir a contestação da compra ao banco.",
        ],
      },
    ],
    faq: [
      { p: "A loja pode me dar crédito na loja em vez de dinheiro?", r: "No arrependimento (art. 49) e quando a loja descumpre a oferta (art. 35, III), você tem direito à devolução do valor pago. Vale-crédito só se você aceitar." },
      { p: "O frete também volta?", r: "No direito de arrependimento, a devolução abrange os valores pagos, incluindo o frete." },
      { p: "Posso pedir correção monetária?", r: "Sim, o CDC fala em devolução monetariamente atualizada." },
    ],
    cta: { problema: "refund", texto: "Gerar minha reclamação de estorno" },
    atualizado: "2026-10-15",
  },
  {
    slug: "produto-com-defeito-troca-conserto-ou-dinheiro",
    titulo: "Produto chegou com defeito: troca, conserto ou dinheiro de volta?",
    tituloSeo: "Produto com defeito: troca ou dinheiro de volta? (CDC art. 18) | Cadê Meu Pacote",
    descricao: "Comprou e veio com defeito? Entenda o prazo de 30 dias para a loja resolver (CDC, art. 18), quando pode pedir troca ou dinheiro e o prazo para reclamar.",
    resumo: "A loja tem até 30 dias para resolver o defeito (CDC, art. 18, § 1º). Se não resolver nesse prazo, você escolhe: troca por outro produto, dinheiro de volta corrigido ou abatimento no preço. Atenção ao prazo para reclamar: 30 dias para produtos não duráveis e 90 dias para duráveis (art. 26).",
    secoes: [
      {
        titulo: "Os prazos que importam",
        lista: [
          "Para a loja consertar: até 30 dias (art. 18, § 1º).",
          "Para você reclamar de um defeito aparente: 30 dias (não duráveis, como alimentos) ou 90 dias (duráveis, como eletrônicos), a partir do recebimento (art. 26).",
          "A reclamação formal comprovada suspende esse prazo até a resposta da loja (art. 26, § 2º). Por isso, guarde os protocolos.",
        ],
      },
      {
        titulo: "Quando pode pedir troca ou dinheiro na hora",
        paragrafos: [
          "Se o conserto puder comprometer a qualidade do produto, diminuir o valor dele ou se for um produto essencial, você pode exigir a solução de imediato, sem esperar os 30 dias (art. 18, § 3º).",
        ],
      },
      {
        titulo: "Passo a passo",
        lista: [
          "Fotografe e filme o defeito.",
          "Reclame com a loja por escrito e anote o protocolo e a data.",
          "Se em 30 dias não houver solução, exija troca, devolução ou abatimento, à sua escolha.",
        ],
      },
    ],
    faq: [
      { p: "A loja pode me mandar falar com o fabricante?", r: "A loja e o fabricante respondem juntos pelo defeito (art. 18). Você pode cobrar de qualquer um deles." },
      { p: "O prazo de garantia do fabricante substitui o do CDC?", r: "Não. A garantia do fabricante é complementar e se soma à garantia legal." },
      { p: "Chegou quebrado no transporte. Vale o mesmo?", r: "Sim. Produto entregue danificado tem vício e você pode exigir a solução da loja." },
    ],
    cta: { problema: "broken", texto: "Gerar minha reclamação de produto com defeito" },
    atualizado: "2026-10-15",
  },
  {
    slug: "direito-de-arrependimento-7-dias",
    titulo: "Direito de arrependimento: 7 dias para devolver compra online",
    tituloSeo: "Direito de arrependimento: 7 dias para devolver (CDC art. 49) | Cadê Meu Pacote",
    descricao: "Comprou pela internet e se arrependeu? Pelo CDC, você tem 7 dias a partir do recebimento para desistir e receber o dinheiro de volta, sem justificar.",
    resumo: "Em compras feitas fora da loja física (internet, telefone, app), você pode desistir em até 7 dias a partir do recebimento do produto ou da contratação, sem precisar explicar o motivo (CDC, art. 49). A loja deve devolver tudo o que você pagou, de imediato e corrigido.",
    secoes: [
      {
        titulo: "Como funciona",
        lista: [
          "O prazo de 7 dias começa a contar do recebimento do produto (ou da assinatura do serviço).",
          "Não precisa justificar nem o produto precisa ter defeito.",
          "A devolução inclui o valor pago, frete incluído, de imediato e corrigido.",
        ],
      },
      {
        titulo: "Como pedir",
        lista: [
          "Avise a loja por escrito dentro dos 7 dias (e-mail, chat ou formulário) e guarde o comprovante.",
          "Siga as instruções de devolução. O custo de devolver o produto não deve ficar com você.",
          "Se a loja dificultar, registre no Consumidor.gov.br ou no Procon.",
        ],
      },
    ],
    faq: [
      { p: "Vale para compras em marketplace?", r: "Sim, vale para compras feitas pela internet em geral." },
      { p: "Posso desistir de produto em promoção?", r: "Sim. O direito de arrependimento não depende do preço." },
      { p: "E se eu já usei o produto?", r: "O direito existe para você conhecer o produto. Uso normal para testar é esperado; mau uso pode gerar discussão." },
    ],
    cta: { problema: "refund", texto: "Gerar minha reclamação de arrependimento" },
    atualizado: "2026-10-15",
  },
  {
    slug: "como-reclamar-no-consumidor-gov",
    titulo: "Como fazer uma reclamação no Consumidor.gov.br",
    tituloSeo: "Como reclamar no Consumidor.gov.br (passo a passo) | Cadê Meu Pacote",
    descricao: "Passo a passo para registrar reclamação no Consumidor.gov.br, o site do governo onde a empresa tem 10 dias para responder. Grátis e online.",
    resumo: "Entre em consumidor.gov.br com a sua conta gov.br, procure a empresa, conte o que aconteceu, diga o que você quer e anexe os documentos. A empresa tem até 10 dias para responder. Depois, você tem um prazo para avaliar a resposta e dizer se o problema foi resolvido.",
    secoes: [
      {
        titulo: "Antes de começar",
        lista: [
          "Tenha uma conta gov.br.",
          "Separe: número do pedido, datas, valor, prints e protocolos do SAC.",
          "Confira se a empresa está cadastrada no site. Se não estiver, use o Procon do seu estado.",
        ],
      },
      {
        titulo: "Passo a passo",
        lista: [
          "Acesse consumidor.gov.br e entre com o gov.br.",
          "Busque a empresa e preencha o formulário da reclamação.",
          "Descreva os fatos em ordem, com datas, e diga claramente o que você quer (entrega, troca, reembolso).",
          "Anexe documentos e envie. Acompanhe a resposta pelo site.",
        ],
      },
      {
        titulo: "Dica",
        paragrafos: ["Um texto objetivo, com datas e base legal, costuma ter resposta melhor. O Cadê Meu Pacote gera esse texto pronto para você colar."],
      },
    ],
    faq: [
      { p: "É de graça?", r: "Sim, o Consumidor.gov.br é um serviço público e gratuito." },
      { p: "Quanto tempo a empresa tem para responder?", r: "Até 10 dias." },
      { p: "E se a empresa não resolver?", r: "Você pode procurar o Procon ou o Juizado Especial Cível. O registro no Consumidor.gov.br serve como prova de que você tentou resolver. Veja também o nosso guia sobre o Procon." },
    ],
    cta: { texto: "Gerar meu texto para o Consumidor.gov" },
    atualizado: "2026-10-15",
  },
  {
    slug: "procon-como-reclamar",
    titulo: "Procon: como reclamar e qual a diferença para o Consumidor.gov",
    tituloSeo: "Como reclamar no Procon (e quando usar o Consumidor.gov) | Cadê Meu Pacote",
    descricao: "Saiba como registrar reclamação no Procon, o que o órgão pode fazer contra a loja e quando é melhor usar o Consumidor.gov.br. Grátis.",
    resumo: "O Procon é o órgão de defesa do consumidor do seu estado ou cidade. A reclamação é grátis e, em muitos lugares, pode ser feita pela internet. O Procon pode notificar a loja, marcar uma audiência de conciliação e aplicar multas. Se a loja estiver cadastrada no Consumidor.gov.br, você pode começar por lá; se não estiver, o Procon é o caminho.",
    secoes: [
      {
        titulo: "Procon ou Consumidor.gov?",
        lista: [
          "Consumidor.gov.br: plataforma federal e online. Você fala direto com a empresa, que tem 10 dias para responder. Só vale para empresas cadastradas.",
          "Procon: órgão estadual ou municipal. Atende reclamações contra qualquer empresa, pode notificar, chamar para conciliação e aplicar sanções administrativas, como multa.",
          "Não precisa escolher para sempre: se um canal não resolver, você pode tentar o outro ou seguir para o Juizado.",
        ],
      },
      {
        titulo: "Como registrar",
        lista: [
          "Procure o site do Procon do seu estado (ou da sua cidade). Muitos têm atendimento online.",
          "Tenha em mãos: documento, CPF, comprovante de endereço, nota fiscal ou comprovante da compra, prints e protocolos do SAC.",
          "Descreva os fatos em ordem, com datas, e diga o que você quer: entrega, troca, conserto ou dinheiro de volta.",
          "Guarde o número da reclamação e acompanhe as respostas.",
        ],
      },
      {
        titulo: "O que esperar",
        paragrafos: [
          "Em geral, o Procon notifica a empresa e pede uma resposta. Dependendo do caso e do órgão, pode marcar uma audiência de conciliação entre você e a loja. Os prazos variam de um Procon para outro.",
          "O Procon não decide indenizações como um juiz. Se você quer reparação por danos, o caminho é o Juizado Especial Cível.",
        ],
      },
    ],
    faq: [
      { p: "Reclamar no Procon custa alguma coisa?", r: "Não. O atendimento do Procon é gratuito." },
      { p: "Posso reclamar no Procon de uma loja de outro estado?", r: "Em geral, sim: o Procon do seu estado atende reclamações de consumidores que moram nele, mesmo contra empresas de fora. Confira as regras do seu Procon." },
      { p: "O Procon pode me dar o dinheiro de volta?", r: "O Procon busca um acordo e pode punir a empresa com multa, mas não condena a pagar indenização. Para isso, use o Juizado Especial Cível." },
    ],
    cta: { texto: "Gerar meu texto para o Procon" },
    atualizado: "2026-10-15",
  },
  {
    slug: "juizado-especial-sem-advogado",
    titulo: "Juizado Especial Cível sem advogado: como funciona",
    tituloSeo: "Juizado Especial sem advogado: como funciona | Cadê Meu Pacote",
    descricao: "Em causas de até 20 salários mínimos você pode entrar no Juizado Especial Cível sem advogado e sem pagar custas na primeira instância. Veja como funciona.",
    resumo: "No Juizado Especial Cível, causas de até 20 salários mínimos podem ser ajuizadas sem advogado (Lei 9.099/95, art. 9º), e não há custas na primeira instância. Entre 20 e 40 salários mínimos, o advogado é obrigatório. O caminho começa com o pedido no Juizado da sua cidade e, em geral, passa por uma audiência de conciliação.",
    secoes: [
      {
        titulo: "Quando vale a pena",
        lista: [
          "Você já tentou resolver (SAC, Reclame Aqui, Consumidor.gov ou Procon) e não teve solução.",
          "O valor em discussão cabe no limite do Juizado.",
          "Você tem provas: pedido, pagamento, prints e protocolos.",
        ],
      },
      {
        titulo: "Como funciona, em linhas gerais",
        lista: [
          "Você apresenta o pedido no Juizado (presencialmente ou pelo sistema online do tribunal do seu estado).",
          "É marcada uma audiência de conciliação com a empresa.",
          "Sem acordo, o processo segue para julgamento.",
          "Para recorrer de uma sentença, é preciso advogado.",
        ],
      },
      {
        titulo: "O que levar",
        lista: ["Documento com foto e comprovante de endereço.", "Nota fiscal ou comprovante da compra e do pagamento.", "Prints, e-mails e protocolos de todas as tentativas."],
      },
      {
        titulo: "Aviso importante",
        paragrafos: ["Este guia é informativo e não substitui a orientação de um advogado ou da Defensoria Pública. Cada caso é avaliado pelo juiz, e não há garantia de resultado."],
      },
    ],
    faq: [
      { p: "Preciso pagar alguma coisa?", r: "Na primeira instância do Juizado Especial não há custas. Se houver recurso, podem existir despesas e é preciso advogado." },
      { p: "A empresa é obrigada a comparecer?", r: "Se a empresa não comparecer à audiência, pode ser considerada revel, o que costuma favorecer o consumidor." },
      { p: "Posso pedir dano moral?", r: "Pode pedir, mas a concessão depende do caso. Simples aborrecimento nem sempre gera indenização." },
    ],
    cta: { texto: "Começar pela reclamação com a loja" },
    atualizado: "2026-10-15",
  },
];

export function getGuia(slug: string): Guia | undefined {
  return GUIAS.find(g => g.slug === slug);
}
