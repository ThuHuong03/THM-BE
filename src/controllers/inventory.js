import mongoose from "mongoose";
import Inventory from "../model/inventory";


export const  getInventory = async(req, res)=>{
  let inventory = await mongoose
  .model("Inventory")
  .findOne()
  .sort({ createdAt: -1 });

if (!inventory) {
  inventory = new (mongoose.model("Inventory"))({
    totalRawCF: 0,
    totalCF: 0,
    totalPepper: 0,
    fertilizer: [],
    totalMoney: 0,
  });
}
res.status(200).json(inventory);

}
export const updateInventory = async (billData, action, oldAmount = 0) => {
  let inventory = await mongoose
    .model("Inventory")
    .findOne()
    .sort({ createdAt: -1 });

  if (!inventory) {
    inventory = new (mongoose.model("Inventory"))({
      totalRawCF: 0,
      totalCF: 0,
      totalPepper: 0,
      fertilizer: [],
      totalMoney: 0,
    });
  }

  switch (billData.type) {
    case "cà tươi":
      if (action === "add") {
        inventory.totalRawCF -= billData.totalAmount;
      } else if (action === "edit") {
        inventory.totalRawCF -= billData.totalAmount + oldAmount;
      } else if (action === "delete") {
        inventory.totalRawCF += billData.totalAmount;
      }
      break;
    case "cà nhân":
      if (action === "add") {
        inventory.totalCF -= billData.totalAmount;
      } else if (action === "edit") {
        inventory.totalCF -= billData.totalAmount + oldAmount;
      } else if (action === "delete") {
        inventory.totalCF += billData.totalAmount;
      }
      break;
    case "tiêu":
      if (action === "add") {
        inventory.totalPepper -= billData.totalAmount;
      } else if (action === "edit") {
        inventory.totalPepper -= billData.totalAmount + oldAmount;
      } else if (action === "delete") {
        inventory.totalPepper += billData.totalAmount;
      }
      break;

    case "tiền":
      if (action === "add") {
        inventory.totalMoney -= billData.totalAmount;
      } else if (action === "edit") {
        inventory.totalMoney -= billData.totalAmount + oldAmount;
      } else if (action === "delete") {
        inventory.totalMoney += billData.totalAmount;
        console.log(inventory.totalMoney);
      }
      break;
    default:
      if (action === "add") {
        const i = inventory.fertilizer.findIndex((ele) =>
          ele._id==(billData.type)
        );
        if (i !== -1) {
          inventory.fertilizer[i].amount =
            parseFloat(inventory.fertilizer[i].amount) -
            parseFloat(billData.totalAmount);
        }
      } else if (action === "edit") {
        const i = inventory.fertilizer.findIndex((ele) =>
          ele._id ==(billData.type)
        );
        if (i !== -1) {
          inventory.fertilizer[i].amount =
            parseFloat(inventory.fertilizer[i].amount) -
            (parseFloat(billData.totalAmount) + parseFloat(oldAmount));
        }
      } else if (action === "delete") {
        const i = inventory.fertilizer.findIndex((ele) =>
          ele._id ==(billData.type)
        );
        if (i !== -1) {
          inventory.fertilizer[i].amount =
            parseFloat(inventory.fertilizer[i].amount) +
            parseFloat(billData.totalAmount);
        }
      }
      break;
  }

  try {
    const data = await Inventory(inventory).save();
    console.log(data);
    // res.status(201).json(data);
  } catch (error) {
    console.log(error);
    // res.status(500).json({ error: 'Mời kiểm tra lại kết nối' });
  }
};

export const updatePurchaseInventory = async (
  billData,
  action,
  oldAmount = 0
) => {
  let inventory = await mongoose
    .model("Inventory")
    .findOne()
    .sort({ createdAt: -1 });

  if (!inventory) {
    inventory = new (mongoose.model("Inventory"))({
      totalRawCF: 0,
      totalCF: 0,
      totalPepper: 0,
      fertilizer: [],
      totalMoney: 0,
    });
  }

  switch (billData.type) {
    case "cà tươi":
      if (action === "add") {
        inventory.totalRawCF += billData.totalAmount;
      } else if (action === "edit") {
        inventory.totalRawCF += billData.totalAmount + oldAmount;
      } else if (action === "delete") {
        inventory.totalRawCF -= billData.totalAmount;
      }
      break;
    case "cà nhân":
      if (action === "add") {
        inventory.totalCF += billData.totalAmount;
      } else if (action === "edit") {
        inventory.totalCF += billData.totalAmount + oldAmount;
      } else if (action === "delete") {
        inventory.totalCF -= billData.totalAmount;
      }
      break;
    case "tiêu":
      if (action === "add") {
        inventory.totalPepper += billData.totalAmount;
      } else if (action === "edit") {
        inventory.totalPepper += billData.totalAmount + oldAmount;
      } else if (action === "delete") {
        inventory.totalPepper -= billData.totalAmount;
      }
      break;

    case "tiền":
      if (action === "add") {
        inventory.totalMoney += billData.totalAmount;
      } else if (action === "edit") {
        inventory.totalMoney += billData.totalAmount + oldAmount;
      } else if (action === "delete") {
        inventory.totalMoney -= billData.totalAmount;
      }
      break;
    default:
      if (action === "add") {
        const i = inventory.fertilizer.findIndex((ele) =>
         ele._id === billData.type
        );
        if (i !== -1) {
          inventory.fertilizer[i].amount =
            parseFloat(inventory.fertilizer[i].amount) +
            parseFloat(billData.totalAmount);
        }
      } else if (action === "edit") {
        const i = inventory.fertilizer.findIndex((ele) =>
        ele._id === billData.type
        );
        if (i !== -1) {
          inventory.fertilizer[i].amount =
            parseFloat(inventory.fertilizer[i].amount) +
            (parseFloat(billData.totalAmount) - parseFloat(oldAmount));
        }
      } else if (action === "delete") {
        const i = inventory.fertilizer.findIndex((ele) =>
         ele._id === billData.type
        );
        if (i !== -1) {
          inventory.fertilizer[i].amount =
            parseFloat(inventory.fertilizer[i].amount) -
            parseFloat(billData.totalAmount);
        }
      }

      break;
  }

  try {
    const data = await Inventory(inventory).save();
    console.log(data);
    // res.status(201).json(data);
  } catch (error) {
    console.log(error);
    // res.status(500).json({ error: 'Mời kiểm tra lại kết nối' });
  }
};

export const updateInventoryAdd= async(isCustomer, customer)=>{
  let inventory = await mongoose
  .model("Inventory")
  .findOne()
  .sort({ createdAt: -1 });

if (!inventory) {
  inventory = new (mongoose.model("Inventory"))({
    totalRawCF: 0,
    totalCF: 0,
    totalPepper: 0,
    fertilizer: [],
    totalMoney: 0,
  });
}

  if(isCustomer) {

    
  inventory.totalRawCF += customer.totalRawCF;
  inventory.totalCF += customer.totalCF;
  inventory.totalPepper += customer.totalPepper;
  inventory.totalMoney += customer.credit - customer.debit;
  

  }
  else{
    inventory.totalMoney += customer.credit - customer.debit;
  }
  try {
    const data = await Inventory(inventory).save();
    console.log(data);
    // res.status(201).json(data);
  } catch (error) {
   
  }

}