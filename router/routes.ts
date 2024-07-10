import { Router } from "express";
import ctrl from '../controllers/controllers'
import verifyToken from '../middleware/middleware'
const app: Router = Router();


app.post('/register',ctrl.register)
app.post('/login',ctrl.login)
app.get('/user',verifyToken,ctrl.user)
app.get('/sendmail',verifyToken,ctrl.sendMail)

export default app