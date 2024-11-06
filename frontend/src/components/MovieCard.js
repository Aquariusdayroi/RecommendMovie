import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

function MovieCard({ movie }) {
  return (
    <Card
      sx={{
        margin: "15px",
        width: 170,
        backgroundColor: "#2b2b2b",
        color: "white",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.05)",
          backgroundColor: "#3a3a3a",
        },
      }}
    >
      <CardMedia
        component="img"
        height="180"
        image={movie.poster_url}
        alt={movie.title}
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
