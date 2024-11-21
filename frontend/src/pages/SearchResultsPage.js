import React, { useState } from "react";
import { Box, Typography, Grid, Pagination } from "@mui/material";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import MovieCard from "../components/MovieCard";

// Styled components
const SearchContainer = styled(Box)`
  padding: 3rem;
  background-color: #181818;
  color: white;
  min-height: 100vh;
`;

const NoResultsContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: #ccc;
`;

function SearchResultsPage() {
  const location = useLocation();
  const { searchQuery, searchResults } = location.state || {};
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Chia kết quả thành từng trang
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <SearchContainer>
      {/* Tiêu đề */}
      <Typography variant="h5" sx={{ color: "#fff", mb: 4, textAlign: "center" }}>
        {`Search Results for "${searchQuery}"`}
      </Typography>

      {searchResults && searchResults.length > 0 ? (
        <>
          {/* Grid Layout */}
          <Grid container spacing={3}>
            {paginatedResults.map((movie) => (
              <Grid item xs={6} sm={4} md={3} key={movie.id}>
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <Pagination
              count={Math.ceil(searchResults.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      ) : (
        <NoResultsContainer>
          <Typography variant="h6" sx={{ mb: 2 }}>
            No movies found for "{searchQuery}".
          </Typography>
          <Typography variant="body2">
            Try searching with different keywords.
          </Typography>
        </NoResultsContainer>
      )}
    </SearchContainer>
  );
}

export default SearchResultsPage;
