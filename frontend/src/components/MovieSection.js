import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import MovieCard from "./MovieCard";

function MovieSection({ title, fetchMovies }) {
  const [movies, setMovies] = useState([]); // Danh sách phim
  const [page, setPage] = useState(1); // Trang hiện tại
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [hasMore, setHasMore] = useState(true); // Còn phim để tải không

  // Gọi API để lấy phim
  const loadMovies = async () => {
    if (!hasMore || loading) return; // Dừng nếu đang tải hoặc không còn phim
    setLoading(true);

    const newMovies = await fetchMovies(page); // Gọi hàm API từ prop
    if (newMovies.length > 0) {
      setMovies((prev) => [...prev, ...newMovies]); // Thêm phim mới vào danh sách
      setPage((prev) => prev + 1); // Tăng số trang
    } else {
      setHasMore(false); // Nếu không có phim mới, dừng tải
    }

    setLoading(false);
  };

  // Gọi API lần đầu khi component được mount
  useEffect(() => {
    loadMovies();
  }, []);

  // Chia phim thành các nhóm (chunk) để hiển thị
  const movieChunks = Array.from({ length: Math.ceil(movies.length / 7) }).map((_, index) =>
    movies.slice(index * 7, index * 7 + 7)
  );

  // Gọi thêm API khi đến slide cuối
  const handleSlideChange = (index) => {
    if (index === movieChunks.length - 1 && hasMore) {
      loadMovies();
    }
  };

  return (
    <Box sx={{ marginBottom: 4 }}>
      {/* Tiêu đề */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: "white",
          marginLeft: 2,
          fontWeight: "bold",
        }}
      >
        {title}
      </Typography>

      {/* Carousel */}
      <Carousel
        navButtonsAlwaysVisible
        animation="fade" // Đổi thành fade để chuyển đổi nhẹ nhàng
        indicators={false}
        interval={5000}
        sx={{ width: "100%" }}
        onChange={handleSlideChange} // Gọi khi chuyển slide
      >
        {movieChunks.map((chunk, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              padding: 2,
            }}
          >
            {chunk.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </Box>
        ))}
      </Carousel>
    </Box>
  );
}

export default MovieSection;
