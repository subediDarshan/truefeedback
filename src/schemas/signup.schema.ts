import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, { message: "Username must be atleast of 2 characters" })
  .max(20, { message: "Username must be no more than 20 characters" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username must not contain special characters",
  });

export const signupSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
