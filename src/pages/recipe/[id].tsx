import {useEffect, useState} from "react";
import {Box, Button, Chip, Fade, Modal, TextField, Typography,Tooltip} from "@mui/material";
import {useTheme} from "@mui/system";
import {useRouter} from "next/router";
import { toast } from "react-hot-toast";
import axios from "axios";

import Sidebar from "@/components/sidebar/Sidebar";
import Loader from "@/components/loader/Loader";
import Head from "@/components/Head";
import IRecipe from "@/types/recipe";
import modalStyle from "@/constants/modalStyle";

export default function Recipe() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [privateId, setPrivateId] = useState("");
    const [recipe, setRecipe] = useState<IRecipe | null>(null);
    const theme = useTheme();
    const router = useRouter();

    const handleModalOpen = () => {
        setIsModalOpen(true);
    }
    const handleModalClose = () => {
        setIsModalOpen(false);
    }

    const onDelete = async () => {
        if (privateId !== recipe?.private_id) {
            toast.error("Private ID does not match.");
            return;
        }
        
        const toastId = toast.loading("Deleting this recipe");
        setIsSubmitting(true);

        const res = await axios.delete(`${process.env.API}/recipe/${privateId}`);

        toast.dismiss(toastId);
        setIsSubmitting(false);

        if (!res.data.success) {
            toast.error(res.data.message);
            return;
        }

        toast.success(res.data.message);

        router.push("/realm");
    };

    const onUpdate = () => {
        if (privateId !== recipe?.private_id) {
            toast.error("Private ID does not match.");
            return;
        }

        // push to create page with values of this recipe
        // replace all \n in ingredients to transmit \n to the new page
        router.push(`/recipe/create?recipeName=${recipe.name}&imageLink=${recipe.image_link}&recipeIngredients=${recipe.ingredients.replaceAll("\n","%0A")}&recipeDescription=${recipe.description}&id=${router.query.id}`);
    };

    const onModify = () => {
        handleModalOpen();
    };

    useEffect(() => {
        (async function() {
            const {id} = router.query;
            const res = await axios.get(`${process.env.API}/recipe/${id}`);

            if (res.status !== 200) {
                toast.error("Error fetching, please try again later.");
                return;
            }
            setRecipe(res.data);
            setIsLoading(false);
        })()
    },[]);

    if (!isLoading && recipe) {
        return (
            <Sidebar>
                <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h4" fontWeight="bold" textAlign="center">
                            {recipe.name}
                        </Typography>
                        <Typography variant="h5">by {recipe.author_name}</Typography>
                    </Box>
                    <Box
                        component="img"
                        src={recipe.image_link}
                        sx={{
                            maxHeight: 300,
                            width: "100%",
                            objectFit: "cover",
                        }}
                    />
                    {/* CHIPS */}
                    <Box sx={{display: "flex", gap: 1.5, flexWrap: "wrap"}}>
                        {recipe.ingredients.split("\n").map((ingredient,index) => {
                            if (ingredient.length > 16) {
                                return <Tooltip title={ingredient}>
                                    <Chip key={index} label={ingredient} color="secondary" sx={{
                                        WebkitLineClamp: 1,
                                        overflow: 'hidden',
                                        width:100,
                                    }}/>
                                </Tooltip>
                            }
                            else return (<Chip key={index} label={ingredient} color="secondary" sx={{
                                WebkitLineClamp: 1,
                                overflow: 'hidden',
                                width:100,
                            }}/>)
                        })}
                    </Box>
                    <Typography paragraph>
                        {recipe.description}
                    </Typography>
                    <Box sx={{marginLeft: "auto"}}>
                        <Button
                            onClick={onModify}
                            variant="contained"
                            sx={{color: `${theme.palette.secondary.main}`}}
                        >
                            Modify
                        </Button>
                    </Box>
                </Box>
                <Modal open={isModalOpen} onClose={handleModalClose}>
                    <Fade in={isModalOpen}>
                        <Box sx={modalStyle}>
                            <Typography mb={2} variant="h6" component="h2">
                                Enter recipe&apos;s private ID
                            </Typography>
                            <TextField label="Private ID"
                                       sx={{input: {color: '#1d1d1f'}}}
                                       value={privateId}
                                       onChange={(e) => {
                                           setPrivateId(e.target.value)
                                       }}/>
                            <Box sx={{display:'flex' , gap:1.5,marginLeft:'auto'}}>
                                <Button  disabled={isSubmitting} sx={{color: `${theme.palette.secondary.main}`}} onClick={onDelete}>Delete</Button>
                                <Button variant="contained" disabled={isSubmitting} sx={{color: `${theme.palette.secondary.main}`}} onClick={onUpdate}>Update</Button>
                            </Box>
                        </Box>
                    </Fade>
                </Modal>
            </Sidebar>
        );
    }

    return (<>
        <Head/>
        <Loader/>
    </>);
}
