import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Starfield } from "./Starfield";

type Props = {
  children: ReactNode;
  /** When true, the header sits over a transparent hero (e.g. 3D scenes). */
  immersive?: boolean;
};

export function Layout({ children, immersive = false }: Props) {
  return (
    <div className="text-foreground relative min-h-screen">
      <Starfield />
      <Header />
      <main className={immersive ? "" : "pt-24"}>{children}</main>
      <Footer />
    </div>
  );
}
