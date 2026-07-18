import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { EUserRoles } from "@/api/constants";
import { useLogin } from "@/hooks/api/use-auth";
import pcpsLogo from "@/assets/pcpsLogo.png";

export default function Login() {
  const navigate = useNavigate();
  const [cardId, setCardId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: login, isPending } = useLogin(
    (user) => {
      const role = user.data?.role?.role;
      const isStaff = !!role && role !== EUserRoles.Member && role !== EUserRoles.Faculty;
      navigate(isStaff ? "/" : "/portal", { replace: true });
    },
    (error) => {
      setErrorMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Login failed. Please check your credentials and try again.",
      );
    },
  );

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage(null);
    login({ cardId, password });
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center gap-3 text-lg font-medium">
          <img src={pcpsLogo} alt="PCPS College" className="h-10 w-auto rounded bg-white/90 p-1" />
          PCPS College Library
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This library management system has transformed how we handle our physical collection and student engagement. It's efficient, modern, and incredibly easy to use.&rdquo;
            </p>
            <footer className="text-sm">PCPS College Library</footer>
          </blockquote>
        </div>
      </div>
      <div className="p-4 lg:p-8 h-full flex items-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <img src={pcpsLogo} alt="PCPS College" className="h-14 w-auto mb-2 lg:hidden" />
            <h1 className="text-2xl font-semibold tracking-tight">Login to your account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your library card ID and password to access the library
            </p>
          </div>
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Sign in</CardTitle>
              <CardDescription className="text-center">
                Access the librarian admin or student portal
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={onSubmit}>
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <Label className="sr-only" htmlFor="cardId">
                      Card ID
                    </Label>
                    <Input
                      id="cardId"
                      placeholder="Card ID (e.g. LIB-2024-001)"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="username"
                      autoCorrect="off"
                      value={cardId}
                      onChange={(e) => setCardId(e.target.value)}
                      disabled={isPending}
                      required
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label className="sr-only" htmlFor="password">
                      Password
                    </Label>
                    <Input
                      id="password"
                      placeholder="Password"
                      type="password"
                      autoCapitalize="none"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isPending}
                      required
                    />
                  </div>
                  <Button disabled={isPending}>
                    {isPending && (
                      <svg
                        className="mr-2 h-4 w-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                    )}
                    Sign In
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          <div className="space-y-2 text-center text-sm">
            <p>
              New to the library?{" "}
              <Link to="/enroll" className="font-medium text-primary hover:underline">
                Create an account
              </Link>
            </p>
            <p>
              Just looking?{" "}
              <Link to="/browse" className="font-medium text-primary hover:underline">
                Browse the catalog without signing in
              </Link>
            </p>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Students and staff sign in with their PCPS library card ID. Your
            dashboard is chosen automatically based on your role.
          </p>
        </div>
      </div>
    </div>
  );
}
