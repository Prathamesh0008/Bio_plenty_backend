// Import Zod
const { z } = require("zod");

// Define the Zod schema for user signup
const userSignupSchema = z.object({
  name: z.string()
    .trim()
    .min(3, { message: "Name is required" })
    .max(100, { message: "Name should not exceed 100 characters" }),
  email: z.string()
    .email({ message: "Invalid email address" }),
  password: z.string()
    .min(4, { message: "Password must be at least 4 characters long" })
    .regex(/[A-Z]/, { message: "Password must include at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must include at least one lowercase letter" })
    .regex(/\d/, { message: "Password must include at least one number" })
    .regex(/[@$!%*?&#]/, { message: "Password must include at least one special character" })
});

module.exports = {
  userSignupSchema,
};
