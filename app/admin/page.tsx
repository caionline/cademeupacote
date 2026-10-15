import Link from "next/link";
import { notFound } from "next/navigation";
import SiteShell from "@/app/components/SiteShell";
import { carregarPainel, getAdmin } from "@/lib/admin";
import { LIMITE_FUNDADORES, PLANOS, type Plano } from "@/lib/planos";
import { PROBLEMS, STORES } from "@/lib/constants";
import ConcederPro from "./ConcederPro";

export const metadata = { title: "Painel — Cadê Meu Pacote", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const PERIODOS = [1, 7, 30, 90];
const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const pct = (a: number, b: number) => (b > 0 ? `${Math.round((a / b) * 100)}%` : "—");
const dataBR = (iso: string) => new Date(iso).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit" });

const NOME_IA: Record<string, string> = {
  reclamacao: "Reclamações", prints: "Leitura de prints", analise: "Análise de resposta", proximo_texto: "Próximo texto (Pro)",
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ dias?: string }> }) {
  const admin = await getAdmin();
  if (!admin) notFound(); // pra qualquer outra pessoa, a página "não existe"

  const { dias: diasParam } = await searchParams;
  const dias = PERIODOS.includes(Number(diasParam)) ? Number(diasParam) : 30;
  const p = await carregarPainel(dias);
  const maxSerie = Math.max(1, ...p.serie.map(s => s.n));
  const canais = Object.entries(p.funil.porCanal).sort((a, b) => (b[1].resultado_visto ?? 0) - (a[1].resultado_visto ?? 0));

  return (
    <SiteShell>
      <div className="adm">
        <div className="adm-topo">
          <h1 className="conta-h1">Painel</h1>
          <nav className="adm-periodos">
            {PERIODOS.map(d => (
              <Link key={d} href={`/admin?dias=${d}`} className={d === dias ? "ativo" : ""}>{d === 1 ? "Hoje" : `${d} dias`}</Link>
            ))}
          </nav>
        </div>

        {/* Números principais */}
        <div className="adm-cards">
          <div><strong>{p.reclamacoes}</strong><span>reclamações geradas</span></div>
          <div><strong>{p.contasNovas}</strong><span>contas novas</span></div>
          <div><strong>{p.proAtivos}</strong><span>assinantes Pro ativos</span></div>
          <div><strong>{brl(p.receita)}</strong><span>receita ({p.vendas} venda{p.vendas === 1 ? "" : "s"})</span></div>
          <div><strong>{brl(p.iaTotal)}</strong><span>custo de IA</span></div>
          <div><strong>{p.fundadores}/{LIMITE_FUNDADORES}</strong><span>vagas de fundador usadas</span></div>
        </div>

        {/* Reclamações por dia */}
        <section className="adm-sec">
          <h2>Reclamações por dia (30 dias)</h2>
          <div className="adm-grafico" role="img" aria-label="Reclamações geradas por dia">
            {p.serie.map(s => (
              <div key={s.dia} className="adm-barra" title={`${s.dia}: ${s.n}`}>
                <span style={{ height: `${(s.n / maxSerie) * 100}%` }} />
              </div>
            ))}
          </div>
          <div className="adm-grafico-eixo"><span>{p.serie[0]?.dia}</span><span>hoje</span></div>
        </section>

        {/* Funil */}
        <section className="adm-sec">
          <h2>Funil do Pro</h2>
          <div className="adm-funil">
            <div><strong>{p.reclamacoes}</strong><span>reclamações</span></div>
            <div><strong>{p.funil.resultado_visto}</strong><span>viram a oferta</span></div>
            <div><strong>{p.funil.oferta_clicada}</strong><span>clicaram ({pct(p.funil.oferta_clicada, p.funil.resultado_visto)})</span></div>
            <div><strong>{p.funil.oferta_lead}</strong><span>deixaram contato ({pct(p.funil.oferta_lead, p.funil.oferta_clicada)})</span></div>
            <div><strong>{p.vendas}</strong><span>compraram</span></div>
          </div>

          <h3>Por canal de origem</h3>
          {canais.length === 0 ? <p className="adm-vazio">Sem dados no período.</p> : (
            <div className="adm-tabela-wrap">
              <table className="adm-tabela">
                <thead><tr><th>Canal</th><th>Viram oferta</th><th>Clicaram</th><th>Contato</th><th>Conversão</th></tr></thead>
                <tbody>
                  {canais.map(([canal, c]) => (
                    <tr key={canal}>
                      <td>{canal}</td>
                      <td>{c.resultado_visto ?? 0}</td>
                      <td>{c.oferta_clicada ?? 0}</td>
                      <td>{c.oferta_lead ?? 0}</td>
                      <td>{pct(c.oferta_lead ?? 0, c.resultado_visto ?? 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Receita */}
        <section className="adm-sec">
          <h2>Receita no período</h2>
          {Object.keys(p.porPlano).length === 0 ? <p className="adm-vazio">Nenhuma venda no período.</p> : (
            <ul className="adm-lista">
              {Object.entries(p.porPlano).map(([plano, v]) => (
                <li key={plano}><span>{PLANOS[plano as Plano]?.nome ?? plano}</span><span>{v.qtd} × = {brl(v.valor)}</span></li>
              ))}
            </ul>
          )}
          {p.ultimosPag.length > 0 && (
            <>
              <h3>Últimos pagamentos</h3>
              <div className="adm-tabela-wrap">
                <table className="adm-tabela">
                  <thead><tr><th>Data</th><th>E-mail</th><th>Plano</th><th>Valor</th><th>Situação</th></tr></thead>
                  <tbody>
                    {p.ultimosPag.map(pg => (
                      <tr key={pg.id}>
                        <td>{dataBR(pg.created_at)}</td><td>{pg.email}</td><td>{pg.plano}</td>
                        <td>{brl(Number(pg.valor))}</td><td>{pg.status}{pg.metodo ? ` · ${pg.metodo}` : ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          <h3>Pro vencendo em 7 dias ({p.vencendo.length})</h3>
          {p.vencendo.length === 0 ? <p className="adm-vazio">Ninguém.</p> : (
            <ul className="adm-lista">
              {p.vencendo.map(v => <li key={v.id}><span>{v.nome ?? "—"}</span><span>{dataBR(v.pro_ate)}</span></li>)}
            </ul>
          )}
        </section>

        {/* Custo de IA */}
        <section className="adm-sec">
          <h2>Custo de IA no período</h2>
          {Object.keys(p.ia).length === 0 ? <p className="adm-vazio">Nenhuma chamada registrada no período.</p> : (
            <ul className="adm-lista">
              {Object.entries(p.ia).map(([tipo, v]) => (
                <li key={tipo}><span>{NOME_IA[tipo] ?? tipo} · {v.chamadas}×</span><span>{brl(v.reais)} ({brl(v.reais / v.chamadas)} cada)</span></li>
              ))}
              <li className="adm-total"><span>Total</span><span>{brl(p.iaTotal)}</span></li>
            </ul>
          )}
          <p className="adm-nota">Calculado a partir dos tokens reais de cada chamada (Claude Haiku 5.5) com dólar a R$ {Number(process.env.DOLAR_REF || 5.5).toFixed(2)}.</p>
        </section>

        {/* Lojas e problemas */}
        <section className="adm-sec">
          <h2>Lojas mais reclamadas no período</h2>
          {p.ranking.length === 0 ? <p className="adm-vazio">Sem reclamações no período.</p> : (
            <ul className="adm-lista">
              {p.ranking.slice(0, 10).map(r => (
                <li key={r.store_id}>
                  <span>{STORES.find(s => s.id === r.store_id)?.name ?? r.store_id}</span>
                  <span>{Number(r.total)} · {PROBLEMS.find(x => x.id === r.problema_mais_comum)?.title ?? "—"}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Interessados */}
        <section className="adm-sec">
          <h2>Interessados no Pro ({p.interessados.length})</h2>
          {p.interessados.length === 0 ? <p className="adm-vazio">Ninguém no período.</p> : (
            <div className="adm-tabela-wrap">
              <table className="adm-tabela">
                <thead><tr><th>Data</th><th>E-mail</th><th>Plano</th><th>Onde</th><th>Canal</th></tr></thead>
                <tbody>
                  {p.interessados.slice(0, 50).map(i => (
                    <tr key={i.email}><td>{dataBR(i.created_at)}</td><td>{i.email}</td><td>{i.plano ?? "—"}</td><td>{i.origem}</td><td>{i.canal ?? "direto"}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Operação */}
        <section className="adm-sec">
          <h2>Operação</h2>
          <ul className="adm-lista">
            <li><span>Cadastros completos no período</span><span>{p.cadastrosCompletos}</span></li>
            <li><span>Lembretes de 7 dias na fila</span><span>{p.lembretesPendentes}</span></li>
          </ul>
          <h3>Liberar Pro manualmente</h3>
          <p className="adm-nota">Para cortesia, teste ou compensação. Se a pessoa já tiver Pro, os dias se somam.</p>
          <ConcederPro />
        </section>
      </div>
    </SiteShell>
  );
}
