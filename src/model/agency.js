import mongoose from "mongoose";

const agencySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            lowercase: true,

          }, address: {
            type: String,  default: null,
          },
          phoneNumber: {
            type: String,  default: null,
          },
          bankAccount: {
            type: String,  default: null,
          },
          note :{
            type: String,  default: null,
          },
          debit: {
            type: Number,required: true,
          },
          credit:{
            type: Number,required: true,
          },
    },
    { timestamp: true, versionKey: false },
    
)

export default mongoose.model("Agency", agencySchema);