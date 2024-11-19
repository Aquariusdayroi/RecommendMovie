import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Avatar,
    Grid,
    Paper,
    Button,
    Card,
    CardMedia,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
  } from "@mui/material";
  
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserProfilePage() {
  const [user, setUser] = useState({});
  const [editUser, setEditUser] = useState({});
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userResponse = await axios.get("/api/user/profile/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setUser(userResponse.data);
        setEditUser(userResponse.data);

        const moviesResponse = await axios.get("/api/user/movies/watched/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setWatchedMovies(moviesResponse.data);
      } catch (error) {
        console.error("Error fetching user profile or movies:", error);
      }
    };

    fetchUserProfile();
  }, [token]);

  const handleEditOpen = () => {
    setIsEditing(true);
  };

  const handleEditClose = () => {
    setIsEditing(false);
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put("/api/user/profile/", editUser, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setUser(editUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setEditUser({ ...editUser, [field]: value });
  };

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "linear-gradient(to bottom, #141414, #181818)",
        color: "white",
        minHeight: "100vh",
      }}
    >
      {/* Header thông tin người dùng */}
      <Paper
        sx={{
          padding: 3,
          marginBottom: 4,
          backgroundColor: "#1e1e1e",
          color: "white",
          textAlign: "center",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}
      >
        <Avatar
          alt={user.username}
          src={user.avatar || ""}
          sx={{
            width: 120,
            height: 120,
            margin: "0 auto",
            marginBottom: 2,
            border: "3px solid white",
          }}
        />
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#f3f3f3" }}>
          {user.username || "User Name"}
        </Typography>
        <Typography sx={{ color: "#ccc", marginBottom: 1 }}>
          Email: {user.email || "user@example.com"}
        </Typography>
        <Typography sx={{ color: "#ccc", marginBottom: 1 }}>
          Nghề nghiệp: {user.occupation || "Chưa cập nhật"}
        </Typography>
        <Typography sx={{ color: "#ccc" }}>
          Giới tính: {user.gender || "Chưa cập nhật"}
        </Typography>
        <Button
          variant="contained"
          sx={{
            marginTop: 2,
            backgroundColor: "#e50914",
            "&:hover": { backgroundColor: "#f40612" },
          }}
          onClick={handleEditOpen}
        >
          Chỉnh sửa hồ sơ
        </Button>
      </Paper>

      {/* Danh sách phim đã xem */}
      <Typography
        variant="h5"
        sx={{
          marginBottom: 3,
          fontWeight: "bold",
          borderBottom: "2px solid #f3f3f3",
          display: "inline-block",
          color: "#f3f3f3",
        }}
      >
        Phim Đã Xem
      </Typography>
      <Grid container spacing={2}>
        {watchedMovies.length > 0 ? (
          watchedMovies.map((movie) => (
            <Grid
              item
              xs={6}
              sm={4}
              md={3}
              lg={2}
              key={movie.id}
              onClick={() => navigate(`/movie/${movie.id}`)}
              sx={{
                cursor: "pointer",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
                },
              }}
            >
              <Card
                sx={{
                  backgroundColor: "#1e1e1e",
                  color: "white",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <CardMedia
                  component="img"
                  height="250"
                  image={movie.poster_url}
                  alt={movie.title}
                />
                <CardContent>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      color: "#f3f3f3",
                    }}
                  >
                    {movie.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ textAlign: "center", color: "#ccc" }}
                  >
                    Đánh giá: {movie.rating || "Chưa có"} ⭐
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>Chưa có phim nào được xem.</Typography>
        )}
      </Grid>

      {/* Dialog chỉnh sửa thông tin */}
      <Dialog open={isEditing} onClose={handleEditClose}>
        <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
        <DialogContent>
            <TextField
                fullWidth
                margin="dense"
                label="Tên người dùng"
                value={editUser.username || ""}
                onChange={(e) => handleInputChange("username", e.target.value)}
            />
            <TextField
                fullWidth
                margin="dense"
                label="Email"
                value={editUser.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
            />
            <TextField
                fullWidth
                margin="dense"
                label="Nghề nghiệp"
                value={editUser.occupation || ""}
                onChange={(e) => handleInputChange("occupation", e.target.value)}
            />
            <Select
                fullWidth
                value={editUser.gender || ""}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                displayEmpty
                sx={{ marginTop: 2 }}
            >
                <MenuItem value="">
                <em>Other</em>
                </MenuItem>
                <MenuItem value="Boy">Boy</MenuItem>
                <MenuItem value="Girl">Girl</MenuItem>
            </Select>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleEditClose} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSaveChanges} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserProfilePage;
