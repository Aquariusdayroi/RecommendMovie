import React, { useState } from "react";
import {
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  IconButton,
} from "@mui/material";
import { Home, Movie, MusicNote, Tv, Menu } from "@mui/icons-material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import router
import HomePage from "./pages/HomePage";
import MovieDetail from "./components/MovieDetail"; // Import trang chi tiết phim

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
    <Router>
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

          {/* Sử dụng Routes để điều hướng */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies/:id" element={<MovieDetail />} /> {/* Route chi tiết phim */}
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
