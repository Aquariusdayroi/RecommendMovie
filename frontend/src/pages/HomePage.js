import React from "react";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import MovieSection from "../components/MovieSection";
import axios from "axios";

function HomePage() {
  const token = localStorage.getItem("token");

  // Hàm gọi API
  const fetchMovies = async (page) => {
    try {
      const response = await axios.get(`/api/movies/?page=${page}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return response.data.results; // Trả về danh sách phim
    } catch (error) {
      console.error("Error fetching movies:", error);
      return [];
    }
  };

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: "#181818",
        color: "white",
        minHeight: "100vh",
      }}
    >
      {/* Tiêu đề */}
      <Typography variant="h6" gutterBottom sx={{ color: "white", mb: 3 }}>
        Movie Recommendation
      </Typography>

      {/* Thanh tìm kiếm */}
      <TextField
        placeholder="Search movies..."
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 4, backgroundColor: "white" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      {/* Movie Sections */}
      <MovieSection title="On Deck" fetchMovies={fetchMovies} />
    </Box>
  );
}

export default HomePage;
