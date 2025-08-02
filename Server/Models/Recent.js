import mongoose from "mongoose";

const RecentSchema=new mongoose.Schema({
    



idOfEvent:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
},
 members:{
    type:Array,
    required:true
 }

,
whoEmail:{
    type:Array,
    required:true
},
who:{
type:String,
required:true
},
name:{
    type:String,
required:true
}



   
  
}, {timestamps:true}  );



const Recent = mongoose.model('Recent', RecentSchema);
export default Recent;