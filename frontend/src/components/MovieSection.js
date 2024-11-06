import React from "react";
import { Box, Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import MovieCard from "./MovieCard";

function MovieSection({ title }) {
  const movies = [
    {
      id: 1,
      title: "Big Hero 6",
      release_date: "2014",
      poster_url: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      title: "Girls",
      release_date: "Iowa S4:E1",
      poster_url: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      title: "Key & Peele",
      release_date: "Alien Imposters",
      poster_url: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      title: "Movie 4",
      release_date: "2020",
      poster_url: "https://via.placeholder.com/150",
    },
    {
      id: 5,
      title: "Movie 5",
      release_date: "2021",
      poster_url: "https://via.placeholder.com/150",
    },
    {
      id: 6,
      title: "Movie 6",
      release_date: "2022",
      poster_url: "https://via.placeholder.com/150",
    },
    {
      id: 7,
      title: "Movie 7",
      release_date: "2023",
      poster_url: "https://via.placeholder.com/150",
    },
    {
      id: 8,
      title: "Movie 7",
      release_date: "2023",
      poster_url: "https://via.placeholder.com/150",
    },
    {
      id: 9,
      title: "Movie 7",
      release_date: "2023",
      poster_url: "https://via.placeholder.com/150",
    },
    {
      id: 10,
      title: "Movie 7",
      release_date: "2023",
      poster_url: "https://via.placeholder.com/150",
    },
  ];

  // Tạo các slide, mỗi slide chứa tối đa 5 phim
  const slides = [];
  for (let i = 0; i < movies.length; i += 5) {
    slides.push(movies.slice(i, i + 5));
  }

  return (
    <Box sx={{ marginBottom: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
        {title}
      </Typography>

      <Carousel
        navButtonsAlwaysVisible // Hiển thị nút điều hướng trái/phải
        animation="slide" // Kiểu chuyển đổi slide
        indicators={false} // Ẩn các chỉ số slide ở dưới cùng
      >
        {slides.map((slide, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              paddingBottom: 2,
            }}
          >
            {slide.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </Box>
        ))}
      </Carousel>
    </Box>
  );
}

export default MovieSection;
