import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex flex-col items-center text-center">
        <CreditCard className="h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Porichoy
        </h1>
        <p className="text-muted-foreground">
          Your Digital Business Card Solution
        </p>
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back!</CardTitle>
          <CardDescription>
            Enter your unique User ID to access your Porichoy dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account? This is a demo. <br /> Try User ID:{" "}
        <strong>12345</strong>
      </p>
    </div>
  );
}
