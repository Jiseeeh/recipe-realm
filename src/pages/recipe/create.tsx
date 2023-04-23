import { Box, TextField, Button, Typography, Container } from "@mui/material";
import { useTheme } from "@mui/system";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";

import Head from "@/components/Head";
import Sidebar from "@/components/sidebar/Sidebar";

export default function Create() {
  const theme = useTheme();
  const router = useRouter();
  const [recipeName, setRecipeName] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [recipeIngredients, setRecipeIngredients] = useState("");
  const [recipeDescription, setRecipeDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);

  const onEditRecipe = async () => {};

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

    const res = await axios.post("http://localhost:3001/api/recipe", data);
    toast.dismiss(toastId);
    setIsSubmitting(false);

    if (!res.data.success) {
      toast.error("Something went wrong!");
      return;
    }

    toast.success("Recipe created!");

    setTimeout(() => {
      router.push("/realm");
    }, 800);
  };

  useEffect(() => {
    if (Object.keys(router.query).length > 0) {
      console.log(router.query);
      setIsEditMode(true);
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
      </Sidebar>
    </>
  );
}
