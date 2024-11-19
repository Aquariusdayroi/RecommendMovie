import React, { useState } from "react";
import { Card, CardMedia, CardContent, Typography, Skeleton } from "@mui/material";

function MovieCard({ movie }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleCardClick = () => {
    window.location.href = `/movie/${movie.id}`;
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        cursor: "pointer",
        margin: "15px",
        width: 170,
        height: 300, // Chiều cao cố định
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#2b2b2b",
        color: "white",
        transition: "transform 0.2s ease, background-color 0.2s ease",
        "&:hover": {
          transform: "scale(1.05)",
          backgroundColor: "#3a3a3a",
        },
      }}
    >
      {!imageLoaded && (
        <Skeleton
          variant="rectangular"
          width={170}
          height={225}
          sx={{ borderRadius: "8px" }}
        />
      )}
      <CardMedia
        component="img"
        height="225"
        image={movie.poster_url}
        alt={movie.title}
        onLoad={() => setImageLoaded(true)}
        sx={{
          display: imageLoaded ? "block" : "none",
          objectFit: "cover",
        }}
      />
      <CardContent sx={{ padding: "8px", textAlign: "center" }}>
        <Typography variant="body2" component="div" noWrap>
          {movie.title}
        </Typography>
        <Typography variant="caption" color="textSecondary" sx={{ color: "gray" }}>
          {movie.release_date}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default MovieCard;
