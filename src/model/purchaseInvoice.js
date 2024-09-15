
import mongoose from "mongoose";

const purchaseInvoiceSchema = mongoose.Schema(
  {
    customer: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
     
      },
      name: {
      type: String,
      default: null,
    },
     },
    date: {
      type: String, required: true,
    },
    type: {
      type: String,required: true,
    },
    totalAmount: {
      type: Number,required: true,
    },
    importPrice: {
      type: Number,   default: null,
    },
    status: {
      type: String, equired: true,
    },
    note: {
      type: String,   default: null,
    },
    detailAmount: {
      type: Array,  default: null,
    },
    humidity: {
      type: Number,  default: null,
    },
    zem: {
      type: Number,  default: null,
    },
    packaging: {
      type: Number,  default: null,
    },
    unitPrice: {
      type: Number,  default: null,
    },
    billId:{
      type:  mongoose.Schema.Types.ObjectId, default: null,
  },
  },
  { timestamp: true, versionKey: false }
);

export default mongoose.model("PurchaseInvoice", purchaseInvoiceSchema);
