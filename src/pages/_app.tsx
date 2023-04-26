import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/system";
import { CssBaseline } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useRouter } from "next/router";

import theme from "@/lib/mui";
import "@/components/loader.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      router.push("/");
    }
  }, [router]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
        <CssBaseline />
        <Toaster toastOptions={{ position: "bottom-left" }} />
      </ThemeProvider>
    </>
  );
}
