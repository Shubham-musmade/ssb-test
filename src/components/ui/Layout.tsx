import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            SSB Interview Prep
          </Link>
          <nav className="flex gap-6">
            <Link to="/" className="hover:text-primary transition">
              Home
            </Link>
            <Link to="/wat" className="hover:text-primary transition">
              WAT Test
            </Link>
            <Link to="/srt" className="hover:text-primary transition">
              SRT Test
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SSB Interview Preparation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}