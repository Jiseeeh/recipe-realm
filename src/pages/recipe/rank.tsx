import { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import axios, { AxiosError } from "axios";

import Sidebar from "@/components/sidebar/Sidebar";
import Head from "@/components/Head";
import Loader from "@/components/loader/Loader";
import Recipe from "@/interfaces/recipe";
import RecipeRankItem from "@/components/recipe/RecipeRankItem";

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
  }, [router]);

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
                  <RecipeRankItem
                    key={recipe?.id}
                    recipe={recipe}
                    router={router}
                  />
                ))}
              </Box>
            </Box>
          ) : (
            <Box
              sx={{ display: "grid", placeItems: "center", minHeight: "100%" }}
            >
              <Typography variant="h6" textAlign="center">
                {"There are no currently liked recipes."}
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
