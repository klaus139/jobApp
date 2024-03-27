import express from "express";
import {getAllUsers, getUser, login, logout, register} from "../controller/userController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post('/register', register)
router.post('/login', login);
router.get('/logout', isAuthenticated, logout);
router.get('/all-users', isAuthenticated, getAllUsers);
router.get('/getuser', isAuthenticated, getUser)
export default router;