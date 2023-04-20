import type {AppProps} from 'next/app'
import {ThemeProvider} from "@mui/system";
import {CssBaseline} from "@mui/material";

import theme from "@/lib/mui";

export default function App({Component, pageProps}: AppProps) {
    return <>
        <ThemeProvider theme={theme}>
            <Component {...pageProps} />
            <CssBaseline/>
        </ThemeProvider>
    </>
}
