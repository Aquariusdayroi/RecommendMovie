import React, { useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";

function SearchBar({ onSearch }) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const trimmedValue = inputValue.trim();
      if (trimmedValue) {
        onSearch(trimmedValue); // Gửi từ khóa hợp lệ đến hàm tìm kiếm
      }
    }
  };

  return (
    <TextField
      placeholder="Search movies..."
      variant="outlined"
      fullWidth
      sx={{ marginBottom: 4, backgroundColor: "white" }}
      value={inputValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
    />
  );
}

export default SearchBar;
