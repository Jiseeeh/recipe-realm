import {useState} from "react";
import {Box, Button, Chip, Fade, Modal, TextField, Typography} from "@mui/material";
import {useTheme} from "@mui/system";

import Sidebar from "@/components/sidebar/Sidebar";
import Loader from "@/components/loader/Loader";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    p: 4,
}

export default function Recipe() {
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [privateId, setPrivateId] = useState("");
    const theme = useTheme();

    const handleModalOpen = () => {
        setIsModalOpen(true);
    }
    const handleModalClose = () => {
        setIsModalOpen(false);
    }

    // TODO add logic to delete and update
    const onDelete = () => {
        handleModalOpen();
    };
    const onEdit = () => {
        handleModalOpen();
    };

    if (!isLoading) {
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
                            Recipe Name
                        </Typography>
                        <Typography variant="h5">by John Doe</Typography>
                    </Box>
                    <Box
                        component="img"
                        src="/sushi-med.jpg"
                        sx={{
                            maxHeight: 300,
                            width: "100%",
                            objectFit: "cover",
                        }}
                    />
                    <Box sx={{display: "flex", gap: 1.5, flexWrap: "wrap"}}>
                        <Chip label="soy sauce" variant="filled" color="secondary"/>
                        <Chip label="water" variant="filled" color="secondary"/>
                        <Chip label="sample" variant="filled" color="secondary"/>
                        <Chip label="placeholder" variant="filled" color="secondary"/>
                        <Chip label="long placeholder" variant="filled" color="secondary"/>
                    </Box>
                    <Typography paragraph>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                        scelerisque justo eu lorem venenatis, ut accumsan mauris mollis.
                        Nunc mollis hendrerit purus, a elementum ligula gravida id. Donec
                        nunc elit, interdum ac commodo id, euismod tempor ligula. Aenean
                        eleifend scelerisque nunc vestibulum ullamcorper. Nulla eu sem eu
                        ligula rhoncus vehicula. Duis ultricies egestas tellus sit amet
                        consectetur. Nulla in fermentum sapien, vitae tincidunt erat. Etiam
                        viverra vel lectus a bibendum. Quisque pharetra quis arcu
                        pellentesque luctus. Curabitur sed tincidunt neque. Lorem ipsum
                        dolor sit amet consectetur adipisicing elit. Tempore a accusamus at
                        reiciendis! Ab maiores illo quia temporibus hic veniam eum iste
                        velit cupiditate incidunt blanditiis, repellendus tempore explicabo
                        nam quidem cum? Alias dicta reiciendis laboriosam? Incidunt libero
                        omnis ad quis nihil explicabo cumque ratione molestiae ipsa, sint
                        corporis rem temporibus officiis atque aperiam hic doloribus? Hic
                        voluptas vitae alias consectetur impedit eaque ex quae commodi
                        tempore, sed ad explicabo quibusdam eum saepe cupiditate tenetur
                        non, quo natus adipisci perspiciatis optio! Repellendus voluptatibus
                        inventore itaque quasi perferendis quam. Quas quia ea, culpa impedit
                        voluptas voluptatum a, quis fugiat officia est voluptatem excepturi
                        voluptatibus nam quos? Consectetur consequatur porro ipsam laborum
                        ipsum animi eum in, consequuntur, et officia voluptatem minus!
                        Numquam molestias recusandae iure est, natus quod optio eveniet
                        architecto omnis sapiente commodi, rerum voluptas, molestiae
                        perspiciatis magni iste qui odio tempore aperiam! Numquam quos
                        architecto temporibus adipisci quasi itaque maiores vitae deleniti
                        ducimus, ex nobis, velit accusantium alias ab unde voluptates
                        possimus ipsam facilis quidem quibusdam, earum maxime tenetur
                        sapiente? Debitis veniam deleniti voluptatum laboriosam libero odio
                        itaque quis consequuntur illo, harum placeat eaque alias
                        reprehenderit accusamus. Necessitatibus exercitationem illo magni
                        est officiis voluptas atque possimus quam hic alias? Maxime, velit
                        iste! Error, saepe soluta illo voluptas, nemo natus minus veritatis
                        ullam laborum quisquam nulla, culpa explicabo reiciendis laudantium
                        totam omnis dolores consequatur eaque. Fugiat ea fugit voluptas
                        necessitatibus, aspernatur dolores beatae nulla excepturi commodi
                        veritatis reiciendis reprehenderit, ducimus illum. Repudiandae esse
                        quaerat ipsa voluptatum? At perferendis reiciendis illum assumenda.
                    </Typography>
                    <Box sx={{marginLeft: "auto"}}>
                        <Button onClick={onDelete}>Delete</Button>
                        <Button
                            onClick={onEdit}
                            variant="contained"
                            sx={{color: `${theme.palette.secondary.main}`}}
                        >
                            Edit
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
                            <Button variant="contained" sx={{color: `${theme.palette.secondary.main}`}}>Submit</Button>
                        </Box>

                    </Fade>
                </Modal>
            </Sidebar>
        );
    }

    return <Loader/>;
}
