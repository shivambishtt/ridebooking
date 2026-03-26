"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import SplitLayout from "@/components/SplitLayout";
import { signinFormSchema } from "@/validations/formValidation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function SigninForm() {
  const router = useRouter();
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);

  const session = useSession();
  const form = useForm<z.infer<typeof signinFormSchema>>({
    resolver: zodResolver(signinFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleGoogleSignin = async () => {
    await signIn("google");
  };
  const handleGithubSignin = async () => {
    await signIn("github");
  };

  async function onSubmit(values: z.infer<typeof signinFormSchema>) {
    setButtonClicked(true);
    const response = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    if (response?.ok) {
      if (session.data?.user.role === "captain") {
        router.push("/vehicle");
      }
      router.push("/");
    }
    if (response?.error) {
      toast.error(response.error, {
        position: "top-center",
        style: {
          background: "#D50419",
        },
      });
    } else {
      toast.success("Signin successful", {
        position: "top-center",
        style: {
          background: "#418B24",
        },
      });
    }
    setButtonClicked(false);
  }

  return (
    <SplitLayout
      title="Welcome Back"
      description="Sign in to continue booking rides and manage your trips easily."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <div>
            {buttonClicked ? (
              <Button disabled={buttonClicked} className="w-full">
                Loading
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full items-center justify-center"
              >
                Sign In
              </Button>
            )}
          </div>

          <div className="flex justify-center gap-2">
            <Button className="w-20" onClick={handleGoogleSignin}>
              <GoogleIcon />
            </Button>
            <Button className="w-20" onClick={handleGithubSignin}>
              <GitHubIcon />
            </Button>
          </div>
        </form>
      </Form>
    </SplitLayout>
  );
}
