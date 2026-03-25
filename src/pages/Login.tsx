import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Library, Github, Mail } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 1000);
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Library className="mr-2 h-6 w-6" />
          LibAdmin System
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This library management system has transformed how we handle our physical collection and student engagement. It's efficient, modern, and incredibly easy to use.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis, Head Librarian</footer>
          </blockquote>
        </div>
      </div>
      <div className="p-4 lg:p-8 h-full flex items-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Login to your account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password to access the dashboard
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
              <div className="grid grid-cols-2 gap-6">
                <Button variant="outline">
                  <Github className="mr-2 h-4 w-4" />
                  Github
                </Button>
                <Button variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <form onSubmit={onSubmit}>
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <Label className="sr-only" htmlFor="email">
                      Email
                    </Label>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading}
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
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <Button disabled={isLoading}>
                    {isLoading && (
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
            <CardFooter className="flex flex-col gap-2">
              <div className="text-sm text-muted-foreground text-center">
                Don't have an account?{" "}
                <Link to="/register" className="underline underline-offset-4 hover:text-primary">
                  Register
                </Link>
              </div>
              <div className="text-xs text-center text-muted-foreground">
                <Link to="/portal" className="underline underline-offset-4 hover:text-primary">
                  Switch to Student Portal
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
