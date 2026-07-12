"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import z from "zod";
import { vehicleFormSchema } from "@/validations/vehicleValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

export default function Vehicle() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof vehicleFormSchema>>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      vehicleType: "",
      vehicleNumber: "",
      vehicleBrand: "",
      vehicleModel: "",
      vehicleColor: "",
    },
  });

  async function onSubmit(values: z.infer<typeof vehicleFormSchema>) {
    try {
      setLoading(true);

      const response = await fetch("/api/captain/vehicle", {
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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen mt-10">
      <h1 className="text-5xl font-bold tracking-tight mx-6">
        Add <span className="text-primary">Vehicle</span>
      </h1>
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center"></div>

        <div className="rounded-3xl border border-zinc-800 bg-[#1c1c1c] p-8 shadow-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="vehicleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Vehicle Type</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder=""
                          className="h-12 rounded-xl border-zinc-700 bg-[#111111]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehicleNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Registration Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder=""
                          className="h-12 rounded-xl border-zinc-700 bg-[#111111] uppercase"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehicleBrand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Vehicle Brand</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder=""
                          className="h-12 rounded-xl border-zinc-700 bg-[#111111]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehicleModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Vehicle Model</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder=""
                          className="h-12 rounded-xl border-zinc-700 bg-[#111111]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehicleColor"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-base">Vehicle Color</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder=""
                          className="h-12 rounded-xl border-zinc-700 bg-[#111111]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition-all"
              >
                {loading ? "Adding Vehicle..." : "Add Vehicle"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
