import { Grid, Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import axios, { AxiosError } from "axios";
import ReactSearchBox from "react-search-box";

import Sidebar from "@/components/sidebar/Sidebar";
import Recipe from "@/interfaces/recipe";
import RecipeCard from "@/components/recipe/RecipeCard";
import Loader from "@/components/loader/Loader";
import Head from "@/components/Head";

export default function Realm() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // fetch recipes
  useEffect(() => {
    (async function () {
      try {
        const res = await axios.get(`${process.env.API}/recipe`);

        setRecipes(res.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message);

          if (error.response?.data.clearCache) {
            localStorage.clear();
            router.push("/");
          }
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (!isLoading) {
    return (
      <>
        <Sidebar>
          <Box
            sx={{ maxWidth: "500px", marginLeft: "auto", marginBottom: "1rem" }}
          >
            <ReactSearchBox
              onSelect={(record: any) => {
                router.push(`/recipe/${record.item.key}`);
              }}
              placeholder="Adobo"
              data={recipes.map((recipe: Recipe) => ({
                key: recipe.id,
                value: recipe.name,
              }))}
              // required by this component's props
              onFocus={() => {}}
              onChange={() => {}}
              autoFocus
              leftIcon={<>🔍</>}
              iconBoxSize="48px"
            />
          </Box>
          {recipes.length > 0 ? (
            <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
              {recipes.map((recipe) => (
                <Grid item key={recipe.id} xs={12} sm={6} md={4} lg={3} xl={2}>
                  <RecipeCard
                    id={recipe.id}
                    showPendingTag={false}
                    showCopyPID={false}
                    author_name={recipe.author_name}
                    is_pending={recipe.is_pending}
                    ingredients={recipe.ingredients}
                    image_link={recipe.image_link}
                    name={recipe.name}
                    description={recipe.description}
                    private_id={recipe.private_id}
                    likes_count={recipe.likes_count}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
              }}
            >
              <Typography variant="h5">No Recipes yet!</Typography>
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
