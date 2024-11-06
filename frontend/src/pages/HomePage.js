import React from "react";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import MovieSection from "../components/MovieSection";

function HomePage() {
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
      <MovieSection title="On Deck" />
      <MovieSection title="Recently Added" />
      <MovieSection title="Watch Later" />
    </Box>
  );
}

export default HomePage;
