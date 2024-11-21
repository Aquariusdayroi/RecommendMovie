import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import styled from "styled-components";

// Styled components
const CommentContainer = styled(Box)`
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  padding: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const UserAvatar = styled(Avatar)`
  width: 40px;
  height: 40px;
  margin-right: 12px;
`;

const CommentContent = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const CommentsWrapper = styled(Box)`
  max-height: 300px; /* Giới hạn chiều cao danh sách comment */
  overflow-y: auto; /* Thêm thanh cuộn nếu vượt quá chiều cao */
  padding-right: 8px; /* Thêm khoảng trống để tránh tràn */
  scrollbar-width: thin; /* Thanh cuộn mỏng (Firefox) */
  scrollbar-color: lightgray rgba(30, 30, 30, 0.8); /* Màu sắc thanh cuộn (Firefox) */

  &::-webkit-scrollbar {
    width: 8px; /* Độ rộng của thanh cuộn */
  }

  &::-webkit-scrollbar-track {
    background: rgba(30, 30, 30, 0.8); /* Màu nền track */
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: lightgray; /* Màu thanh cuộn */
    border-radius: 10px;
    border: 2px solid rgba(30, 30, 30, 0.8); /* Viền thanh cuộn */
  }
`;

function Comments({ comments }) {
  // Kiểm tra `comments` có hợp lệ không
  if (!comments || !Array.isArray(comments)) {
    return (
      <Typography variant="body2" color="#b0b0b0" sx={{ mt: 2 }}>
        No comments yet.
      </Typography>
    );
  }

  return (
    <CommentsWrapper>
      {comments.map((comment, index) => (
        <CommentContainer key={index}>
          {/* Avatar mặc định */}
          <UserAvatar
            src={
              comment.avatar ||
              "https://via.placeholder.com/40" // URL ảnh mặc định
            }
          />
          <CommentContent>
            <Typography variant="body1" color="#ffd700">
              {comment.user || "Anonymous"}
            </Typography>
            <Typography variant="body2" color="#b0b0b0">
              {comment.content || "No content provided."}
            </Typography>
            <Typography variant="caption" color="#7f7f7f">
              {comment.timestamp
                ? new Date(comment.timestamp).toLocaleString()
                : "Unknown time"}
            </Typography>
          </CommentContent>
        </CommentContainer>
      ))}
    </CommentsWrapper>
  );
}

export default Comments;
