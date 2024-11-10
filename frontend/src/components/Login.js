// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Box, TextField, Button, Typography, Paper } from "@mui/material";

// function Login({ onLoginSuccess }) {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("/api/login/", { username, password });
//       localStorage.setItem("token", response.data.token);
//       setMessage("Login successful!");
//       onLoginSuccess(response.data.token);
//       navigate("/");
//     } catch (error) {
//       setMessage(error.response?.data?.error || "An error occurred.");
//     }
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         minHeight: "100vh",
//         backgroundColor: "#f0f2f5",
//       }}
//     >
//       <Paper
//         elevation={3}
//         sx={{
//           padding: 4,
//           maxWidth: 400,
//           width: "100%",
//           textAlign: "center",
//         }}
//       >
//         <Typography variant="h5" gutterBottom>
//           Login
//         </Typography>
//         <form onSubmit={handleLogin}>
//           <TextField
//             fullWidth
//             label="Username"
//             variant="outlined"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             margin="normal"
//           />
//           <TextField
//             fullWidth
//             type="password"
//             label="Password"
//             variant="outlined"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             margin="normal"
//           />
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             fullWidth
//             sx={{ mt: 2 }}
//           >
//             Login
//           </Button>
//           {message && (
//             <Typography color="error" sx={{ mt: 2 }}>
//               {message}
//             </Typography>
//           )}
//         </form>
//       </Paper>
//     </Box>
//   );
// }

// export default Login;
