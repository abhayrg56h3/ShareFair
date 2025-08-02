import mongoose from "mongoose";

const UserSchema=new mongoose.Schema({
   name:{
    type:String,
    required:true,
    min:3,
    max:20,
   },
   googleId:{
    type:String,
 
   },
   email:{
    type:String,
    required:true,
    max:50,
    unique:true
   },
   password:{
      type:String,
   },
   phone:{
       type:String,
       default:"+991..."
   },
   profilePicture:{
  type:String,
  default:""
   },

   friends:{
  type:Array,
  default:[]
   },

   desc:{
      type:String,
      max:50
   },
   city:{
      type:String,
      max:50
   },
   from:{
      type:String,
      max:50
   },
     resetPasswordToken: String,
resetPasswordExpires: Date

   
  
}, {timestamps:true}  );



const User = mongoose.model('User', UserSchema);
export default User;