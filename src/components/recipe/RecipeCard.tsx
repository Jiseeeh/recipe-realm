import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useTheme } from "@mui/system";
import { useRouter } from "next/router";

import Recipe from "@/types/recipe";

export default function RecipeCard({
  id,
  image_link,
  name,
  description,
}: Recipe) {
  const theme = useTheme();
  const router = useRouter();

  const onClick = () => {
    router.push(`/recipe/${id}`);
  };

  return (
    <Card sx={{ maxWidth: 280 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          image={image_link}
          alt="Recipe Image"
          sx={{ height: 300 }}
        />
      </CardActionArea>
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          variant="contained"
          color="primary"
          sx={{ color: theme.palette.secondary.main, marginLeft: "auto" }}
          onClick={onClick}
        >
          Learn More <ChevronRightIcon />
        </Button>
      </CardActions>
    </Card>
  );
}
