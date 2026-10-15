import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";

/** Topo + rodapé padrão das páginas de conta. */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <main className="conta-main">{children}</main>
      <SiteFooter />
    </>
  );
}
