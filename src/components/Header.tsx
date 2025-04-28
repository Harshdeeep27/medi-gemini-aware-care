
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Bell, User } from 'lucide-react';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-primary">MediCare</div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          {user ? (
            <>
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => navigate('/diagnosis')}>
                Diagnosis
              </Button>
              <Button variant="ghost" onClick={() => navigate('/medications')}>
                Medications
              </Button>
              <Bell className="h-5 w-5 mx-2 cursor-pointer text-muted-foreground hover:text-foreground" />
              <div className="relative">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <User className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader className="text-left">
                      <h3 className="mt-2 font-medium">Account</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </SheetHeader>
                    <div className="mt-6 space-y-2">
                      <Button variant="outline" className="w-full" onClick={() => navigate('/profile')}>
                        Profile
                      </Button>
                      <Button variant="outline" className="w-full" onClick={logout}>
                        Sign Out
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/register')}>
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation Hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b p-4 md:hidden">
            {user ? (
              <div className="flex flex-col space-y-2">
                <Button variant="ghost" onClick={() => {
                  navigate('/dashboard');
                  setIsMobileMenuOpen(false);
                }}>
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={() => {
                  navigate('/diagnosis');
                  setIsMobileMenuOpen(false);
                }}>
                  Diagnosis
                </Button>
                <Button variant="ghost" onClick={() => {
                  navigate('/medications');
                  setIsMobileMenuOpen(false);
                }}>
                  Medications
                </Button>
                <Button variant="ghost" onClick={() => {
                  navigate('/profile');
                  setIsMobileMenuOpen(false);
                }}>
                  Profile
                </Button>
                <Button variant="ghost" onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button variant="ghost" onClick={() => {
                  navigate('/login');
                  setIsMobileMenuOpen(false);
                }}>
                  Sign In
                </Button>
                <Button onClick={() => {
                  navigate('/register');
                  setIsMobileMenuOpen(false);
                }}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
