import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Grid, Box, Typography } from "@mui/material";
import { toast } from "react-hot-toast";
import axios from "axios";

import Head from "@/components/Head";
import Recipe from "@/types/recipe";
import RecipeCard from "@/components/recipe/RecipeCard";
import Sidebar from "@/components/sidebar/Sidebar";
import Loader from "@/components/loader/Loader";

export default function MyRecipes() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    (async function () {
      let user: { id: number; username: string } = { id: 0, username: "" };

      if (localStorage.getItem("user") === null) {
        router.push("/");
        return;
      }

      user = JSON.parse(String(localStorage.getItem("user")));

      try {
        const res = await axios.get(
          `${process.env.API}/recipe/${user.id}/${user.username}`
        );

        setRecipes(res.data);
      } catch (error) {
        // @ts-ignore
        toast.error(error.response.data.message);

        setErrorMessage("You haven't created any recipes yet!");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (errorMessage) {
    return (
      <Sidebar>
        <Box sx={{ display: "grid", placeItems: "center", minHeight: "100%" }}>
          <Typography variant="h5" textAlign="center" fontWeight="bold">
            {errorMessage}
          </Typography>
        </Box>
      </Sidebar>
    );
  }

  if (!isLoading) {
    return (
      <>
        <Head />
        <Sidebar>
          <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
            {recipes.length > 0 &&
              recipes.map((recipe) => (
                <Grid item key={recipe.id} xs={12} sm={6} md={4} lg={3} xl={2}>
                  <RecipeCard
                    id={recipe.id}
                    author_name={recipe.author_name}
                    is_pending={recipe.is_pending}
                    ingredients={recipe.ingredients}
                    image_link={recipe.image_link}
                    name={recipe.name}
                    description={recipe.description}
                    private_id={recipe.private_id}
                  />
                </Grid>
              ))}
          </Grid>
        </Sidebar>
      </>
    );
  }

  return (
    <>
      <Head />
      <Loader />
    </>
  );
}
