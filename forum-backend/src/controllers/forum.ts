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


export const createForumHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, description, tags } = req.body;
    const authorId = req.user?.id;


    // 1. Validate required fields
    if (!title || !description) {
      return sendResponse(res, 400, false, 'Title and description are required');
    }

    // 2. Verify user exists
    const userExists = await prismaClient.user.findUnique({
      where: { id: authorId },
      select: { id: true }
    });

    if (!userExists) {
      return sendResponse(res, 404, false, 'User not found');
    }

    // 3. Create forum with proper error handling
    const forum = await prismaClient.forum.create({
      data: {
        title,
        description,
        tags: "", // Handle optional tags
        author: { connect: { id: authorId } }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    sendResponse(res, 201, true, 'Forum created successfully', forum);
  } catch (error) {
    console.error('Forum creation error:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2021') {
        return sendResponse(res, 500, false, 'Database table missing - please run migrations');
      }
    }
    
   
    sendResponse(res, 500, false, 'Failed to create forum', undefined, error);
  }
};


export const getForum = async (req: Request, res: Response): Promise<void> => {
try {
    const forums = await prismaClient.forum.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(forums);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch forums' });
  }
}

// DELETE /forum/:id
export const deleteForumHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const forumId = Number(req.params.id);
  const userId = req.user?.id;

  try {
    // Check if forum exists and fetch the author
    const forum = await prismaClient.forum.findUnique({
      where: { id: forumId },
      select: { authorId: true }
    });

    if (!forum) {
      return sendResponse(res, 404, false, 'Forum not found');
    }

    // Check if the current user is the author
    if (forum.authorId !== userId) {
      return sendResponse(res, 403, false, 'You are not authorized to delete this forum');
    }

    // Delete forum
    await prismaClient.forum.delete({
      where: { id: forumId }
    });

    sendResponse(res, 200, true, 'Forum deleted successfully');
  } catch (error) {
    console.error('Delete forum error:', error);
    sendResponse(res, 500, false, 'Failed to delete forum', undefined, error);
  }
};

export const updateForumHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const forumId = Number(req.params.id);
  const { title, description, tags } = req.body;
  const userId = req.user?.id;

  if (!title || !description) {
    return sendResponse(res, 400, false, 'Title and description are required');
  }

  try {
    // Find the forum
    const existingForum = await prismaClient.forum.findUnique({
      where: { id: forumId },
    });

    if (!existingForum) {
      return sendResponse(res, 404, false, 'Forum not found');
    }

    // Check if current user is the author
    if (existingForum.authorId !== userId) {
      return sendResponse(res, 403, false, 'You are not authorized to update this forum');
    }

    // Update the forum
    const updatedForum = await prismaClient.forum.update({
      where: { id: forumId },
      data: {
        title,
        description,
        tags: tags ?? "",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    return sendResponse(res, 200, true, 'Forum updated successfully', updatedForum);

  } catch (error) {
    console.error('Update forum error:', error);
    return sendResponse(res, 500, false, 'Failed to update forum', undefined, error);
  }
};