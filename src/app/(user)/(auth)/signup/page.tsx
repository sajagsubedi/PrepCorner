"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/schemas/signUpSchema";
import { LoaderCircle, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { z } from "zod";
import { ChangeEventHandler, useState } from "react";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Page() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      profilePicture: undefined,
      fullName: "",
      email: "",
      password: "",
    },
  });

  const [profilePictureSrc, setProfilePictureSrc] =
    useState("/assets/user.png");

  const handleProfilePictureUpload: ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("profilePicture", file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProfilePictureSrc(reader.result as string);
      };
    }
  };

  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      const { fullName, email, password, profilePicture } = data;

      const formData = new FormData();
      formData.append("profilePicture", profilePicture);
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("password", password);

      const response = await axios.post<ApiResponse>(
        "/api/auth/signup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message);
      const userData = response.data.data as { _id: string };
      router.replace(`/verify/${userData._id}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError?.response?.data?.message ||
        "There was a problem during signup. Please try again later";
      toast.error(errorMessage);
    }
  };

  return (
    <section className="text-gray-600 body-font px-6 pt-16 flex justify-center">
      <div className="w-full sm:w-[325px] flex flex-col">
        <h2 className=" text-2xl md:text-3xl mb-4 font-bold title-font text-left ">
          Get <span className="text-black">Started</span> with us
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="avatar" className="leading-7 text-sm text-gray-600">
              Profile Picture
            </label>
            <div className="w-full flex justify-center ">
              <div className="bg-gray-50 rounded-full overflow-hidden w-24 h-24 relative">
                <Image
                  src={profilePictureSrc}
                  width={200}
                  height={200}
                  alt={"profilePicture"}
                  className="w-full h-full"
                />
                <div className="absolute w-full h-full top-0 right-0 flex justify-center items-center">
                  <Plus className="text-white absolute" />
                </div>
                <div className="absolute w-full h-full top-0 right-0 flex justify-center items-center bg-gray-600 opacity-20"></div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="absolute z-[99] inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
            {errors.profilePicture && (
              <p className="text-red-500 text-sm">
                {errors.profilePicture.message}
              </p>
            )}
          </div>

          <div className="relative mb-4">
            <label
              htmlFor="fullName"
              className="leading-7 text-sm text-gray-600"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              {...register("fullName")}
              required
              placeholder="John Doe"
              className="w-full bg-white rounded border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}
          </div>

          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              required
              placeholder="johndoe@example.com"
              className="w-full bg-white rounded border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="relative mb-4">
            <label
              htmlFor="password"
              className="leading-7 text-sm text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              required
              placeholder="••••••••"
              className="w-full bg-white rounded border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <LoaderCircle className="animate-spin text-lg" />}
            Signup
          </Button>
        </form>
        <div className="mt-5 flex items-center gap-2 justify-center text-gray-500">
          <hr className="w-[175px] h-[2px] bg-gray-200" />
          or
          <hr className="w-[175px]  h-[2px] bg-gray-200" />
        </div>
        <p className="flex gap-2 justify-end mt-6">
          Already have an account?
          <Link className="text-gray-500 underline" href="/signin">
            Signin
          </Link>
        </p>
      </div>
    </section>
  );
}
