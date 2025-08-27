import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import crypto from "crypto"

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

userSchema.methods.genearteAccessToken = function(){
    return jwt.sign({
        //write those info which u want 
        // to be inside the access token
        //this is PAYLOAD
        _id: this._id,
        email: this.email,
        username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}

)
    
}

userSchema.methods.generateRefreshToken= function(){
    return jwt.sign(
        {
        //write those info which u want 
        // to be inside the access token
        //this is PAYLOAD
        _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}

    )
}

userSchema.methods.generateTemporaryToken = function() {
    const unHashedToken = crypto.randomBytes(20).toString("hex");

    const hashedToken = crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex");

    const tokenExpiry = Date.now() + (20 * 60 * 1000); // 20 mins

    return { unHashedToken, hashedToken, tokenExpiry };
};
//export const User = mongoose.model("User", userSchema);