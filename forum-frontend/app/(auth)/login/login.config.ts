// auth.schema.ts
import * as yup from "yup";

// Dynamic schema based on mode
export const useSchema = (isSignup: boolean) => {
  return yup.object().shape({
    ...(isSignup && {
      name: yup.string().required("Name is required"),
    }),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });
};

// Inferred type for both login/signup
export type AuthFormData = yup.InferType<ReturnType<typeof useSchema>>;
