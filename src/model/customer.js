import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    
  },
  totalRawCF: {
    type: Number,
    required: true,
  },
  totalCF: {
    type: Number,
    required: true,
  },
  totalPepper: {
    type: Number,
    required: true,
  },
  debit: {
    type: Number,
    required: true,
  },
  credit:{
    type: Number,
    required: true,
  },
  address: {
    type: String,
    default: null, 
  },
  phoneNumber: {
    type: String,
    default: null, 
  },
  bankAccount: {
    type: String,
    default: null, 
  },
  note :{
    type: String,
    default: null, 
  },
  
}
   , { timestamp: true, versionKey: false },
);

export default mongoose.model("Customer", customerSchema);
