import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

interface LoginRequestBody {
  email: string;
  password: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password }: LoginRequestBody = req.body;

    try {
      const loginResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login/`, {
        email,
        password,
      });

      res.status(200).json(loginResponse.data);
    } catch (error) {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
