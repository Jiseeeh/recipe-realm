import {Box, Button, TextField, Typography} from "@mui/material";
import {useTheme} from "@mui/system";
import {FormEvent, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import toast from "react-hot-toast";

const inputColor = 'f5f5f7';
export default function Hero() {
    const theme = useTheme();
    const router = useRouter();
    const [username, setUsername] = useState<string>("");

    const onSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const res = await axios.post("http://localhost:3001/api/user",{
            username
        })

        if (!res.data.success) {
            toast.error("Something went wrong!");
            return;
        }

        toast.success("Welcome");
        await router.push("/realm");
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
            <Box component="form" noValidate autoComplete="off" sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                gridColumn: {xs: '2/10 span', sm: '2/4 span', md: '1/4 span'}
            }} onSubmit={onSubmit}>
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
                <Button variant="contained" sx={{color: theme.palette.secondary.main}}>Enter</Button>
            </Box>
        </Box>
    </Box>
}