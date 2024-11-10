import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link, // Thêm Link vào đây
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import MovieDetail from "./components/MovieDetail";
import Register from "./components/Register";
import LoginPage from "./pages/LoginPage";
import RecommendationPage from "./pages/RecommendationPage";
import {
  CssBaseline,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Home,
  Movie,
  MusicNote,
  Tv,
  Menu,
  ExitToApp,
} from "@mui/icons-material";

const sidebarItems = [
  { text: "Channels", icon: <Home />, path: "/" },
  { text: "Playlists", icon: <Movie /> },
  { text: "Movies", icon: <Movie />, path: "/recommendations" },
  { text: "Music", icon: <MusicNote /> },
  { text: "TV Shows", icon: <Tv /> },
];

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Kiểm tra token trong localStorage khi ứng dụng tải lại
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      axios.defaults.headers.common["Authorization"] = `Token ${token}`;
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Xử lý đăng nhập thành công
  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Token ${token}`;
    setIsAuthenticated(true);
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* Sidebar chỉ hiện khi người dùng đã đăng nhập */}
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
                    component={item.path ? Link : "div"}
                    to={item.path || "#"}
                  >
                    <ListItemIcon sx={{ color: "white" }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                ))}
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

        <Box
          sx={{
            flexGrow: 1,
            padding: 3,
            backgroundColor: "#181818",
            color: "white",
            minHeight: "100vh",
          }}
        >
          {isAuthenticated && (
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
          )}
          <Routes>
            {isAuthenticated ? (
              <>
                <Route path="/" element={<HomePage />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="/recommendations" element={<RecommendationPage />} />
                <Route path="/login" element={<Navigate to="/" />} />
              </>
            ) : (
              <>
                <Route
                  path="/login"
                  element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
                />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            )}
            <Route path="/register" element={<Register />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
