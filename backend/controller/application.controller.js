import { catchAsyncErrors } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";
import cloudinary from "cloudinary";
import { Job } from "../model/jobSchema.js";
import Application from "../model/applicationSchema.js";

export const postApplication = catchAsyncErrors(async(req, res, next) => {
    try{
        const {role} = req.user;
        if(role === "Employer"){
            return next(
                new ErrorHandler("Employer are not allowed to access this resource", 400)
            )
        }
        // if(!req.files || Object.keys(req.files).length === 0){
        //     return next(new ErrorHandler('Resume is required', 400))
        // }

        // const {resume} = req.files;
        // const allowedFormats = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'pdf']
        // if(!allowedFormats){
        //     return next(new ErrorHandler('invalid file type, please upload a PNG or JPEG file'))
        // }

        // const cloudinaryResponse = await cloudinary.uploader.upload(
        //     resume.tempFilePath
        // )

        // if(!cloudinaryResponse || cloudinaryResponse.error){
        //     console.error(
        //         'cloudinary Error',
        //         cloudinaryResponse.error || 'unknown cloudinary error'
        //     )
        //     return next(new ErrorHandler('Failed to upload resume to cloudinary', 500))
        // }

        const {name, email, coverLetter, phone, address, jobId} = req.body;
        const applicantID = {
            user:req.user._id,
            role:"Job Seeker"

        };
        if(!jobId){
            return next(new ErrorHandler("Job not found", 404));
        }

        const jobDetails = await Job.findById(jobId);
        if(!jobDetails){
            return next(new ErrorHandler("Job not found", 404));
        }

        const employerID = {
            user:jobDetails.postedBy,
            role:"Employer"

        };

        const application = await Application.create({
            name,email, coverLetter, phone, address, applicantID, employerID,
            // resume:{
            //     public_id:cloudinaryResponse.public_id,
            //     url:cloudinaryResponse.secure_url,
            // }

        });

        res.status(201).json({
            success:true,
            message:"Application submitted successfully",
            application,
        })

    }catch(error){
        console.log(error)
        return next(new ErrorHandler(error.message, 500))
    }
})

export const employerGetAllApplications = catchAsyncErrors(async(req, res,next) => {
    const {role} = req.user;
    if(role === "Job Seeker"){
        return next(new ErrorHandler("Job seekers are not allowed to access this resource", 400))

    }
    const {_id} = req.user;
    const applications = await Application.find({"employerID.user":_id});
    res.status(200).json({
        success:true,
        applications
    })
})


export const jobSeekerGetAllApplications = catchAsyncErrors(async(req, res,next) => {
    const {role} = req.user;
    if(role === "Employer"){
        return next(new ErrorHandler("Employer are not allowed to access this resource", 400))

    }
    const {_id} = req.user;
    const applications = await Application.find({"applicantID.user":_id});
    res.status(200).json({
        success:true,
        applications
    })
})

export const jobSeekerDeleteApplication = catchAsyncErrors(async(req, res, next) => {
    const {role} = req.user;
    if(role === "Employer"){
        return next(new ErrorHandler("Employer are not allowed to access this resource", 400))

    }
    const {id} = req.params;
    const applications = await Application.findById(id);
    if(!applications){
        return next(new ErrorHandler('Application not found', 404));
    }
    await applications.deleteOne();
    res.status(200).json({
        success:true,
        message:'Application deleted successfully'
    })
})