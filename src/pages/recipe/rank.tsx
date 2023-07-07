import { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { toast } from "react-hot-toast";
import { NextRouter, useRouter } from "next/router";
import axios, { AxiosError } from "axios";

import Sidebar from "@/components/sidebar/Sidebar";
import Head from "@/components/Head";
import Loader from "@/components/loader/Loader";
import Recipe from "@/interfaces/recipe";

const RECIPE_LIMIT = 5;

export default function Rank() {
  const [isLoading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState<Partial<Recipe[]>>([]);
  const router = useRouter();

  // fetch top recipes
  useEffect(() => {
    (async function () {
      try {
        const res = await axios.get(
          `${process.env.API}/recipe-rank?limit=${RECIPE_LIMIT}`
        );

        setRecipes(res.data);
        setIsLoading(false);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message);
          router.push("/realm");
        }
      }
    })();
  }, []);

  if (!isLoading) {
    return (
      <>
        <Sidebar>
          {recipes.length > 0 ? (
            <Box>
              <Typography
                variant="h5"
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: "5px",
                }}
              >
                {"Top Liked Recipes"}
              </Typography>
              <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
                {"Select a recipe to view it."}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  justifyContent: "center",
                  alignContent: "space-between",
                  gap: 2,
                  marginTop: "2rem",
                }}
              >
                {/* recipes */}
                {recipes.map((recipe) => (
                  <RecipeItem
                    id={recipe?.id}
                    name={recipe?.name}
                    image_link={recipe?.image_link}
                    likes_count={recipe?.likes_count}
                  />
                ))}
              </Box>
            </Box>
          ) : (
            <Box
              sx={{ display: "grid", placeItems: "center", minHeight: "100%" }}
            >
              <Typography variant="h6" textAlign="center">
                There are no currently liked recipes.
              </Typography>
            </Box>
          )}
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

function RecipeItem(recipe: Partial<Recipe>) {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        "&:hover": {
          backgroundColor: "#dddd88",
        },
        transition: "background-color .15s ease-in-out",
        borderRadius: "5px",
        cursor: "pointer",
        padding: "1rem",
        alignItems: "center",
        gap: 1,
        width: "100%",
      }}
      onClick={() => {
        router.push(`/recipe/${recipe.id}`);
      }}
    >
      <Box
        sx={{
          height: 60,
          width: 60,
          borderRadius: "50%",
          objectFit: "cover",
        }}
        component="img"
        src={recipe.image_link}
      />
      <Box>
        <Typography
          sx={{
            fontSize: "clamp(.8rem, -1.6563rem + 8.5vw, 1.5rem);",
          }}
          variant="h6"
        >
          {recipe.name}
        </Typography>
        <Typography
          sx={{
            fontSize: "clamp(.7rem, -1.6563rem + 8.5vw, 1rem);",
          }}
          variant="subtitle2"
        >{`Current likes: ${recipe.likes_count}`}</Typography>
      </Box>
    </Box>
  );
}
