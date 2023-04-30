import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

import Sidebar from "@/components/sidebar/Sidebar";
import Recipe from "@/interfaces/recipe";
import RecipeCard from "@/components/recipe/RecipeCard";
import Loader from "@/components/loader/Loader";
import Head from "@/components/Head";

export default function Realm() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async function () {
      const res = await axios.get(`${process.env.API}/recipe`);

      if (res.status !== 200) {
        toast.error("Error fetching, please try again later.");
        return;
      }

      setRecipes(res.data.filter((recipe: Recipe) => recipe.is_pending === 0));
      setIsLoading(false);
    })();
  }, []);

  if (!isLoading) {
    return (
      <>
        <Sidebar>
          <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
            {recipes.length > 0 &&
              recipes.map((recipe) => (
                <Grid item key={recipe.id} xs={12} sm={6} md={4} lg={3} xl={2}>
                  <RecipeCard
                    id={recipe.id}
                    showPendingTag={false}
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
