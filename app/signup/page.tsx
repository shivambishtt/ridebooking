"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SplitLayout from "@/components/SplitLayout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signupFormSchema } from "@/validations/formValidation";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import Link from "next/link";

export default function SignupForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
    },
  });

  const handleGoogleSignup = async () => {
    await signIn("google");
  };
  const handleGithubSignup = async () => {
    await signIn("github");
  };

  async function onSubmit(values: z.infer<typeof signupFormSchema>) {
    await fetch("/api/user/signup", {
      method: "POST",
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
      }),
    });
    router.push("/");
  }

  return (
    <SplitLayout
      title="Join RideApp Today"
      description="Create your account and start booking rides instantly."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center gap-2">
            <Button className="w-20" onClick={handleGoogleSignup}>
              <GoogleIcon />
            </Button>
            <Button className="w-20" onClick={handleGithubSignup}>
              <GitHubIcon />
            </Button>
          </div>

          <Button type="submit" className="w-full hover:cursor-pointer">
            Create Account
          </Button>
          <p className="text-sm text-primary text-center mt-4">
            Already have an account?{" "}
            <Link href="/signin">
              <span className="text-white">Signin</span>
            </Link>
          </p>
        </form>
      </Form>
    </SplitLayout>
  );
}
