import type { Request, Response } from 'express';

export async function handleLogout(req: Request | any, res: Response | any) {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
}

export default handleLogout;
