import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress, Button, Card, CardMedia, CardContent, Typography, Grid } from '@mui/material';
import styled from 'styled-components';

const MovieCard = styled(Card)`
  position: relative;
  background-color: #222;
  color: white;
  overflow: hidden;
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.8);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 20px 40px rgba(0, 0, 0, 1);
  }
`;

const MovieCardMedia = styled(CardMedia)`
  filter: brightness(0.8);
  transition: filter 0.3s ease;
  ${MovieCard}:hover & {
    filter: brightness(1);
  }
`;

const RecommendationPage = () => {
  const [displayedMovies, setDisplayedMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Gọi API để lấy gợi ý phim
  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/recommendations/');
      const movies = response.data;
      setDisplayedMovies(movies); // Hiển thị 20 phim mới từ cache
    } catch (error) {
      console.error("Lỗi khi lấy khuyến nghị:", error);
    } finally {
      setLoading(false);
    }
  };

  // Chuyển đến trang chi tiết phim
  const viewMovieDetail = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div style={{ padding: '40px', color: 'white', textAlign: 'center', backgroundColor: '#111' }}>
      <Typography variant="h4" gutterBottom style={{ color: '#FFD700', marginBottom: '20px' }}>
        Gợi ý phim cho bạn
      </Typography>

      {loading ? (
        <div>
          <CircularProgress />
          <Typography>Đang tải gợi ý...</Typography>
        </div>
      ) : (
        <Grid container spacing={3} justifyContent="center" style={{ marginTop: '30px' }}>
          {displayedMovies.map((movie) => (
            <Grid item xs={12} sm={6} md={3} key={movie.id}>
              <MovieCard onClick={() => viewMovieDetail(movie.id)}>
                <MovieCardMedia
                  component="img"
                  height="350"
                  image={movie.poster_url || 'default_poster_url.jpg'}
                  alt={movie.title}
                />
                <CardContent>
                  <Typography variant="h6" style={{ color: '#FFD700' }}>{movie.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {movie.overview ? movie.overview.substring(0, 100) : "Nội dung không có sẵn"}...
                  </Typography>
                </CardContent>
              </MovieCard>
            </Grid>
          ))}
        </Grid>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={fetchRecommendations}
        disabled={loading}
        style={{ marginTop: '40px', backgroundColor: '#FFD700', color: 'black' }}
      >
        {loading ? "Đang tải..." : "Gợi ý phim"}
      </Button>
    </div>
  );
};

export default RecommendationPage;
