import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  date: {
    type: Date,       required: true,
  },
  totalRawCF: {
    type: Number,       required: true,
  },
  listRawCF: {
    type: Array,  default: null, 
  },
  totalCF: {
    type: Number,       required: true,
  },
  processTime: {
    type: TimeRanges,       required: true,
  },
  humidity:{
    type: Number,  default: null, 
  },
  realityCF:{
    type: Number,  default: null, 
  }
  
}
   , { timestamp: true, versionKey: false },

);

export default mongoose.model("Customer", customerSchema);
