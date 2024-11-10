// RecommendationPage.js
import React, { useState } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import MovieCard from "../components/MovieCard";
import axios from "axios";

function RecommendationPage() {
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/recommendations/");
      setRecommendedMovies(response.data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: "#181818", color: "white" }}>
      <Typography variant="h6" gutterBottom>
        Recommendations for You
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={fetchRecommendations}
        disabled={loading}
      >
        {loading ? "Loading..." : "Get Recommendations"}
      </Button>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {recommendedMovies.map((movie) => (
          <Grid item key={movie.id} xs={12} sm={6} md={4}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default RecommendationPage;
