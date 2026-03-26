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
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";

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
    const response = await fetch("/api/auth/captain/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();
    if (!response.ok) {
      toast.error(data.message, {
        position: "top-center",
        style: {
          background: "#D50419",
        },
      });
    } else {
      toast.success(data.message, {
        position: "top-center",
        style: {
          background: "#418B24",
        },
      });
      form.reset();
      router.push("/signin");
    }
  }

  return (
    <SplitLayout
      title="Hey Captain"
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
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} />
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

          <div className="flex justify-center gap-2 mt-1">
            <Button onClick={handleGoogleSignup}>
              <GoogleIcon />
            </Button>
            <Button onClick={handleGithubSignup}>
              <GitHubIcon />
            </Button>
          </div>
          <Button type="submit" className="w-full mt-1 hover:cursor-pointer">
            Create Account
          </Button>
        </form>
      </Form>
    </SplitLayout>
  );
}
