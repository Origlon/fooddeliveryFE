"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import StepDots from "../_components/step-dots";

export default function StepTwo({
  register,
  errors,
  handleSubmit,
  onBack,
  onSubmit,
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex min-h-screen">
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="mb-4"
            onClick={onBack}
          >
            <ChevronLeft size={18} />
          </Button>

          <StepDots currentStep={2} />

          <h1 className="text-2xl font-bold">Complete your profile</h1>

          <p className="mt-2 text-sm text-muted-foreground"></p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password"></Label>

              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className={errors.password ? "border-destructive" : ""}
              />

           

              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword"></Label>

              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                className={
                  errors.confirmPassword
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />

              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
             
            </div>
                <div className="flex items-center gap-2">
                <Checkbox
                  id="show-password"
                  checked={showPassword}
                  onCheckedChange={(checked) =>
                    setShowPassword(checked === true)
                  }
                />

                <Label htmlFor="show-password" className="font-normal">
                  Show password
                </Label>
              </div>
        

            <Button type="submit" className="h-10 w-full">
              Lets go
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#6C5CE7] hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden w-1/2 p-4 lg:block">
        <div className="relative h-full w-full overflow-hidden rounded-xl">
          <Image src="/login.png" alt="Sign up" fill className="object-cover" />
        </div>
      </div>
    </div>
  );
}
