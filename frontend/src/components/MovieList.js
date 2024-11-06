import React from 'react';
import { Grid } from '@mui/material';
import MovieCard from './MovieCard';

function MovieList() {
  // Dữ liệu giả cho phim
  const fakeMovies = [
    {
      id: 1,
      title: "Inception",
      release_date: "2010-07-16",
      genre: "Sci-Fi",
      poster_url: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      title: "The Dark Knight",
      release_date: "2008-07-18",
      genre: "Action",
      poster_url: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      title: "Interstellar",
      release_date: "2014-11-07",
      genre: "Adventure",
      poster_url: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      title: "Avengers: Endgame",
      release_date: "2019-04-26",
      genre: "Action",
      poster_url: "https://via.placeholder.com/150",
    },
    // Thêm nhiều dữ liệu giả hơn nếu cần
  ];

  return (
    <Grid container spacing={2}>
      {fakeMovies.map(movie => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
          <MovieCard movie={movie} />
        </Grid>
      ))}
    </Grid>
  );
}

export default MovieList;
