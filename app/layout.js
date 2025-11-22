import './globals.css';

export const metadata = {
  title: 'Manuel de veille m?diatique audiovisuelle',
  description: 'Guide op?rationnel complet pour g?rer un service de veille audiovisuelle',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <div className="min-h-screen">
          <header className="header-gradient text-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 py-6">
              <h1 className="text-2xl md:text-3xl font-semibold">Manuel de veille m?diatique audiovisuelle</h1>
              <p className="text-white/90 mt-1">Cadre op?rationnel, juridique et technique</p>
            </div>
          </header>
          {children}
          <footer className="mt-16 border-t border-slate-800"> 
            <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-slate-400">
              ? {new Date().getFullYear()} ? Manuel de veille audiovisuelle. Tous droits r?serv?s.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
