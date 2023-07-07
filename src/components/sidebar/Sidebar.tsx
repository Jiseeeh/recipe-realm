import { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Toolbar,
  List,
  Typography,
  IconButton,
  Divider,
  ListItemIcon,
  CssBaseline,
  ListItemText,
  ListItem,
  ListItemButton,
  CSSObject,
  styled,
  Theme,
  useTheme,
  Modal,
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeIcon from "@mui/icons-material/Home";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

import Head from "@/components/Head";
import modalStyle from "@/constants/modalStyle";
import SidebarIcon from "./SidebarIcon";

const drawerWidth = 240;
const iconColor = "#154734";
const bgColor = "#F5F5DC";
const highlightColor = "#a9b44b";

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

interface SidebarProps {
  children: ReactNode;
}

type User = {
  id: number;
  username: string;
  isAdmin: boolean;
};

export default function Sidebar({ children }: SidebarProps) {
  const theme = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User>({
    id: 0,
    isAdmin: false,
    username: "",
  });

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (localStorage.getItem("user") !== null) {
      let user: User = JSON.parse(String(localStorage.getItem("user")));

      setUser(user);
    } else {
      router.push("/");
    }
  }, [router]);

  return (
    <>
      <Head />
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon sx={{ color: `#fff` }} />
            </IconButton>
            <Typography
              variant="h5"
              noWrap
              component="div"
              fontWeight="bold"
              sx={{ color: `#fff`, marginRight: "auto" }}
            >
              Recipe Realm
            </Typography>
            <Typography
              variant="subtitle2"
              noWrap
              component="span"
              sx={{ color: `#fff`, display: { xs: "none", sm: "block" } }}
            >
              {`Logged in as ${user.username}`}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader sx={{ backgroundColor: bgColor }}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List sx={{ height: "100%", backgroundColor: bgColor }}>
            {/* HOME ICON */}
            <SidebarIcon
              router={router}
              path="/realm"
              isSidebarOpen={open}
              icon={<HomeIcon sx={{ color: `#${iconColor}` }} />}
            />
            {/* CREATE RECIPE ICON */}
            <SidebarIcon
              router={router}
              path="/recipe/create"
              isSidebarOpen={open}
              icon={<BorderColorIcon sx={{ color: `#${iconColor}` }} />}
            />
            {/* Own Recipes ICON */}
            <SidebarIcon
              router={router}
              path="/recipe/my-recipes"
              isSidebarOpen={open}
              icon={<LocalDiningIcon sx={{ color: `#${iconColor}` }} />}
            />
            {/* Moderation ICON */}
            {user.isAdmin && (
              <SidebarIcon
                router={router}
                path="/recipe/moderation"
                isSidebarOpen={open}
                icon={
                  <AdminPanelSettingsIcon sx={{ color: `#${iconColor}` }} />
                }
              />
            )}
            {/* Top Recipes ICON */}
            <SidebarIcon
              router={router}
              path="/recipe/rank"
              isSidebarOpen={open}
              icon={<EmojiEventsIcon sx={{ color: `#${iconColor}` }} />}
            />
            {/* LOGOUT ICON */}
            <ListItem
              disablePadding
              sx={{
                display: "block",
              }}
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <LogoutIcon sx={{ color: `#${iconColor}` }} />
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            display: "flex",
            flexDirection: "column",
            overflowX: "auto",
            minHeight: "100vh",
            backgroundColor: "#F5F5DC",
          }}
        >
          <DrawerHeader />
          {children}
        </Box>
      </Box>
      {/* MODAL */}
      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Do you want to logout?
          </Typography>
          <Box sx={{ display: "flex", marginLeft: "auto" }}>
            <Button
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              No
            </Button>
            <Button
              variant="contained"
              sx={{ color: "#fff" }}
              onClick={() => {
                localStorage.clear();
                setIsModalOpen(false);
                router.push("/");
              }}
            >
              Yes
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
