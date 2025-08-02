import mongoose from "mongoose";

const SettleSchema=new mongoose.Schema({
    


who:{
    type:String,
    required:true,
},
whoName:{
    type:String,
    required:true
},
whom:{
    type:String,
    required:true,
},
whomName:{
    type:String,
    required:true
},
amount:{
    type:Number,
    required:true,
},
groupName:{
    type:String
}



   
  
}, {timestamps:true}  );



const Settle = mongoose.model('Settle', SettleSchema);
export default Settle;