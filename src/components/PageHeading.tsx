import { Divider, FlowerCorner } from './Ornaments';

/** Título de página com ornamentos discretos */
export default function PageHeading({ title, intro }: { title: string; intro?: string }) {
  return (
    <div className="relative mx-auto max-w-3xl px-4 pb-4 pt-10 text-center sm:pt-14">
      <FlowerCorner className="pointer-events-none absolute -left-2 top-2 hidden w-24 opacity-70 sm:block" />
      <FlowerCorner position="top-right" className="pointer-events-none absolute -right-2 top-2 hidden w-24 opacity-70 sm:block" />
      <h1 className="page-title">{title}</h1>
      <Divider className="mt-4" />
      {intro && <p className="mt-5 text-lg text-ink-soft">{intro}</p>}
    </div>
  );
}
