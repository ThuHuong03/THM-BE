import mongoose from "mongoose";

const saleInvoiceSchema= mongoose.Schema({
    customer :{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
        default: null

          },
          name: {
          type: String,
        default: null

          
        },
    },
    date:{
        type: String,       required: true,
    },
    type:{
        type: String,       required: true,
    },
    totalAmount:{
        type: Number,       required: true,
    },
    unitPrice:{
        type: Number,   default: null,
    },
    salePrice:{
         type: Number,   default: null,
    },
    
    note:{
        type: String,  default: null,
    },
  
   
    billId:{
        type:  mongoose.Schema.Types.ObjectId, default: null,
    },


    

}
   , { timestamp: true, versionKey: false },

)

export default mongoose.model("SaleInvoice", saleInvoiceSchema)