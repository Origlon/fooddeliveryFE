"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { server } from "@/app/_api/api";

import StepOne from "./_features/step-one";
import StepTwo from "./_features/step-two";

const signupSchema = z
  .object({
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

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignupPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  const nextStep = async () => {
    const isValid = await trigger("email");

    if (!isValid) return;

    setServerError("");
    setStep(2);
  };

  const onSubmit = async (data) => {
    setServerError("");

    const { confirmPassword, ...signupData } = data;

    try {
      await server.post("/auth/sign-up", signupData);

      router.push("/login");
    } catch (error) {
      setServerError(
        error.response?.data?.message || "Signup failed. Please try again.",
      );
    }
  };

  return (
    <>
      {serverError && (
        <p role="alert" className="px-6 pt-4 text-center text-sm text-red-500">
          {serverError}
        </p>
      )}

      {step === 1 && (
        <StepOne register={register} errors={errors} onNext={nextStep} />
      )}

      {step === 2 && (
        <StepTwo
          register={register}
          errors={errors}
          handleSubmit={handleSubmit}
          onBack={() => {
            setServerError("");
            setStep(1);
          }}
          onSubmit={onSubmit}
        />
      )}
    </>
  );
}
