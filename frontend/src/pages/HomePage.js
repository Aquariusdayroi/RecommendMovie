import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MovieSection from "../components/MovieSection";
import SearchBar from "../components/SearchBar";
import axios from "axios";

function HomePage() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]); // Movies mặc định

  // Hàm gọi API để lấy phim mặc định
  const fetchMovies = async (page) => {
    try {
      const response = await axios.get(`/api/movies/?page=${page}`, {
        headers: { Authorization: `Token ${token}` },
      });
      return response.data.results || [];
    } catch (error) {
      console.error("Error fetching movies:", error);
      return [];
    }
  };

  // Hàm tìm kiếm phim
  const handleSearch = async (query) => {
    if (!query.trim()) return;
  
    try {
      const response = await axios.get(`/api/search/?query=${query.trim()}`, {
        headers: { Authorization: `Token ${token}` },
      });
  
      navigate("/search-results", {
        state: {
          searchQuery: query.trim(), // Truyền query
          searchResults: response.data.results || [],
        },
      });
    } catch (error) {
      console.error("Error fetching search results:", error);
      navigate("/search-results", {
        state: {
          searchQuery: query.trim(),
          searchResults: [], // Truyền rỗng nếu có lỗi
        },
      });
    }
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: "#181818", color: "white", minHeight: "100vh" }}>
      <Typography variant="h6" gutterBottom sx={{ color: "white", mb: 3 }}>
        Movie Recommendation
      </Typography>
      <SearchBar onSearch={handleSearch} />
      <MovieSection title="On Deck" fetchMovies={fetchMovies} />
    </Box>
  );
}

export default HomePage;
