"use client";

import {
  Box,
  Button,
  CircularProgress,
  Alert,
  Typography,
  Stack,
  Paper,
  Divider,
  TextField,
} from "@mui/material";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import { useState } from "react";
import toast from "react-hot-toast";

import AddForumDialog from "./components/AddForum.component";
import {
  useGetForumsQuery,
  useDeleteForumMutation,
} from "@/app/redux/reducer/forum.api";
import {
  useDeleteCommentMutation,
  useCreateCommentMutation,
} from "@/app/redux/reducer/comment.api";
import { getCurrentUserId } from "@/app/utils/auth.util";
import { Forum } from "@/app/types/forum.type";
import { Comments } from "@/app/types/comment.type";

const ViewForum = () => {
   // Fetch all forums using RTK Query
   const { data, error, isLoading } = useGetForumsQuery();

   // Mutations for deleting forum and comment, creating comment
   const [deleteForum] = useDeleteForumMutation();
   const [deleteComment] = useDeleteCommentMutation();
   const [createComment, { isLoading: isCommenting }] = useCreateCommentMutation();
 
   // UI States
   const [openDialog, setOpenDialog] = useState(false);
   const [editingForum, setEditingForum] = useState<Forum | null>(null);
   const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
 
   // Current logged-in user
   const currentUserId = getCurrentUserId();
 
   // Open add/edit forum dialog
   const handleAddForum = () => {
     setEditingForum(null);
     setOpenDialog(true);
   };
 
   // Set selected forum for editing
   const handleEditForum = (forum: Forum) => {
     setEditingForum(forum);
     setOpenDialog(true);
   };
 
   // Close forum dialog
   const handleCloseDialog = () => {
     setOpenDialog(false);
   };
 
   // Handle deleting a forum
   const handleDeleteForumById = async (id: number) => {
     try {
       const res = await deleteForum(id).unwrap();
       toast.success(res.message);
     } catch (error: unknown) {
       const msg =
         (error as { data?: { message?: string } })?.data?.message ||
         "Only author of the forum can delete it";
       toast.error(msg);
     }
   };
 
   // Handle comment input change
   const handleCommentInputChange = (forumId: number, value: string) => {
     setCommentInputs((prev) => ({ ...prev, [forumId]: value }));
   };
 
   // Handle adding a comment
   const handleAddComment = async (forumId: number) => {
     const content = commentInputs[forumId];
     if (!content?.trim()) {
       toast.error("Comment cannot be empty");
       return;
     }
 
     try {
       await createComment({ forumId, content }).unwrap();
       toast.success("Comment posted");
       setCommentInputs((prev) => ({ ...prev, [forumId]: "" }));
     } catch (error: unknown) {
       const msg =
         (error as { data?: { message?: string } })?.data?.message ||
         "Failed to post comment";
       toast.error(msg);
     }
   };
 
   // Handle deleting a comment
   const handleDeleteCommentById = async (commentId: number) => {
     try {
       const res = await deleteComment(commentId).unwrap();
       toast.success(res.message);
     } catch (error: unknown) {
       const msg =
         (error as { data?: { message?: string } })?.data?.message ||
         "Failed to delete comment";
       toast.error(msg);
     }
   };
 
   // Show loading indicator while fetching data
   if (isLoading) {
     return (
       <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
         <CircularProgress />
       </Box>
     );
   }
 
   // Show error message if API fails
   if (error) {
     return (
       <Box sx={{ p: 3 }}>
         <Alert severity="error">Error loading forums</Alert>
       </Box>
     );
   }

  return (
    <Box p={3}>
      {/* Header */}
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Forum Feed</Typography>
        <Button variant="contained" onClick={handleAddForum}>
          Add Forum
        </Button>
      </Stack>

      {/* Forums List */}
      <Stack spacing={3} pt={2}>
        {Array.isArray(data) && data.length > 0 ? (
          data.map((forum) => (
            <Paper key={forum.id} elevation={3} sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{forum.title}</Typography>
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" onClick={() => handleEditForum(forum)}>
                    <MdModeEditOutline />
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleDeleteForumById(forum.id)}>
                    <MdDelete />
                  </Button>
                </Stack>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {forum.description}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                Author: {forum.author?.name || "N/A"}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Comments */}
              <Typography variant="subtitle1">Comments:</Typography>
              <Stack spacing={1} mt={1}>
                {forum.comments?.map((comment: Comments) => (
                  <Box key={comment.id} sx={{ p: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">{comment.content}</Typography>
                      {comment.authorId === Number(currentUserId) && (
                        <Button size="small" color="error" onClick={() => handleDeleteCommentById(comment.id)}>
                          <MdDelete size={16} />
                        </Button>
                      )}
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {comment.author?.name || "Anonymous"}
                    </Typography>
                  </Box>
                ))}

                {/* Add Comment */}
                <Box display="flex" gap={1} mt={1}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Add a comment..."
                    value={commentInputs[forum.id] || ""}
                    onChange={(e) => handleCommentInputChange(forum.id, e.target.value)}
                    disabled={isCommenting}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleAddComment(forum.id)}
                    disabled={isCommenting}
                  >
                    Post
                  </Button>
                </Box>
              </Stack>
            </Paper>
          ))
        ) : (
          <Typography>No forums found.</Typography>
        )}
      </Stack>

      {/* Add/Edit Forum Dialog */}
      <AddForumDialog
        open={openDialog}
        onClose={handleCloseDialog}
        forum={editingForum || undefined}
      />
    </Box>
  );
};

export default ViewForum;
