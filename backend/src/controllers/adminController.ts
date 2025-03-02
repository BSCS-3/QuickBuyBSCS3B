import { Request, Response } from 'express';
import pool from '../models/db';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const [users] = await pool.query<any[]>(

      'SELECT id, username, email, role, shop_name, created_at FROM users WHERE role != ?',
      ['admin']
    );

    res.json(users);

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;

  try {
    const [user] = await pool.query<any[]>( 
      'SELECT role FROM users WHERE id = ?',
      [userId]
    );

    if (!user[0]) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user[0].role === 'admin') {
      res.status(403).json({ message: 'Cannot delete admin users' });
      return;
    }

    await pool.query(
        'DELETE FROM users WHERE id = ?',
         [userId]);
    
    res.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

export const deleteSeller = async (req: Request, res: Response): Promise <void> => {
  const sellerId = req.params.id;

  try {
    const [user] = await pool.query<any[]>(
      'SELECT role FROM users WHERE id = ?',
      [sellerId]
    );

    if (!user[0]) {
      res.status(404).json({ message: 'Seller not found' });
      return;
    }

    if (user[0].role !== 'seller') {
      res.status(403).json({ message: 'User is not a seller and cannot be deleted' });
      return;
    }

    await pool.query(
      'DELETE FROM users where id = ?',
      [sellerId]
    );

    res.status(200).json({ message: 'Seller deleted successfully' });

  } catch(error) {
    console.error('Error deleting seller:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};