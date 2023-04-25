import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Modal,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/system";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";

import Head from "@/components/Head";
import Sidebar from "@/components/sidebar/Sidebar";
import modalStyle from "@/constants/modalStyle";

export default function Create() {
  const theme = useTheme();
  const router = useRouter();
  const [recipeName, setRecipeName] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [recipeIngredients, setRecipeIngredients] = useState("");
  const [recipeDescription, setRecipeDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privateId, setPrivateId] = useState("");

  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // UPDATE RECIPE
  const onUpdateRecipe = async () => {
    const { id } = router.query;

    const toastId = toast.loading("Updating your recipe");

    setIsSubmitting(true);
    const res = await axios.patch(`${process.env.API}/recipe/${id}`, {
      recipeName,
      imageLink,
      recipeIngredients: recipeIngredients,
      recipeDescription,
    });
    setIsSubmitting(false);

    toast.dismiss(toastId);

    if (!res.data.success) {
      toast.error(res.data.message);
      return;
    }

    toast.success(res.data.message);
    router.push("/realm");
  };

  // CREATE RECIPE
  const onCreateRecipe = async () => {
    if (!recipeName || !imageLink || !recipeIngredients || !recipeDescription) {
      toast.error("Do not leave empty fields!");
      return;
    }

    // get user obj from local
    let user: { id: number; username: string } = { id: 0, username: "" };
    if (localStorage.getItem("user") === null) {
      toast.error("Please enter again!");
      router.push("/");
      return;
    }

    const toastId = toast.loading("Creating your recipe");
    setIsSubmitting(true);

    user = JSON.parse(String(localStorage.getItem("user")));

    const data = {
      recipeName,
      authorId: user.id,
      authorName: user.username,
      imageLink,
      recipeIngredients,
      recipeDescription,
    };

    const res = await axios.post(`${process.env.API}/recipe`, data);
    toast.dismiss(toastId);
    setIsSubmitting(false);

    if (!res.data.success) {
      toast.error("Something went wrong!");
      return;
    }

    setPrivateId(res.data.uuid);
    setIsModalOpen(true);
    toast.success("Recipe Created!");
  };

  // set default values for update mode
  useEffect(() => {
    if (Object.keys(router.query).length > 0) {
      const { recipeName, imageLink, recipeIngredients, recipeDescription } =
        router.query;

      setIsEditMode(true);

      setRecipeName(recipeName as string);
      setImageLink(imageLink as string);
      setRecipeIngredients(recipeIngredients as string);
      setRecipeDescription(recipeDescription as string);
    }
  }, [router.query]);

  return (
    <>
      <Head />
      <Sidebar>
        <Container>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography
              sx={{ alignSelf: "center" }}
              variant="h4"
              textAlign="center"
            >
              {isEditMode ? "Update Recipe" : "Create a Recipe"}
            </Typography>
            <Typography>Recipe Name</Typography>
            <TextField
              placeholder="Special Sushi"
              name="recipeName"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
            />
            <Typography>Image link</Typography>
            <TextField
              placeholder="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              name="imageLink"
              value={imageLink}
              onChange={(e) => setImageLink(e.target.value)}
            />
            <Typography>Ingredients (Separate by enter)</Typography>
            <TextField
              placeholder={"White Sugar\nWater\nSalt\nCrab Meat\nGinger"}
              name="recipeIngredients"
              value={recipeIngredients}
              onChange={(e) => setRecipeIngredients(e.target.value)}
              multiline
              minRows={5}
              maxRows={10}
            />
            <Typography>Description</Typography>
            <TextField
              placeholder="Description or the procedure on how you do the recipe!"
              name="recipeDescription"
              value={recipeDescription}
              onChange={(e) => setRecipeDescription(e.target.value)}
              multiline
              minRows={10}
              maxRows={20}
            />
            {isEditMode ? (
              <Button
                variant="contained"
                sx={{
                  color: `${theme.palette.secondary.main}`,
                  alignSelf: "center",
                  marginLeft: "auto",
                }}
                disabled={isSubmitting}
                onClick={onUpdateRecipe}
              >
                Update
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{
                  color: `${theme.palette.secondary.main}`,
                  alignSelf: "center",
                  marginLeft: "auto",
                }}
                onClick={onCreateRecipe}
                disabled={isSubmitting}
              >
                Create Recipe
              </Button>
            )}
          </Box>
        </Container>
        {/* MODAL */}
        <Modal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            router.push("/realm");
          }}
        >
          <Box sx={modalStyle}>
            <Typography variant="h6" component="h2">
              Keep this because you need this in order to{" "}
              <strong>update/delete</strong> your recipe!
            </Typography>
            <Tooltip title="Never share this to anyone!" placement="top">
              <Typography variant="body1" component="span" fontWeight="bold">
                {privateId}
              </Typography>
            </Tooltip>
          </Box>
        </Modal>
      </Sidebar>
    </>
  );
}
