import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/system";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

import Recipe from "@/interfaces/recipe";

interface RecipeCardProps extends Recipe {
  showPendingTag: boolean;
  showCopyPID: boolean;
}

export default function RecipeCard({
  id,
  image_link,
  name,
  description,
  is_pending,
  private_id,
  showPendingTag,
  showCopyPID,
}: RecipeCardProps) {
  const theme = useTheme();
  const router = useRouter();

  const onLearnMoreClick = () => {
    router.push(`/recipe/${id}`);
  };

  const onCopyPrivateId = async () => {
    try {
      await navigator.clipboard.writeText(private_id);
      toast.success("Copied!");
    } catch (error) {
      toast.error("Something went wrong.");
    }
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
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
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
        {showPendingTag && (
          <Chip
            label={!!is_pending ? "Pending" : "Approved"}
            sx={{
              backgroundColor: !!is_pending ? "#ff726f" : "#16DB65",
              color: "#1d1d1f",
              alignSelf: "start",
            }}
          />
        )}
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
        {showCopyPID && (
          <Button
            size="small"
            color="primary"
            sx={{ color: theme.palette.primary.main, marginLeft: "auto" }}
            onClick={onCopyPrivateId}
          >
            Copy Private ID
          </Button>
        )}
        <Button
          size="small"
          variant="contained"
          color="primary"
          sx={{ color: theme.palette.secondary.main, marginLeft: "auto" }}
          onClick={onLearnMoreClick}
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}
