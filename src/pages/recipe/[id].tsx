import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Fade,
  Modal,
  TextField,
  Typography,
  Tooltip,
  Container,
  Grid,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/system";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios, { AxiosError } from "axios";

import Sidebar from "@/components/sidebar/Sidebar";
import Loader from "@/components/loader/Loader";
import Head from "@/components/Head";
import Recipe from "@/interfaces/recipe";
import modalStyle from "@/constants/modalStyle";
import encodeNewLineAndQuote from "@/helper/preserveNewLineAndQuote";

type User = {
  id: number;
  username: string;
};

export default function Recipe() {
  const [status, setStatus] = useState({
    isSubmitting: false,
    isLoading: true,
    isLiking: false,
    isLiked: false,
    isModalOpen: false,
  });
  const [likes, setLikes] = useState(0);
  const [user, setUser] = useState<User>({ id: 0, username: "" });
  const [privateId, setPrivateId] = useState("");
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const theme = useTheme();
  const router = useRouter();

  const handleModalOpen = () => {
    setStatus((prevStatus) => ({ ...prevStatus, isModalOpen: true }));
  };
  const handleModalClose = () => {
    setStatus((prevStatus) => ({ ...prevStatus, isModalOpen: false }));
  };

  const onDelete = async () => {
    if (privateId !== recipe?.private_id) {
      toast.error("Private ID does not match.");
      return;
    }

    const toastId = toast.loading("Deleting this recipe");
    setStatus((prevStatus) => ({ ...prevStatus, isSubmitting: true }));

    const res = await axios.delete(`${process.env.API}/recipe/${privateId}`);

    toast.dismiss(toastId);
    setStatus((prevStatus) => ({ ...prevStatus, isSubmitting: false }));

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
    router.push(
      `/recipe/create?recipeName=${recipe.name}&imageLink=${
        recipe.image_link
      }&recipeIngredients=${encodeNewLineAndQuote(
        recipe.ingredients
      )}&recipeDescription=${encodeNewLineAndQuote(recipe.description)}&id=${
        router.query.id
      }`
    );
  };

  const onModify = () => {
    handleModalOpen();
  };

  const onLike = async () => {
    setStatus((prevStatus) => ({ ...prevStatus, isLiking: true }));

    const { id } = router.query;
    let likeToastId;

    try {
      if (status.isLiked) {
        const toastId = toast.loading("Disliking");

        const res = await axios.patch(
          `${process.env.API}/recipe-likes?recipeId=${id}&userId=${user.id}`
        );
        const message = res.data.message;

        toast.dismiss(toastId);

        if (res.data.success) {
          toast.success(message);

          setStatus((prevStatus) => ({ ...prevStatus, isLiked: false }));
          setLikes((prevLikes) => prevLikes - 1);
        } else {
          toast.error(message);
        }

        return;
      }

      likeToastId = toast.loading("Liking");

      const res = await axios.post(
        `${process.env.API}/recipe-likes?recipeId=${id}&userId=${user.id}`
      );

      toast.dismiss(likeToastId);

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);

      setLikes((prevLikes) => prevLikes + 1);
      setStatus((prevStatus) => ({ ...prevStatus, isLiked: true }));
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
        toast.dismiss(likeToastId);

        if (error.response?.data.clearCache) {
          localStorage.clear();
          router.push("/");
        }
      }
    } finally {
      setStatus((prevStatus) => ({ ...prevStatus, isLiking: false }));
    }
  };

  // fetch recipe
  useEffect(() => {
    (async function () {
      const { id } = router.query;

      if (!id) return;

      try {
        const res = await axios.get(`${process.env.API}/recipe/${id}`);

        setRecipe(res.data);
        setStatus((prevStatus) => ({ ...prevStatus, isLoading: false }));
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message);

          router.push("/realm");
        }
      }
    })();
  }, [router.query]);

  // fetch recipe likes
  useEffect(() => {
    (async function () {
      const { id } = router.query;

      if (!id) return;

      let user: User = { id: 0, username: "" };

      if (localStorage.getItem("user") === null) {
        router.push("/");
        return;
      }

      user = JSON.parse(String(localStorage.getItem("user")));

      try {
        const res = await axios.get(
          `${process.env.API}/recipe-likes?recipeId=${id}&userId=${user.id}`
        );

        setLikes(res.data.likes_count);
        setStatus((prevStatus) => ({
          ...prevStatus,
          isLiked: res.data.isLiked,
        }));
        setUser(user);
      } catch (error) {
        if (error instanceof AxiosError)
          toast.error(error.response?.data.message);
      }
    })();
  }, [router.query]);

  if (!status.isLoading && recipe) {
    return (
      <Sidebar>
        <Container sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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
          <Grid
            container
            spacing={{ xs: 1, md: 2 }}
            textAlign="center"
            flexWrap="wrap"
            sx={{
              maxHeight: 200,
              overflowY: "auto",
            }}
          >
            {recipe.ingredients.split("\n").map((ingredient, index) => {
              if (ingredient.length > 16) {
                return (
                  <Tooltip title={ingredient} key={index}>
                    <Grid key={index} item xs={6} sm={2}>
                      <Chip
                        label={ingredient}
                        color="secondary"
                        sx={{
                          WebkitLineClamp: 1,
                          overflow: "hidden",
                          width: 100,
                        }}
                      />
                    </Grid>
                  </Tooltip>
                );
              } else
                return (
                  <Grid key={index} item xs={6} sm={2}>
                    <Chip
                      label={ingredient}
                      color="secondary"
                      sx={{
                        WebkitLineClamp: 1,
                        overflow: "hidden",
                        width: 100,
                      }}
                    />
                  </Grid>
                );
            })}
          </Grid>
          <Typography sx={{ whiteSpace: "pre-wrap" }} paragraph>
            {recipe.description}
          </Typography>
          <Box sx={{ marginLeft: "auto" }}>
            <IconButton onClick={onLike} disabled={status.isLiking}>
              {status.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              <Typography fontWeight="bold">{likes}</Typography>
            </IconButton>
            <Button
              onClick={onModify}
              variant="contained"
              sx={{ color: `#fff` }}
            >
              Modify
            </Button>
          </Box>
        </Container>
        <Modal open={status.isModalOpen} onClose={handleModalClose}>
          <Fade in={status.isModalOpen}>
            <Box sx={modalStyle}>
              <Typography mb={2} variant="h6" component="h2">
                Enter recipe&apos;s private ID
              </Typography>
              <TextField
                label="Private ID"
                sx={{ input: { color: "#1d1d1f" } }}
                value={privateId}
                onChange={(e) => {
                  setPrivateId(e.target.value);
                }}
              />
              <Box sx={{ display: "flex", gap: 1.5, marginLeft: "auto" }}>
                <Button
                  disabled={status.isSubmitting}
                  sx={{ color: `${theme.palette.secondary.main}` }}
                  onClick={onDelete}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  disabled={status.isSubmitting}
                  sx={{ color: `#fff` }}
                  onClick={onUpdate}
                >
                  Update
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Sidebar>
    );
  }

  return (
    <>
      <Head />
      <Loader />
    </>
  );
}
