import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Cover from './pages/Cover';
import Home from './pages/Home';
import History from './pages/History';
import Works from './pages/Works';
import Testimonials from './pages/Testimonials';
import Donate from './pages/Donate';
import NotFound from './pages/NotFound';

// O /admin é carregado só quando acessado (não pesa para o público)
const Admin = lazy(() => import('./pages/Admin'));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout showFooter={false} />}>
          <Route path="/" element={<Cover />} />
        </Route>
        <Route element={<Layout />}>
          <Route path="/inicio" element={<Home />} />
          <Route path="/historia" element={<History />} />
          <Route path="/obras" element={<Works />} />
          <Route path="/depoimentos" element={<Testimonials />} />
          <Route path="/doar" element={<Donate />} />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<p className="p-10 text-center">…</p>}>
                <Admin />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
