import { Link } from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Flame, List, Brain, User } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="container flex items-center justify-between h-16 px-4">
        {/* Mobile Navigation */}
        <div className="flex items-center justify-around w-full md:hidden">
          <Link href="/flashcards/generate" className="flex flex-col items-center gap-1">
            <Flame className="h-6 w-6 text-primary" />
            <span className="text-xs">Generuj</span>
          </Link>
          <Link href="/flashcards" className="flex flex-col items-center gap-1">
            <List className="h-6 w-6" />
            <span className="text-xs">Fiszki</span>
          </Link>
          <Link href="/flashcards/practice" className="flex flex-col items-center gap-1">
            <Brain className="h-6 w-6" />
            <span className="text-xs">Nauka</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1">
            <User className="h-6 w-6" />
            <span className="text-xs">Profil</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-xl font-bold text-primary">
            10xCards
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/flashcards/generate" className="flex items-center gap-2">
                <Flame className="h-5 w-5" />
                Generuj
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/flashcards" className="flex items-center gap-2">
                <List className="h-5 w-5" />
                Fiszki
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/flashcards/practice" className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Nauka
              </Link>
            </Button>
          </div>
        </div>

        {/* Desktop Profile Menu */}
        <div className="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/profile">Profil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/auth">Wyloguj</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
