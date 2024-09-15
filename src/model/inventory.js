import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  
  totalRawCF: {
    type: Number,
    
  },
  totalCF: {
    type: Number,
  },
  totalPepper: {
    type: Number,
  },
  fertilizer: {
    type: Array,
  },
  totalMoney:{
    type: Number,
  },
 
  
}
, { timestamp: true, versionKey: false },
)
;

inventorySchema.pre('save', async function (next) {
  // Check if any of the fields are missing
  if (!this.totalRawCF || !this.totalCF || !this.totalPepper || !this.fertilizer || !this.totalMoney) {
    // Find the most recent document in the Inventory collection
    const latestInventory = await mongoose.model('Inventory').findOne().sort({ createdAt: -1 });

    if (latestInventory) {
      // Only update the missing fields
      if (!this.totalRawCF) this.totalRawCF = latestInventory.totalRawCF;
      if (!this.totalCF) this.totalCF = latestInventory.totalCF;
      if (!this.totalPepper) this.totalPepper = latestInventory.totalPepper;
      if (!this.fertilizer || this.fertilizer.length === 0) this.fertilizer = latestInventory.fertilizer;
      if (!this.totalMoney) this.totalMoney = latestInventory.totalMoney;
    }
  }
  next();
});
export default mongoose.model("Inventory", inventorySchema);
