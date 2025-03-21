
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function Footer({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn('w-full border-t py-6 md:py-10', className)}>
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:items-start md:gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <span className="inline-block w-6 h-6 bg-primary rounded-md"></span>
            <span className="text-lg font-semibold">CropSage</span>
          </Link>
          <p className="text-sm text-muted-foreground text-center md:text-left">
            Intelligent agricultural monitoring and prediction system.
          </p>
        </div>
        
        <nav className="flex flex-wrap justify-center gap-6 text-sm md:gap-8">
          <Link to="/" className="font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/dashboard" className="font-medium transition-colors hover:text-primary">
            Dashboard
          </Link>
          <Link to="/input" className="font-medium transition-colors hover:text-primary">
            Input Data
          </Link>
          <Link to="/predictions" className="font-medium transition-colors hover:text-primary">
            Predictions
          </Link>
        </nav>
        
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} CropSage. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
