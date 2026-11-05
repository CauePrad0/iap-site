import type { Stat } from '../config/site';
import { formatStat } from '../lib/format';
import { useLang } from '../lib/content';

/** Caixa com números de destaque (impacto ou financeiros) */
export default function StatsBox({ title, stats }: { title: string; stats: Stat[] }) {
  const lang = useLang();
  return (
    <section aria-labelledby="stats-title" className="card relative overflow-hidden px-5 py-8 sm:px-10">
      <h2 id="stats-title" className="text-center text-3xl">
        {title}
      </h2>
      <dl className={`mt-6 grid grid-cols-2 gap-6 ${stats.length >= 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
        {stats.map((s, i) => (
          <div key={i} className="flex flex-col-reverse items-center text-center max-md:last:odd:col-span-2">
            <dt className="mt-1 text-base leading-snug text-ink-soft">{s.label[lang]}</dt>
            <dd className="font-serif text-4xl font-bold text-sage-dark sm:text-5xl">{formatStat(s, lang)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
