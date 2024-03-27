import mongoose from 'mongoose';
import validator from 'validator'

const applicationSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "please enter your name"],
        minLength:[3, 'name must be at least 3 characters'],
        maxLength:[30, 'name cannot exceed 30 characrers'],
    },
    email:{
        type:String,
        required:[true,'please enter your email'],
        validate:[validator.isEmail, "Please provide a valid email"],
    },
    coverLetter:{
        type:String,
    },
    phone:{
        type:Number
    },
    address:{
        type:String,
      
    },
    resume:{
        public_id:{
            type:String,
            
        },
    },
    url:{
        type:String,
    },
    applicantID:{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        role:{
            type:String,
            enum:["Job Seeker"],
            required:true
        },
    },
    employerID:{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        role:{
            type:String,
            enum:["Employer"],
            required:true
        },
    }


},{timestamps:true})

const Application = mongoose.model("Application", applicationSchema);

export default Application;