import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Grid, Button, TextField, Rating } from "@mui/material";
import styled from "styled-components";
import axios from "axios";
import Comments from "./Comment";

// Styled components
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
  position: relative;
  z-index: 1;
`;

const ContentBox = styled(Box)`
  max-width: 1000px;
  background: linear-gradient(to right, rgba(30, 30, 30, 0.9), rgba(10, 10, 10, 0.8));
  border-radius: 15px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.8);
  color: white;
  padding: 32px;
  animation: fadeIn 1s ease-in-out;
`;

const PosterImage = styled.img`
  width: 100%;
  max-width: 250px;
  border-radius: 10px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.6);
`;

const CommentsContainer = styled(Box)`
  margin-top: 16px;
  padding: 16px;
  background: rgba(50, 50, 50, 0.8);
  border-radius: 8px;
`;

const CommentListContainer = styled(Box)`
  max-height: 300px; /* Giới hạn chiều cao */
  overflow-y: auto; /* Thêm thanh cuộn */
  margin-bottom: 16px; /* Tạo khoảng cách với phần nhập comment */
  scrollbar-width: thin; /* Độ dày thanh cuộn (Firefox) */
  scrollbar-color: lightgray rgba(30, 30, 30, 0.8); /* Màu thanh cuộn (Firefox) */

  &::-webkit-scrollbar {
    width: 8px; /* Độ dày thanh cuộn (Webkit) */
  }
  &::-webkit-scrollbar-track {
    background: rgba(30, 30, 30, 0.8);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: lightgray;
    border-radius: 10px;
    border: 2px solid rgba(30, 30, 30, 0.8);
  }
`;

// Component
function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Fetch movie details and comments
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`/api/movies/${id}/detail`, {
          headers: { Authorization: `Token ${token}` },
        });
        setMovie(response.data);
        setRating(response.data.user_rating || 0);
        setAverageRating(response.data.average_rating || 0);
      } catch (error) {
        console.error("Error fetching movie details:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/movies/${id}/comments/`, {
          headers: { Authorization: `Token ${token}` },
        });
        console.log("Comments Response:", response.data);
    
        // Sắp xếp comments theo timestamp giảm dần
        const sortedComments = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setComments(sortedComments);
      } catch (error) {
        console.error("Error fetching comments:", error.response?.data || error.message);
      }
    };
    

    fetchMovie();
    fetchComments();
  }, [id, token]);

  const handleRatingChange = async (value) => {
    try {
      const response = await axios.post(
        `/api/movies/${id}/rate/`,
        { rating: value },
        { headers: { Authorization: `Token ${token}` } }
      );
      setRating(value);
      setAverageRating(response.data.average_rating || 0);
    } catch (error) {
      console.error("Error rating movie:", error.response?.data || error.message);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
  
    try {
      const response = await axios.post(
        `/api/movies/${id}/comments/`,
        { content: newComment },
        { headers: { Authorization: `Token ${token}` } }
      );
  
      // Thêm comment mới vào đầu danh sách
      setComments((prevComments) => [response.data, ...prevComments]);
      setNewComment(""); // Reset input field
    } catch (error) {
      console.error("Error adding comment:", error.response?.data || error.message);
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (!movie) return <p>Movie not found!</p>;

  return (
    <>
      <BackgroundContainer style={{ backgroundImage: `url(${movie.poster_url})` }} />
      <ContentContainer>
        <ContentBox>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <PosterImage src={movie.poster_url} alt={movie.title} />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Box>
                <Typography variant="h4" color="#ffd700" gutterBottom>
                  {movie.title} ({movie.release_date?.slice(0, 4) || "N/A"})
                </Typography>
                <Typography variant="body1" paragraph>
                  {movie.overview || "No overview available."}
                </Typography>
                <Typography variant="body2" color="#b0b0b0" paragraph>
                  <strong>Runtime:</strong> {movie.runtime || "N/A"} mins
                </Typography>
                <Typography variant="body2" color="#b0b0b0" paragraph>
                  <strong>Director:</strong> {movie.director || "Unknown"}
                </Typography>
                <Typography variant="body2" color="#b0b0b0" paragraph>
                  <strong>Cast:</strong> {movie.cast || "Unknown"}
                </Typography>

                <Box sx={{ mt: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body1" color="#ffd700" sx={{ mr: 1 }}>
                      Rate this movie:
                    </Typography>
                    <Rating
                      name="movie-rating"
                      value={rating}
                      onChange={(event, newValue) => handleRatingChange(newValue)}
                    />
                    <Typography variant="body2" color="#b0b0b0" sx={{ ml: 1 }}>
                      (Avg: {averageRating.toFixed(1)})
                    </Typography>
                  </Box>
                  <Button sx={{ color: "#ffd700" }} onClick={() => setShowComments(!showComments)}>
                    {showComments ? "Hide Comments" : "Show Comments"}
                  </Button>
                </Box>

                {showComments && (
                  <CommentsContainer>
                    <CommentListContainer>
                      <Comments comments={comments} />
                    </CommentListContainer>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      sx={{ mt: 2, backgroundColor: "#fff", borderRadius: 1 }}
                    />
                    <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleAddComment}>
                      Submit Comment
                    </Button>
                  </CommentsContainer>
                )}
              </Box>
            </Grid>
          </Grid>
        </ContentBox>
      </ContentContainer>
    </>
  );
}

export default MovieDetail;
