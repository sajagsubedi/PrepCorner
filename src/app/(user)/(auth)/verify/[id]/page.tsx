"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { Form, FormField } from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifyCodeSchema } from "@/schemas/verifyCodeSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "react-toastify";
import { verifyCodeInfoResponse } from "@/types/ApiResponse";

interface verifyCodeInfoResponse {
  success: boolean;
  data: {
    fullName: string;
    email: string;
  };
}

export default function Page() {
  const router = useRouter();
  const param = useParams<{ id: string }>();
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // Store remaining seconds
  const [isExpired, setIsExpired] = useState(false); // Track if code has expired

  const form = useForm<z.infer<typeof verifyCodeSchema>>({
    resolver: zodResolver(verifyCodeSchema),
  });

  // Fetch verification code expiry time
  useEffect(() => {
    const fetchExpiryTime = async () => {
      try {
        const response = await axios.get<verifyCodeInfoResponse>(
          `/api/auth/verify-code?id=${param.id}`
        );
        const expiryTime = new Date(
          response.data.data.verificationCodeExpiry
        ).getTime();
        const currentTime = Date.now();
        const remainingTime = Math.floor((expiryTime - currentTime) / 1000);

        if (remainingTime > 0) {
          setTimeLeft(remainingTime);
        } else {
          setIsExpired(true);
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(axiosError.message);
        setIsExpired(true);
      }
    };

    fetchExpiryTime();
  }, [param.id]);

  // Countdown timer logic
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          setIsExpired(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format timeLeft into MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const onSubmit = async (data: z.infer<typeof verifyCodeSchema>) => {
    if (isExpired) {
      toast.error("Verification code has expired. Please request a new one.");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await axios.post<ApiResponse>("/api/auth/verify-code", {
        id: param.id,
        verificationCode: data.code,
      });
      toast.success(response.data.message);
      router.replace(`/sign-in`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError?.response?.data?.message ||
        "There was a problem verifying your account. Please try again later.";
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <section className="w-full h-screen flex justify-center py-24">
      <div className="w-[30rem] shadow-2xl rounded py-8 px-6 flex flex-col items-center h-max bg-white">
        <h2 className="text-4xl font-bold text-center mb-2">
          Verify your Account
        </h2>
        <p className="mb-4 text-gray-600 text-center">
          Enter the verification code sent to your email.
        </p>
        {/* Display timer or expiry message */}
        {timeLeft !== null && !isExpired && (
          <p className="mb-4 text-gray-600">
            Time remaining:{" "}
            <span className="font-semibold">{formatTime(timeLeft)}</span>
          </p>
        )}
        {isExpired && (
          <p className="mb-4 text-red-600">
            Verification code has expired.{" "}
            <a href="/resend-code" className="underline">
              Request a new code
            </a>
          </p>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <InputOTP
                  maxLength={6}
                  {...field}
                  name="code"
                  disabled={isExpired}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="h-12 w-12" />
                    <InputOTPSlot index={1} className="h-12 w-12" />
                    <InputOTPSlot index={2} className="h-12 w-12" />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} className="h-12 w-12" />
                    <InputOTPSlot index={4} className="h-12 w-12" />
                    <InputOTPSlot index={5} className="h-12 w-12" />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isExpired || isVerifying}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
