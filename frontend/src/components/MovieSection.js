import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import MovieCard from "./MovieCard";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LazyLoad from "react-lazyload";

function MovieSection({ title }) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1); // Trang hiện tại
  const [hasMore, setHasMore] = useState(true); // Kiểm tra còn dữ liệu không

  const fetchMovies = async (page) => {
    try {
      const response = await fetch(`/api/movies/?page=${page}`);
      const data = await response.json();
      if (data.results) {
        setMovies((prevMovies) => [...prevMovies, ...data.results]);
        setHasMore(data.next !== null);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies(page); // Gọi API với trang hiện tại
  }, [page]);

  const loadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1); // Tăng số trang để gọi thêm dữ liệu
    }
  };

  const slides = [];
  for (let i = 0; i < movies.length; i += 7) {
    slides.push(movies.slice(i, i + 7));
  }

  return (
    <Box sx={{ marginBottom: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
        {title}
      </Typography>

      <Carousel
        navButtonsAlwaysVisible
        animation="fade"
        indicators={false}
        interval={5000} // Tăng thời gian chuyển đổi (5000ms = 5 giây)
        NextIcon={<ArrowForwardIosIcon />}
        PrevIcon={<ArrowBackIosNewIcon />}
        sx={{ width: "100%", overflow: "visible" }}
        onChange={() => loadMore()} // Gọi loadMore khi chuyển slide
      >
        {slides.map((slide, index) => (
          <LazyLoad key={index} offset={300} once>
            <Box
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
          </LazyLoad>
        ))}
      </Carousel>
    </Box>
  );
}

export default MovieSection;
