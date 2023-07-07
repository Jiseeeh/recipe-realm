import { Box, Typography } from "@mui/material";
import { NextRouter } from "next/router";

import Recipe from "@/interfaces/recipe";

interface RecipeRankItemProps {
  recipe: Partial<Recipe> | undefined;
  router: NextRouter;
}

export default function RecipeRankItem({
  recipe,
  router,
}: RecipeRankItemProps) {
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
        router.push(`/recipe/${recipe?.id}`);
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
        src={recipe?.image_link}
      />
      <Box>
        <Typography
          sx={{
            fontSize: "clamp(.8rem, -1.6563rem + 8.5vw, 1.5rem);",
          }}
          variant="h6"
        >
          {recipe?.name}
        </Typography>
        <Typography
          sx={{
            fontSize: "clamp(.7rem, -1.6563rem + 8.5vw, 1rem);",
          }}
          variant="subtitle2"
        >{`Current likes: ${recipe?.likes_count}`}</Typography>
      </Box>
    </Box>
  );
}
