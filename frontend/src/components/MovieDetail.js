import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Grid } from "@mui/material";
import styled from "styled-components";

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  filter: blur(25px);
  z-index: 0;
  opacity: 0.5;
  pointer-events: none;
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
`;

const ContentBox = styled(Box)`
  max-width: 1000px;
  background: linear-gradient(to right, rgba(30, 30, 30, 0.9), rgba(10, 10, 10, 0.8));
  border-radius: 15px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.8);
  color: white;
  display: flex;
  gap: 24px;
  padding: 32px;
  align-items: flex-start;
  animation: fadeIn 1s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const PosterImage = styled.img`
  width: 100%;
  max-width: 250px;
  border-radius: 10px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.6);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const MovieInfo = styled.div`
  flex: 1;
  padding-left: 16px;
`;

const StyledTitle = styled(Typography)`
  font-size: 2.6rem;
  font-weight: 700;
  color: #ffd700; /* Màu vàng nổi bật */
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.7);
  margin-bottom: 16px;
  animation: slideIn 0.6s ease-in-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const StyledOverview = styled(Typography)`
  font-size: 1.15rem;
  line-height: 1.6;
  color: #e0e0e0;
  margin-bottom: 24px;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.6);
`;

const InfoLabel = styled.span`
  color: #ffd700;
  font-weight: bold;
  font-size: 1.1rem;
`;

const InfoText = styled(Typography)`
  color: #b0b0b0;
  font-size: 1rem;
  margin-bottom: 8px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  transition: color 0.2s ease;

  &:hover {
    color: #ffdd57;
  }
`;

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`/api/movies/${id}/`);
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovie();
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  return (
    <>
      <BackgroundContainer
        style={{ backgroundImage: `url(${movie.poster_url})` }}
      />

      <ContentContainer>
        <ContentBox>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <PosterImage src={movie.poster_url} alt={movie.title} />
            </Grid>

            <Grid item xs={12} sm={8}>
              <MovieInfo>
                <StyledTitle>
                  {movie.title} ({movie.release_date
                    ? movie.release_date.slice(0, 4)
                    : "N/A"})
                </StyledTitle>
                <StyledOverview>
                  {movie.overview || "No overview available."}
                </StyledOverview>

                <InfoText>
                  <InfoLabel>Runtime:</InfoLabel>{" "}
                  {movie.runtime ? `${movie.runtime} mins` : "N/A"}
                </InfoText>
                <InfoText>
                  <InfoLabel>Director:</InfoLabel> {movie.director || "Unknown"}
                </InfoText>
                <InfoText>
                  <InfoLabel>Cast:</InfoLabel> {movie.cast || "Unknown"}
                </InfoText>
              </MovieInfo>
            </Grid>
          </Grid>
        </ContentBox>
      </ContentContainer>
    </>
  );
}

export default MovieDetail;
