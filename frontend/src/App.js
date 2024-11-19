import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MovieDetail from "./components/MovieDetail";
import Register from "./components/Register";
import LoginPage from "./pages/LoginPage";
import RecommendationPage from "./pages/RecommendationPage";
import UserProfilePage from "./pages/UserProfilePage";
import {
  CssBaseline,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  Home,
  Movie,
  MusicNote,
  Tv,
  Menu,
  ExitToApp,
  AccountCircle,
} from "@mui/icons-material";

const sidebarItems = [
  { text: "Home", icon: <Home />, path: "/" },
  { text: "Movies", icon: <Movie />, path: "/recommendations" },
  { text: "Music", icon: <MusicNote />, path: "/music" },
  { text: "TV Shows", icon: <Tv />, path: "/tv-shows" },
];

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Trạng thái loading

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      axios.defaults.headers.common["Authorization"] = `Token ${token}`;
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false); // Kết thúc trạng thái loading
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Token ${token}`;
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
  };

  if (isLoading) {
    // Hiển thị vòng xoay loading khi đang kiểm tra trạng thái xác thực
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#181818",
          color: "white",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Sidebar */}
      {isAuthenticated && (
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
                  sx={{ "&:hover": { backgroundColor: "#444" } }}
                  component={Link}
                  to={item.path || "#"}
                >
                  <ListItemIcon sx={{ color: "white" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
              {/* Nút Logout */}
              <ListItem button onClick={handleLogout}>
                <ListItemIcon sx={{ color: "white" }}>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </Box>
        </Drawer>
      )}

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
        {/* Header */}
        {isAuthenticated && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <IconButton
              color="inherit"
              onClick={toggleSidebar}
              sx={{
                color: "white",
                backgroundColor: "#333",
                "&:hover": { backgroundColor: "#555" },
                width: 48,
                height: 48,
              }}
            >
              <Menu />
            </IconButton>

            <Typography
              variant="h6"
              sx={{ flexGrow: 1, textAlign: "center", color: "white" }}
            >
              Movie Recommendation
            </Typography>

            <IconButton
              color="inherit"
              component={Link}
              to="/profile"
              sx={{
                color: "white",
                backgroundColor: "#333",
                "&:hover": { backgroundColor: "#555" },
                width: 48,
                height: 48,
              }}
            >
              <AccountCircle />
            </IconButton>
          </Box>
        )}

        {/* Routes */}
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/recommendations" element={<RecommendationPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/login" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route
                path="/login"
                element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
              />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
