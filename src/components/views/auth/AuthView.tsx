import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { LoginUserCommand, RegisterUserCommand } from "@/types";

type AuthMode = "login" | "register" | "forgot-password";

export function AuthView() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: LoginUserCommand = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Nieprawidłowy email lub hasło");

      window.location.href = "/dashboard";
    } catch {
      toast.error("Nie udało się zalogować");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: RegisterUserCommand = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Nie udało się utworzyć konta");

      toast.success("Konto zostało utworzone");
      setMode("login");
    } catch {
      toast.error("Nie udało się utworzyć konta");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Nie udało się zresetować hasła");

      toast.success("Link do resetowania hasła został wysłany na twój email");
      setMode("login");
    } catch {
      toast.error("Nie udało się zresetować hasła");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <AnimatePresence mode="wait">
        {mode === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Logowanie</CardTitle>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="twoj@email.pl"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Hasło</Label>
                    <Input id="password" name="password" type="password" required disabled={isLoading} />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logowanie..." : "Zaloguj się"}
                  </Button>
                  <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                    <button type="button" onClick={() => setMode("forgot-password")} className="hover:text-primary">
                      Zapomniałeś hasła?
                    </button>
                    <button type="button" onClick={() => setMode("register")} className="hover:text-primary">
                      Nie masz konta? Zarejestruj się
                    </button>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        )}

        {mode === "register" && (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Rejestracja</CardTitle>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="twoj@email.pl"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Hasło</Label>
                    <Input id="password" name="password" type="password" required disabled={isLoading} />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Tworzenie konta..." : "Utwórz konto"}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Masz już konto? Zaloguj się
                  </button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        )}

        {mode === "forgot-password" && (
          <motion.div
            key="forgot-password"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Resetowanie hasła</CardTitle>
              </CardHeader>
              <form onSubmit={handleForgotPassword}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="twoj@email.pl"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Wysyłanie..." : "Wyślij link do resetowania"}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Wróć do logowania
                  </button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
