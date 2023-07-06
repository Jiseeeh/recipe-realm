import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { NextRouter } from "next/router";

interface SidebarIconProps {
  path: string;
  router: NextRouter;
  isSidebarOpen: boolean;
  icon: React.ReactNode;
}

const highlightColor = "#a9b44b";

export default function SidebarIcon({
  path,
  router,
  isSidebarOpen,
  icon,
}: SidebarIconProps) {
  return (
    <ListItem
      disablePadding
      sx={{
        display: "block",
        backgroundColor: `${router.pathname === path ? highlightColor : ""}`,
      }}
      onClick={() => {
        if (router.pathname !== path) router.push(path);
      }}
    >
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: isSidebarOpen ? "initial" : "center",
          px: 2.5,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: isSidebarOpen ? 3 : "auto",
            justifyContent: "center",
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText primary="Home" sx={{ opacity: isSidebarOpen ? 1 : 0 }} />
      </ListItemButton>
    </ListItem>
  );
}
