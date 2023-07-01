import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/system";
import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

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
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const handleShowPassword = () => setShowPassword((isShown) => !isShown);
  const handleShowRepeatPassword = () =>
    setShowRepeatPassword((isShown) => !isShown);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const onLogin = async () => {
    const toastId = toast.loading("Checking");

    try {
      const res = await axios.get(
        `${process.env.API}/user?username=${username}&password=${password}`
      );

      const user = {
        id: res.data.result.id,
        username: res.data.result.name,
        isAdmin: !!res.data.result.is_admin,
      };

      toast.success(res.data.message);

      localStorage.setItem("user", JSON.stringify(user));

      router.push("/realm");
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
    } finally {
      toast.dismiss(toastId);
      setIsSubmitting(false);
    }
  };

  const onSignUp = async () => {
    if (password !== repeatPassword) {
      toast.error("Password doesn't match");
      setIsSubmitting(false);
      return;
    }

    const toastId = toast.loading("Signing you up");

    try {
      const res = await axios.post(
        `${process.env.API}/user?username=${username}&password=${password}`
      );

      toast.success(res.data.message);
      router.push("/");
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
    } finally {
      toast.dismiss(toastId);
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // prevent spamming
    if (isSubmitting) return;

    setIsSubmitting(true);

    if (!username || !password) {
      toast.error("Please do not leave empty fields");
      setIsSubmitting(false);
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
          background: 'url("/green-bg.jpg")',
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          marginLeft: { xs: "-600px", sm: "-300px", md: "0" },
        }}
      >
        <Box
          sx={{
            minHeight: "100vh",
            marginLeft: { xs: "600px", sm: "300px", md: "0" },
            backdropFilter: "brightness(60%)",
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
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? (
                        <Visibility color="primary" />
                      ) : (
                        <VisibilityOff color="primary" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            {authType === "Sign up" && (
              <TextField
                label="Repeat Password"
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
                value={repeatPassword}
                type={showRepeatPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleShowRepeatPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showRepeatPassword ? (
                          <Visibility color="primary" />
                        ) : (
                          <VisibilityOff color="primary" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => {
                  setRepeatPassword(e.target.value);
                }}
              />
            )}
            {authType === "Login" ? (
              <Button variant="contained" type="submit" sx={{ color: "#fff" }}>
                Login
              </Button>
            ) : (
              <Button variant="contained" type="submit" sx={{ color: "#fff" }}>
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
