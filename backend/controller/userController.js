import { User } from "../model/usermodel.js";
import { catchAsyncErrors } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async(req, res, next) => {
    try{
        const {name, email, phone, password, role} = req.body;

        if(!name || !email || !phone || !password || !role){
            return next(new ErrorHandler('please fill all the roles'))
        }
        const isEmail = await User.findOne({email})
        if(isEmail){
            return next(new ErrorHandler('Email already registered please login'))
        }
        const user = await User.create({
            name, 
            email, 
            phone,
            password,
            role
        });
        sendToken(user, 201, res, "user registered")

    }catch(error){
        console.log(error)
    }
})

export const login = catchAsyncErrors(async(req, res, next) => {
    try{
        const {email, password, role} = req.body;
        if(!email || !password || !role){
            return next(new ErrorHandler("please fill everything"))
        }

        const user = await User.findOne({email}).select("+password")
        if(!user){
            return next(new ErrorHandler("email does not exist, please register"))
        }
        const isPasswordMatched = await user.comparePassword(password)
        if(!isPasswordMatched){
            return next(new ErrorHandler("password is not correct"))
        }
        if(user.role !== role){
            return next(new ErrorHandler(`user with provided email and ${role} not found`, 404));

        }

        sendToken(user, 201, res, "user logged in");

    }catch(error){
        console.log(error)
    }
})

export const logout = catchAsyncErrors(async(req, res, next) => {
    res.status(201).cookie("token", "", {
        httpOnly:true,
        expires:new Date(Date.now())
    })
    .json({
        success:true,
        message:"Logged out successfully"
    })
})

export const getAllUsers = catchAsyncErrors(async(req, res, next) => {
    try{
        const users = await User.find({})
        res.status(200).json({
            success:true,
            users,
        })

    }catch(error){
        console.log(error)
    }
})

export const getUser = catchAsyncErrors(async(req, res, next) => {
    try{
        const users = req.user
        console.log(users)
        res.status(200).json({
            success:true,
            users,
        })

    }catch(error){
        console.log(error)
    }
})
