import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ showFooter = true }: { showFooter?: boolean }) {
  const { pathname, hash } = useLocation();

  // Ao trocar de página, volta ao topo (exceto quando há uma âncora #)
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main id="conteudo" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
