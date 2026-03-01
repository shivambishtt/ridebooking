import z from "zod";

export const signupFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 8 characters"),
});

export const signinFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 8 characters"),
});
