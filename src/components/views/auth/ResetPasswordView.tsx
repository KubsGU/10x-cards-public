import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/db/client";

export function ResetPasswordView() {
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
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
      window.location.href = "/auth";
    } catch {
      toast.error("Nie udało się zmienić hasła");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Ustaw nowe hasło</CardTitle>
        </CardHeader>
        <form onSubmit={handlePasswordReset}>
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
