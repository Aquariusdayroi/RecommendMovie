import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import MovieSection from "../components/MovieSection";
import axios from "axios";

function HomePage() {
  const [movies, setMovies] = useState([]);
  const token = localStorage.getItem("token"); // Lấy token từ localStorage

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("/api/movies/", {
          headers: {
            Authorization: `Token ${token}`, // Thêm token vào headers
          },
        });
        setMovies(response.data.results); // Lưu trữ danh sách phim trong state
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies(); // Gọi hàm lấy phim khi component được render lần đầu
  }, [token]);

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: "#181818",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: "white", mb: 2 }}>
        Movie Recommendation
      </Typography>
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

      {/* Truyền dữ liệu phim vào MovieSection */}
      <MovieSection title="On Deck" movies={movies} />
      <MovieSection title="Recently Added" movies={movies} />
      <MovieSection title="Watch Later" movies={movies} />
    </Box>
  );
}

export default HomePage;
