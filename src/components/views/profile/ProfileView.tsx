import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/db/client";
import type { User } from "@/types";

export function ProfileView() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUser({
            id: user.id,
            email: user.email || "",
            createdAt: user.created_at || "",
            updatedAt: user.updated_at || "",
          });
        }
      } catch {
        toast.error("Nie udało się pobrać danych użytkownika");
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = "/auth";
    } catch {
      toast.error("Nie udało się wylogować");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      toast.error("Hasła nie są identyczne");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      toast.success("Hasło zostało zmienione");
      e.currentTarget.reset();
    } catch {
      toast.error("Nie udało się zmienić hasła");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profil użytkownika</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Email</Label>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" className="w-full" onClick={handleLogout} disabled={isLoading}>
            {isLoading ? "Wylogowywanie..." : "Wyloguj się"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zmiana hasła</CardTitle>
        </CardHeader>
        <form onSubmit={handlePasswordChange}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nowe hasło</Label>
              <Input id="password" name="password" type="password" required disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Potwierdź nowe hasło</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required disabled={isLoading} />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Zmienianie hasła..." : "Zmień hasło"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
