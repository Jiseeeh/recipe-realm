import { Box, Button, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/system";
import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

import Head from "@/components/Head";

const inputColor = "f5f5f7";

interface HeroProps {
  authType: "Login" | "Sign up";
}

export default function Hero({ authType }: HeroProps) {
  const theme = useTheme();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onLogin = async () => {
    const toastId = toast.loading("Checking");

    const res = await axios.get(
      `${process.env.API}/user?username=${username}&password=${password}`
    );

    toast.dismiss(toastId);

    if (!res.data.success) {
      toast.error("Something went wrong!");
      return;
    }

    const user = {
      id: res.data.id,
      username: res.data.username,
      isAdmin: !!res.data.result.is_admin,
    };

    localStorage.setItem("user", JSON.stringify(user));
    toast.success("Welcome");
    router.push("/realm");
  };
  const onSignUp = async () => {
    const toastId = toast.loading("Signing you up");

    const res = await axios.post(
      `${process.env.API}/user?username=${username}&password=${password}`
    );

    toast.dismiss(toastId);

    if (!res.data.success) {
      toast.error(res.data.message);
      return;
    }

    toast.success(res.data.message);
    router.push("/");
  };
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // prevent spamming
    if (isSubmitting) return;

    setIsSubmitting(true);

    if (!username && !password) {
      toast.error("Please do not leave empty fields");
      return;
    }

    if (authType === "Login") onLogin();
    else onSignUp();
  };

  useEffect(() => {
    if (localStorage.getItem("user") !== null) router.push("/realm");
  }, [router]);

  return (
    <>
      <Head />
      <Box
        sx={{
          minHeight: "100vh",
          background: 'url("/sushi-med.jpg")',
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          marginLeft: { xs: "-600px", sm: "-300px", md: "0" },
        }}
      >
        <Box
          sx={{
            minHeight: "100vh",
            marginLeft: { xs: "600px", sm: "300px", md: "0" },
            backdropFilter: "brightness(40%)",
            display: "grid",
            placeItems: "center",
            gridTemplateColumns: "repeat(12,1fr)",
          }}
        >
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              gridColumn: { xs: "2/10 span", sm: "2/4 span", md: "1/4 span" },
            }}
            onSubmit={onSubmit}
          >
            <Typography variant="h3" color="#f5f5f7">
              {authType === "Login" ? "Welcome!" : "Sign up"}
            </Typography>
            <Typography variant="body1" color="#f5f5f7">
              {authType === "Login"
                ? "Login to your account"
                : "Choose a unique username!"}
            </Typography>
            <TextField
              label="Username"
              InputLabelProps={{ sx: { color: `#${inputColor}` } }}
              sx={{
                // Changes TextField label color
                "& .MuiFormLabel-root": {
                  color: `#${inputColor}`,
                },
                "& .MuiFormLabel-root.Mui-focused": {
                  color: `#${inputColor}`,
                },
                input: { color: `#${inputColor}` },
              }}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <TextField
              label="Password"
              InputLabelProps={{ sx: { color: `#${inputColor}` } }}
              sx={{
                // Changes TextField label color
                "& .MuiFormLabel-root": {
                  color: `#${inputColor}`,
                },
                "& .MuiFormLabel-root.Mui-focused": {
                  color: `#${inputColor}`,
                },
                input: { color: `#${inputColor}` },
              }}
              value={password}
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            {authType === "Login" ? (
              <Button
                variant="contained"
                type="submit"
                sx={{ color: theme.palette.secondary.main }}
              >
                Login
              </Button>
            ) : (
              <Button
                variant="contained"
                type="submit"
                sx={{ color: theme.palette.secondary.main }}
              >
                Sign up
              </Button>
            )}
            {authType === "Login" ? (
              <Typography sx={{ color: `#${inputColor}` }} variant="body1">
                Don&apos;t have an account?{" "}
                <Link
                  href="/sign-up"
                  style={{ color: `${theme.palette.primary.main}` }}
                >
                  Create one
                </Link>
              </Typography>
            ) : (
              <Typography sx={{ color: `#${inputColor}` }} variant="body1">
                Already have an account?{" "}
                <Link
                  href="/"
                  style={{ color: `${theme.palette.primary.main}` }}
                >
                  Login
                </Link>
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
