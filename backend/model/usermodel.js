import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'please enter your name'],
        minLength:[3, "Name must contain at least 3 characters"],
        maxLength:[30, "Name cannot exceed 30 characters"]
    },
    email:{
        type:String,
        required:[true, "Please provide an Email address."],
        validate:[validator.isEmail, "Please provide a valid email"],
    },
    phone:{
        type:Number,
        required:[true, "Please provide a valid phone number"],
    },
    password:{
        type:String,
        required:[true, "Please provide a valid password"],
        minLength:[6, "password must contain at least 6 characters"],
        maxLength:[30,"password mst not exceed 30 characters"],
        select:false,
    },
    role:{
        type:String,
        required:[true, "Please select a role"],
        enum:["Job Seeker","Employer"],
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }

},)

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.getJWTToken = function() {
    return jwt.sign({id:this._id}, process.env.JWT_SECRET_KEY,{
        expiresIn:3 * 24 * 60 * 60 * 1000
    })
}

export const User = mongoose.model("User", userSchema);