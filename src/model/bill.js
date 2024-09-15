import mongoose from "mongoose";

const billSchema= mongoose.Schema({
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
    exportPrice:{
        type: Number,   default: null,
    },
    status:{
        type: String, required: true,
    },
    note:{
        type: String,  default: null,
    },
    detailAmount:{
        type: Array,  default: null,
    },
    humidity:{
        type: Number,  default: null,
    },
    zem:{
        type: Number,  default: null,
    },
    packaging:{
        type: Number,  default: null,
    },
    purchaseInvoiceId:{
        type:  mongoose.Schema.Types.ObjectId, default: null,
    },


    

}
   , { timestamp: true, versionKey: false },

)

export default mongoose.model("Bill", billSchema)