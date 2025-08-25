import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
const userSchema = new Schema({
    avatar:{
        type:{
            url: String,
            localPath: String,
        },
        dafault:{
            url:`https://placehold.co/600x400`,
            localPath:""
        }
    },
    username:{
        type: String,
        required: [true, "Username is required"],
        unique: true,
        lowercase: true,
        trim:true,
        index:true
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim:true,
    },
    fullName:{
        type: String,
        trim:true,    
    },
    password:{
        type: String,
        required: [true, "Password is required"],
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    refreshToken:{
        type:String,
    },
    forgotPasswordToken:{
        type:String,
    },
    forgotPasswordExpiry:{
        type:Date,
    },
    emailVerificationToken:{
        type:String,
    },
    emailVerificationExpiry:{
        type:Date
    }
},
{
    timestamps:true
})

//pre hook written for hashing the password
userSchema.pre("save", async function(next){
    if(!this.isModified("password"))  return next()
    this.password = await bcrypt.hash(this.password,10)
    next()
})

//method of comparing the hashed password with the actual password
userSchema.methods.isPasswordCorrect= async function (password) {
    return await bcrypt.compare(password, this.password)
}
//export const User = mongoose.model("User", userSchema);