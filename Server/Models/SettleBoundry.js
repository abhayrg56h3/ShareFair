import mongoose from "mongoose";

const SettleBoundrySchema=new mongoose.Schema({
    


    members: {
        type: Array,
        default: [],
      },



   
  
}, {timestamps:true}  );



const SettleBoundry = mongoose.model('SettleBoundry', SettleBoundrySchema);
export default SettleBoundry;