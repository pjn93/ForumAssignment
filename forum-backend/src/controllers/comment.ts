import  { Request, Response } from 'express';
import { prismaClient } from '..';
import { AuthenticatedRequest } from '../middleware/auth';
import { Prisma } from '@prisma/client';

const sendResponse = (
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data?: any,
  error?: any
) => {
  res.status(status).json({
    success,
    message,
    data,
    error: process.env.NODE_ENV === 'development' ? error : undefined
  });
};


export const createComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { content } = req.body;
      const forumId = parseInt(req.params.forumId);
      const authorId = req.user?.id;

      // Validate inputs
      if (!authorId) {
        return sendResponse(res, 401, false, 'Unauthorized');
      }

      if (!content) {
        return sendResponse(res, 400, false, 'Content is required');
      }

      if (isNaN(forumId)) {
        return sendResponse(res, 400, false, 'Invalid forum ID');
      }

      // Verify user exists
      const userExists = await prismaClient.user.findUnique({
        where: { id: authorId },
        select: { id: true }
      });

      if (!userExists) {
        return sendResponse(res, 404, false, 'User not found');
      }

      // Verify forum exists
      const forumExists = await prismaClient.forum.findUnique({
        where: { id: forumId },
        select: { id: true }
      });

      if (!forumExists) {
        return sendResponse(res, 404, false, 'Forum not found');
      }

      // Create the comment with both relations
      const comment = await prismaClient.comment.create({
        data: {
          content,
          author: { connect: { id: authorId } },
          forum: { connect: { id: forumId } }
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          forum: {
            select: {
              id: true,
              title: true
            }
          }
        }
      });

      sendResponse(res, 201, true, 'Comment created successfully', comment);

    } catch (error) {
      console.error('Comment creation error:', error);
      
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return sendResponse(res, 404, false, 'Related record not found');
        }
        if (error.code === 'P2021') {
          return sendResponse(res, 500, false, 'Database table missing - please run migrations');
        }
      }
      
      sendResponse(res, 500, false, 'Failed to create comment', undefined, error);
    }
};


// DELETE /comment/:id
export const deleteCommentHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const commentId = Number(req.params.id);
  const userId = req.user?.id;

  try {
    const comment = await prismaClient.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true }
    });

    if (!comment) {
      return sendResponse(res, 404, false, "Comment not found");
    }

    if (comment.authorId !== userId) {
      return sendResponse(res, 403, false, "You are not authorized to delete this comment");
    }

    await prismaClient.comment.delete({
      where: { id: commentId }
    });

    sendResponse(res, 200, true, "Comment deleted successfully");
  } catch (error) {
    console.error("Delete comment error:", error);
    sendResponse(res, 500, false, "Failed to delete comment", undefined, error);
  }
};
