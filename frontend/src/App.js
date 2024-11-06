import React, { useState } from "react";
import {
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { Home, Movie, MusicNote, Tv, Menu } from "@mui/icons-material";
import HomePage from "./pages/HomePage";

const sidebarItems = [
  { text: "Channels", icon: <Home /> },
  { text: "Playlists", icon: <Movie /> },
  { text: "Movies", icon: <Movie /> },
  { text: "Music", icon: <MusicNote /> },
  { text: "TV Shows", icon: <Tv /> },
];

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* Sidebar */}
      <Drawer
        variant="temporary"
        open={isSidebarOpen}
        onClose={toggleSidebar}
        sx={{
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "#2b2b2b",
            color: "white",
          },
        }}
      >
        <Box sx={{ overflow: "auto" }}>
          <List>
            {sidebarItems.map((item) => (
              <ListItem
              button
              key={item.text}
              sx={{
                "&:hover": {
                  backgroundColor: "#444",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
            
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Nội dung chính */}
      <Box
        sx={{
          flexGrow: 1,
          padding: 3,
          backgroundColor: "#181818",
          color: "white",
          minHeight: "100vh",
          transition: "transform 0.3s ease", // Hiệu ứng chuyển động mượt
          // transform: isSidebarOpen ? "translateX(240px)" : "translateX(0)", // Dịch nội dung theo sidebar
        }}
      >
        <IconButton
          color="inherit"
          onClick={toggleSidebar}
          sx={{
            marginBottom: 2,
            color: "white",
            backgroundColor: "#333",
            "&:hover": { backgroundColor: "#555" },
          }}
        >
          <Menu />
        </IconButton>

        <HomePage />
      </Box>
    </Box>
  );
}

export default App;
