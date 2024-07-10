import { Request, Response } from 'express';
import admin from '../config/firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
}

firebase.initializeApp(firebaseConfig)

const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const userRecord = await admin.auth().createUser({
            email,
            password,
        })
        const user = await firebase.auth().signInWithEmailAndPassword(email, password);
        // console.log(user)
        await user.user?.sendEmailVerification();
    
        res.status(201).send(`User created with UID: ${userRecord.uid}. Verification email sent.`);
    } catch (error) {
        res.status(400).send(`Error creating user: ${error.message}`);
    }
}

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        const token = await userCredential.user?.getIdToken();
        res.status(200).send({ token });
    } catch (error) {
        res.status(400).send(`Error signing in: ${error.message}`);
    }
}

const sendMail = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        const decodedToken = await admin.auth().verifyIdToken(token);
        const user = await admin.auth().getUser(decodedToken.uid);
        await admin.auth().generateEmailVerificationLink(user.email);
        return res.status(200).json({ msg: "Verification mail sent" });
    } catch (error) {
        res.status(400).send(`Error sending verification email: ${error.message}`);
    }
};

const user = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token)
        const userRecord = await admin.auth().getUser(decodedToken.uid)
        res.status(200).json(userRecord)
    } catch (error) {
        res.status(500).send(`Error fetching user data: ${error.message}`)
    }
}
export default {
    register,
    login,
    user,
    sendMail
}