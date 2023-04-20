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
                    color: "#f5f5f7",
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#f5f5f7"
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#f5f5f7"
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#f5f5f7"
                    },
                },
            }
        },
    }
});

export default theme;
