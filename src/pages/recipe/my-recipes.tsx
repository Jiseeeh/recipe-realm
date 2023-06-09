import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Grid,
  Box,
  Typography,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { toast } from "react-hot-toast";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import axios, { AxiosError } from "axios";

import Head from "@/components/Head";
import Recipe from "@/interfaces/recipe";
import RecipeCard from "@/components/recipe/RecipeCard";
import Sidebar from "@/components/sidebar/Sidebar";
import Loader from "@/components/loader/Loader";
import { clearCache } from "@/helper/clearCache";

enum FilterState {
  ALL = -1,
  APPROVED = 0,
  PENDING = 1,
}

export default function MyRecipes() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [filterState, setFilterState] = useState<FilterState>(FilterState.ALL);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mappedRecipes, setMappedRecipes] = useState<JSX.Element[]>([]);

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = (filterBy: FilterState) => {
    return function () {
      filterRecipes(filterBy);
      setAnchorEl(null);
    };
  };

  const filterRecipes = (filterBy: FilterState) => {
    if (filterBy === filterState) return;

    setFilterState(filterBy);
  };

  // fetching of recipes
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
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message);

          setErrorMessage("You haven't created any recipes yet!");

          if (error.response?.data.clearCache) clearCache(router);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [router]);

  // mapping of recipes
  useEffect(() => {
    if (recipes.length > 0)
      setMappedRecipes(
        recipes
          .filter((recipe) => {
            if (filterState === FilterState.ALL) return true;

            return Number(recipe.is_pending) === filterState;
          })
          .map((recipe) => (
            <Grid item key={recipe.id} xs={12} sm={6} md={4} lg={3} xl={2}>
              <RecipeCard
                id={recipe.id}
                showPendingTag={true}
                showCopyPID={true}
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
          ))
      );
  }, [recipes, filterState]);

  if (errorMessage) {
    return (
      <Sidebar>
        <Box sx={{ display: "grid", placeItems: "center", height: "100%" }}>
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
          <Box sx={{ display: "flex", marginBottom: 2 }}>
            <IconButton sx={{ marginLeft: "auto" }} onClick={handleFilterClick}>
              <FilterAltIcon sx={{ color: "#1d1d1f" }} />
            </IconButton>
            <Menu
              id="filter-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleFilterClose}
            >
              <MenuItem onClick={handleFilterClose(FilterState.ALL)}>
                All
              </MenuItem>
              <MenuItem onClick={handleFilterClose(FilterState.APPROVED)}>
                Approved
              </MenuItem>
              <MenuItem onClick={handleFilterClose(FilterState.PENDING)}>
                Pending
              </MenuItem>
            </Menu>
          </Box>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            justifyContent="center"
            // minHeight="100vh"
          >
            {mappedRecipes.length > 0 ? mappedRecipes : <h1>No recipes!</h1>}
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
