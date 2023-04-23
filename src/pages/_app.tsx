import type {AppProps} from 'next/app'
import {ThemeProvider} from "@mui/system";
import {CssBaseline} from "@mui/material";
import {Toaster} from "react-hot-toast";

import theme from "@/lib/mui";
import "@/components/loader.css";

export default function App({Component, pageProps}: AppProps) {
    return <>
        <ThemeProvider theme={theme}>
            <Component {...pageProps} />
            <CssBaseline/>
            <Toaster toastOptions={{position: 'bottom-left'}}/>
        </ThemeProvider>
    </>
}
