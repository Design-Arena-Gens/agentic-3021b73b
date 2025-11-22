"use client";

import { useMemo, useState } from 'react';
import manual from '../content/manual.json';
import Link from 'next/link';

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function SearchBar({ onQuery }) {
  const [q, setQ] = useState('');
  return (
    <div className="search">
      <input
        type="search"
        placeholder="Rechercher dans le manuel..."
        value={q}
        onChange={(e) => {
          const v = e.target.value;
          setQ(v);
          onQuery(v);
        }}
        aria-label="Recherche"
      />
    </div>
  );
}

function TOC({ sections }) {
  return (
    <nav className="toc card p-4 sticky top-6">
      <h2 className="text-slate-200 font-semibold mb-3">Sommaire</h2>
      <ul className="space-y-2 text-sm">
        {sections.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`}>{s.title}</a>
            {s.subsections?.length ? (
              <ul className="mt-2 ml-4 space-y-1 list-disc">
                {s.subsections.map((ss) => (
                  <li key={ss.id}>
                    <a href={`#${ss.id}`}>{ss.title}</a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Section({ section }) {
  return (
    <section id={section.id} className="scroll-mt-28">
      <h2 className="text-2xl font-bold text-white mb-4">{section.title}</h2>
      <div className="container-prose space-y-4">
        {section.content?.map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
        {section.lists?.map((list, idx) => (
          <div key={idx}>
            {list.title ? (
              <h3 className="text-xl font-semibold mt-6 mb-2">{list.title}</h3>
            ) : null}
            <ul>
              {list.items.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
        {section.subsections?.map((ss) => (
          <div key={ss.id} id={ss.id} className="mt-10">
            <h3 className="text-xl font-semibold text-white mb-2">{ss.title}</h3>
            {ss.content?.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
            {ss.lists?.map((list, idx) => (
              <div key={idx}>
                {list.title ? (
                  <h4 className="text-lg font-semibold mt-6 mb-2">{list.title}</h4>
                ) : null}
                <ul>
                  {list.items.map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Page() {
  const [query, setQuery] = useState('');

  const sections = useMemo(() => {
    const base = manual.sections.map((s) => ({
      ...s,
      id: slugify(s.title),
      subsections: (s.subsections || []).map((ss) => ({
        ...ss,
        id: slugify(`${s.title}-${ss.title}`),
      })),
    }));

    if (!query) return base;

    const q = query.trim().toLowerCase();
    const matches = (text) => text?.toLowerCase().includes(q);

    return base
      .map((s) => {
        const contentHit = s.content?.some(matches) || s.lists?.some((l) => l.items.some(matches));
        const filteredSub = s.subsections
          ?.map((ss) => ({
            ...ss,
            content: ss.content?.filter(matches),
            lists: ss.lists?.map((l) => ({ ...l, items: l.items.filter(matches) })).filter((l) => l.items.length > 0),
          }))
          .filter((ss) => ss.content?.length || ss.lists?.length || matches(ss.title));

        if (contentHit || filteredSub?.length || matches(s.title)) {
          return {
            ...s,
            content: s.content?.filter(matches),
            lists: s.lists?.map((l) => ({ ...l, items: l.items.filter(matches) })).filter((l) => l.items.length > 0),
            subsections: filteredSub,
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [query]);

  const toc = useMemo(() => {
    return manual.sections.map((s) => ({
      title: s.title,
      id: slugify(s.title),
      subsections: (s.subsections || []).map((ss) => ({
        title: ss.title,
        id: slugify(`${s.title}-${ss.title}`),
      })),
    }));
  }, []);

  return (
    <main>
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <TOC sections={toc} />
          </aside>
          <div className="lg:col-span-9 space-y-8">
            <div className="card p-4">
              <SearchBar onQuery={setQuery} />
              {query ? (
                <p className="text-sm text-slate-400 mt-2">Filtr? par: "{query}"</p>
              ) : (
                <p className="text-sm text-slate-400 mt-2">Astuce: tapez un mot-cl? (ex: "alerte", "conformit?", "KPI").</p>
              )}
            </div>

            {sections.length === 0 ? (
              <div className="card p-6">
                <p className="text-slate-300">Aucun r?sultat. Essayez un autre terme.</p>
              </div>
            ) : (
              sections.map((section) => (
                <div key={section.id} className="card p-6">
                  <Section section={section} />
                </div>
              ))
            )}

            <div className="card p-6">
              <p className="text-sm text-slate-400">
                Besoin d'une version PDF? Exportez cette page depuis votre navigateur (Imprimer ? Enregistrer en PDF).
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
