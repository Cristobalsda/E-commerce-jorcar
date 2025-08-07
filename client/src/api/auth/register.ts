// pages/api/auth/register.ts
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

interface RegisterRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { firstName, lastName, email, password, confirmPassword }: RegisterRequestBody = req.body;
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
      const registerResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register/`, {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        confirm_password: confirmPassword,
      });

      res.status(201).json(registerResponse.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error del servidor' });
      } else {
        res.status(500).json({ message: 'Error del servidor' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
