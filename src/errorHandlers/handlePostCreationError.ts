import { Response } from 'express';


export function handlePostCreationError(res: Response, error: any) {
    return res.status(500).json({
      status: 'Error',
      message: 'Post creation failed',
      error: error.message,
    });
  }
  