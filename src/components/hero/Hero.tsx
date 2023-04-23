import {Box, Button, FormControl, TextField, Typography} from "@mui/material";
import {useTheme} from "@mui/system";
import {useState} from "react";
import {useRouter} from "next/router";

const inputColor = 'f5f5f7';
export default function Hero() {
    const theme = useTheme();
    const router = useRouter();
    const [username, setUsername] = useState<string>("");

    const onSubmit = () => {
        // TODO: Add logic
        router.push("/realm");
    };
    return <Box sx={{
        minHeight: '100vh',
        background: 'url("/sushi-med.jpg")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        marginLeft: {xs: '-600px', sm: '-300px', md: '0'},
    }}>
        <Box sx={{
            minHeight: '100vh',
            marginLeft: {xs: '600px', sm: '300px', md: '0'},
            backdropFilter: 'brightness(40%)',
            display: 'grid',
            placeItems: 'center',
            gridTemplateColumns: 'repeat(12,1fr)'
        }}>
            <FormControl sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                gridColumn: {xs: '2/10 span', sm: '2/4 span', md: '1/4 span'}
            }}>
                <Typography variant="h3" color="#f5f5f7">Welcome!</Typography>
                <Typography variant="body1" color="#f5f5f7">Choose a username to get started</Typography>
                <TextField label="Username" InputLabelProps={{sx: {color: `#${inputColor}`}}} sx={{
                    // Changes TextField label color
                    "& .MuiFormLabel-root": {
                        color: `#${inputColor}`
                    },
                    "& .MuiFormLabel-root.Mui-focused": {
                        color: `#${inputColor}`
                    },
                    input: {color: `#${inputColor}`}
                }} value={username} onChange={(e) => {
                    setUsername(e.target.value)
                }}/>
                <Button variant="contained" sx={{color: theme.palette.secondary.main}} onClick={onSubmit}>Enter</Button>
            </FormControl>
        </Box>
    </Box>
}