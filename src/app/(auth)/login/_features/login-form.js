"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FieldError from "../_components/field-error";
import { server } from "@/app/_api/api";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
});

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const clearMessages = () => {
    setServerError("");
    setSuccessMessage("");
  };

  const onSubmit = async (data) => {
    clearMessages();

    try {
      const response = await server.post(
        "/auth/login",
        { email: data.email, password: data.password },
      
      );

      if (!response.data?.user?.email) {
        setServerError("Unexpected server response");
        return;
      }

      setSuccessMessage("Email and password verified successfully.");
    } catch (error) {
      const message = error.response?.data?.message;

      if (typeof message === "string") {
        setServerError(message);
      } else if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
        setServerError("Request timed out. Please try again.");
      } else if (error.response) {
        setServerError("Login failed. Please try again.");
      } else {
        setServerError(
          "Cannot connect to the server. Check that the back-end is running.",
        );
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="mb-4"
              aria-label="Go back"
              onClick={() => router.back()}
            >
              <ChevronLeft size={18} />
            </Button>
            <h1 className="text-2xl font-bold">Log in</h1>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Log in to enjoy your favorite meals.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit, clearMessages)}
            onChange={clearMessages}
            className="mt-8 space-y-4"
            noValidate
            aria-busy={isSubmitting}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
              <FieldError message={errors.email?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="pr-10"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.password)}
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:bg-transparent"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              <FieldError message={errors.password?.message} />
            </div>

            {serverError && (
              <p
                role="alert"
                className="text-sm text-red-600 dark:text-red-400"
              >
                {serverError}
              </p>
            )}
            {successMessage && (
              <p
                role="status"
                className="text-sm text-green-700 dark:text-green-400"
              >
                {successMessage}
              </p>
            )}

            <Button
              type="submit"
              className="h-10 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-[#6C5CE7] hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden w-1/2 p-4 lg:block">
        <div className="relative h-full w-full overflow-hidden rounded-xl">
          <Image
            src="/login.png"
            alt="Login"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
