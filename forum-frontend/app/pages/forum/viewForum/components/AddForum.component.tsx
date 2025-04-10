"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import toast from "react-hot-toast";

import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import {
  useAddForumMutation,
  useUpdateForumMutation,
} from "@/app/redux/reducer/forum.api";
import { FormDataType, useSchema } from "./forum.config";
import { LoadingButton } from "@mui/lab";
import { Forum } from "@/app/types/forum.type";

type Props = {
  open: boolean;
  onClose: () => void;
  forum?: Forum;
};

export default function AddForumDialog({ open, onClose, forum }: Props) {
  const [addForum] = useAddForumMutation();
  const [updateForum] = useUpdateForumMutation();

  const {
    handleSubmit,
    reset,
    register,
    formState: { isSubmitting, errors },
  } = useForm<FormDataType>({
    resolver: yupResolver(useSchema()),
  });

  useEffect(() => {
    if (forum) {
      reset({
        title: forum.title,
        description: forum.description,
        tags: forum.tags || "",
      });
    } else {
      reset({
        title: "",
        description: "",
        tags: " ",
      });
    }
  }, [forum, reset]);

  const onSubmit: SubmitHandler<FormDataType> = async (data) => {
    try {
      const payload = {
        ...data,
        tags: data.tags?.trim() || undefined,
      };

      if (forum) {
        await updateForum({ id: forum.id, data: payload }).unwrap();
        toast.success("Forum updated successfully");
      } else {
        await addForum(payload).unwrap();
        toast.success("Forum created successfully");
      }

      reset();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        (forum ? "Forum update failed" : "Forum creation failed");
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{forum ? "Edit Forum" : "Add Forum"}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Title"
            margin="dense"
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <TextField
            fullWidth
            label="Description"
            margin="dense"
            multiline
            minRows={3}
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
          <TextField
            fullWidth
            label="Tags"
            margin="dense"
            {...register("tags")}
            error={!!errors.tags}
            helperText={errors.tags?.message}
          />
          <DialogActions sx={{ mt: 2 }}>
            <Button onClick={onClose}>Cancel</Button>
            <LoadingButton
              id="submit"
              loading={isSubmitting}
              type="submit"
              variant="contained"
            >
              {forum ? "Update" : "Add"}
            </LoadingButton>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
