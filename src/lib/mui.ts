import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: "#FC6D33",
        },
        secondary: {
            main: "#FFDBCC",
        },
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    color: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#fff"
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#fff"
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#fff"
                    },
                },
            }
        },
    }
});

export default theme;
