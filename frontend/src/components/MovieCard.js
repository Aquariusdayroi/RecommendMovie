import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function MovieCard({ movie }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        cursor: "pointer", // Thêm con trỏ để chỉ ra rằng thẻ có thể nhấp
        margin: "15px",
        width: 170,
        height: 300, // Chiều cao cố định để tránh giãn nở
        backgroundColor: "#2b2b2b",
        color: "white",
        transition: "transform 0.2s ease, background-color 0.2s ease",
        zIndex: 2, // Đảm bảo không có lớp nào chồng lên
        "&:hover": {
          transform: "scale(1.05)",
          backgroundColor: "#3a3a3a",
        },
      }}
    >
      {!imageLoaded && (
        <Skeleton variant="rectangular" width={170} height={225} />
      )}
      <CardMedia
        component="img"
        height="225"
        image={movie.poster_url}
        alt={movie.title}
        onLoad={() => setImageLoaded(true)}
        sx={{
          display: imageLoaded ? "block" : "none", // Hiển thị ảnh khi đã load
          width: "100%",
          objectFit: "cover",
        }}
      />
      <CardContent sx={{ padding: "8px", textAlign: "center" }}>
        <Typography variant="body2" component="div" noWrap>
          {movie.title}
        </Typography>
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ color: "gray" }}
        >
          {movie.release_date}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default MovieCard;
