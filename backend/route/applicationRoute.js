import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { employerGetAllApplications, jobSeekerDeleteApplication, jobSeekerGetAllApplications, postApplication } from "../controller/application.controller.js";

const router = express.Router();

router.post('/post', isAuthenticated, postApplication);
router.get('/employer/all', isAuthenticated, employerGetAllApplications);

router.get('/jobseeker/all', isAuthenticated, jobSeekerGetAllApplications);

router.delete('/delete/:id', isAuthenticated, jobSeekerDeleteApplication)


export default router;