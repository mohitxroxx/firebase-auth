import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase';
const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).send('Unauthorized: No token provided');
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token)
        next();
    } catch (error) {
        return res.status(401).send('Unauthorized: Invalid token');
    }
};

export default verifyToken