"use client";

import {
  Container,
  Typography,
  TextField,
  Box,
  Stack,
  Link as MuiLink,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCookie } from "@/app/utils/cookie.utils";
import { setUser } from "@/app/redux/slice/userSlice";
import {
  useSignUpMutation,
  useLoginMutation,
} from "@/app/redux/reducer/auth.api";
import React, { useEffect } from "react";
import { useSchema } from "./login.config";

// 👇 Unified Form Type
type AuthFormData = {
  name?: string;
  email: string;
  password: string;
};


export default function AuthPage() {
  const [isSignup, setIsSignup] = React.useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();

  const [signup] = useSignUpMutation();
  const [login] = useLoginMutation();

  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<AuthFormData>({
    resolver: yupResolver(useSchema(isSignup)),
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (token && pathname !== "/pages") {
      router.replace("/pages");
    }
  }, [router]);

  const onSubmit = async (data: AuthFormData) => {
    try {
      const response = isSignup
        ? await signup(data).unwrap()
        : await login(data).unwrap();

      if (response.token) {
        setCookie("token", response.token, 365);
        localStorage.setItem("token", response.token);
        dispatch(setUser(response.user));
        reset();
        toast.success(`${isSignup ? "Signup" : "Login"} successful`);
        router.replace("/pages");
      }
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          {isSignup ? "Sign Up" : "Login"}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3, width: "100%" }}
        >
          {isSignup && (
            <TextField
              margin="normal"
              fullWidth
              label="Name"
              autoComplete="name"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
          <TextField
            margin="normal"
            fullWidth
            label="Email Address"
            autoComplete="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            autoComplete="new-password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Stack>
            <LoadingButton
              loading={isSubmitting}
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2, height: 40 }}
            >
              {isSignup ? "Sign Up" : "Login"}
            </LoadingButton>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2">
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <MuiLink
                  component="button"
                  variant="body2"
                  onClick={() => setIsSignup(!isSignup)}
                  sx={{ color: "#1976d2" }}
                >
                  {isSignup ? "Login" : "Sign Up"}
                </MuiLink>
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
