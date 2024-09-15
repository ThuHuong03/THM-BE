import mongoose from "mongoose";
import Bill from "../model/bill";
import { addBillSchema } from "../schemas/bill";
import { updateInventory } from "./inventory";
import Customer from "../model/customer";
import Agency from "../model/agency";
import Provider from "../model/provider";

export const getBills = async () => {
  try {
    const bills = await Bill.find();
   const updatedBills= bills.map(invoice => ({
      ...invoice.toObject(), 
      title: "Phiếu Xuất"
    }));
    return updatedBills;
  } catch (error) {
    console.error("Error fetching bills by customer ID:", error);
    throw error;
  }
};

export const getBillById= async (req, res) => {
  try {
    const id= req.params;
    const bill = await Bill.findById(id);
    res.status(200).json(bill);
  } catch (error) {
      console.log(error);
    res.status(500).json({ error: "Mời kiểm tra lại kết nối" });
  }

}

 export const getBillsByCustomerId = async (customerId) => {
  try {
    const bills = await Bill.find({ 'customer._id': customerId });
   const updatedBills= bills.map(invoice => ({
      ...invoice.toObject(), 
      title: "Phiếu Xuất"
    }));
    console.log(updatedBills);
    return updatedBills;
  } catch (error) {
    console.error("Error fetching bills by customer ID:", error);
    throw error;
  }
};
export const getBillsByFertilizerrId = async (id) => {
  try {
    const bills = await Bill.find({ 'type': id });
   const updatedBills= bills.map(invoice => ({
      ...invoice.toObject(), 
      title: "Phiếu Xuất"
    }));
    console.log(updatedBills);
    return updatedBills;
  } catch (error) {
    console.error("Error fetching bills by fertilzer ID:", error);
    throw error;
  }
};

export const addBill = async (req, res) => {
  const { error } = addBillSchema.validate(req.body, { abortEarly: false });

  if (error) {
    // Extract error messages
    const errorMessages = error.details.map((err) => err.message);

    // Send the error messages as a response
    return res.status(400).json({ errors: errorMessages });
  }
  if (req.body.status == "hoàn thành") await updateInventory(req.body, "add");
  if (req.body.customerId) {
  }
  try {
    // Uncomment the following lines to save the agency data
    const data = await Bill(req.body).save();
    updateCustomerAdd(req.body);
    res.status(201).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Mời kiểm tra lại kết nối" });
  }
};

export const editBill = async (req, res) => {
  const { error } = addBillSchema.validate(req.body, { abortEarly: false });

  if (error) {
    // Extract error messages
    const errorMessages = error.details.map((err) => err.message);

    // Send the error messages as a response
    return res.status(400).json({ errors: errorMessages });
  }

  try {
    const { id } = req.params;
    const bill = await Bill.findById(id);
    const updatedBill = await Bill.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (bill.status != updatedBill.status) {
      if (
        bill.status == "hoàn thành" &&
        (updatedBill.status == "chưa hoàn thành" ||
          updatedBill.status == "gửi tại kho")
      )
        updateInventory(bill, "delete");
      // console.log("updated bill");
      else if (
        (bill.status == "chưa hoàn thành" || bill.status == "gửi tại kho") &&
        updatedBill.status == "hoàn thành"
      )
        updateInventory(updatedBill, "add");
    }
    if (bill.totalAmount != updatedBill.totalAmount) {
      updateInventory(updatedBill, "edit", bill.totalAmount);
    }
    updateCustomerUpdate(updatedBill, bill);
    if (!updatedBill) {
      return res.status(404).json({ error: "Phiếu xuất không tìm thấy" });
    }
    res.status(200).json(updatedBill);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Mời kiểm tra lại kết nối" });
  }
};
export const deleteBill = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBill = await Bill.findByIdAndDelete(id);

    if (!deletedBill) {
      return res.status(404).json({ error: "Phiếu xuất không tìm thấy" });
    }
    if (deletedBill.status == "hoàn thành")
    {
      updateInventory(deletedBill, "delete");
      console.log("deleteBill");
    }
    updateCustomerDelete(deletedBill);
    res.status(200).json({ message: "Phiếu xuất đã được xóa thành công" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Mời kiểm tra lại kết nối" });
  }
};

const updateCustomerAdd = async (bill) => {
  const id = bill.customer._id;
  const customer = await Customer.findById(id);
  const agency = await Agency.findById(id);
  const provider = await Provider.findById(id);

  let billCustomer = customer || agency || provider;
  if (!billCustomer) {
    console.log("customer not found");
    return;
  }
  if (customer) {
    switch (bill.type) {
      case "tiền":
        if (billCustomer.credit < bill.totalAmount) {
          billCustomer.debit += bill.totalAmount - billCustomer.credit;
          billCustomer.credit = 0;
        } else billCustomer.credit -= bill.totalAmount;
        break;
      default:
        if (billCustomer.credit < bill.exportPrice) {
          billCustomer.debit += bill.exportPrice - billCustomer.credit;
          billCustomer.credit = 0;
        } else billCustomer.credit -= bill.exportPrice;

        break;
    }
    const newcustomer = await Customer.findByIdAndUpdate(
      customer._id,
      billCustomer,
      { new: true }
    );
  } else if (agency) {
    switch (bill.type) {
      case "tiền":
        if (billCustomer.credit < bill.totalAmount) {
          billCustomer.debit += bill.totalAmount - billCustomer.credit;
          billCustomer.credit = 0;
        } else billCustomer.credit -= bill.totalAmount;
        break;
      default:
        if (billCustomer.credit < bill.exportPrice) {
          billCustomer.debit += bill.exportPrice - billCustomer.credit;
          billCustomer.credit = 0;
        } else billCustomer.credit -= bill.exportPrice;

        break;
    }
    const newcustomer = await Agency.findByIdAndUpdate(
      agency._id,
      billCustomer,
      { new: true }
    );
  } else if (provider) {
    switch (bill.type) {
      case "tiền":
        if (billCustomer.credit < bill.totalAmount) {
          billCustomer.debit += bill.totalAmount - billCustomer.credit;
          billCustomer.credit = 0;
        } else billCustomer.credit -= bill.totalAmount;
        break;
      default:
        if (billCustomer.credit < bill.exportPrice) {
          billCustomer.debit += bill.exportPrice - billCustomer.credit;
          billCustomer.credit = 0;
        } else billCustomer.credit -= bill.exportPrice;

        break;
    }
    const newcustomer = await Provider.findByIdAndUpdate(
      provider._id,
      billCustomer,
      { new: true }
    );
  }
};

const updateCustomerUpdate = async (bill, oldbill) => {
  const id = bill.customer._id;
  const customer = await Customer.findById(id);
  const agency = await Agency.findById(id);
  const provider = await Provider.findById(id);

  let billCustomer = customer || agency || provider;
  if (!billCustomer) {
    console.log("customer not found");
    return;
  }
  if (customer) {
    switch (bill.type) {
      case "tiền":
        if (billCustomer.debit < bill.totalAmount - oldbill.totalAmount) {
          billCustomer.credit +=
            bill.totalAmount - oldbill.totalAmount - billCustomer.debit;
          billCustomer.debit = 0;
        } else billCustomer.debit -= bill.totalAmount + oldbill.totalAmount;
        break;
      default:
        if (billCustomer.debit < bill.exportPrice - oldbill.exportPrice) {
          billCustomer.credit +=
            bill.exportPrice - oldbill.exportPrice - billCustomer.debit;
          billCustomer.debit = 0;
        } else billCustomer.debit -= bill.exportPrice + oldbill.exportPrice;

        break;
    }

    const newcustomer = await Customer.findByIdAndUpdate(
      customer._id,
      billCustomer,
      { new: true }
    );
  } else if (agency) {
    switch (bill.type) {
      case "tiền":
        if (billCustomer.debit < bill.totalAmount - oldbill.totalAmount) {
          billCustomer.credit +=
            bill.totalAmount - oldbill.totalAmount - billCustomer.debit;
          billCustomer.debit = 0;
        } else billCustomer.debit -= bill.totalAmount + oldbill.totalAmount;
        break;
      default:
        if (billCustomer.debit < bill.exportPrice - oldbill.exportPrice) {
          billCustomer.credit +=
            bill.exportPrice - oldbill.exportPrice - billCustomer.debit;
          billCustomer.debit = 0;
        } else billCustomer.debit -= bill.exportPrice + oldbill.exportPrice;

        break;
    }
    const newcustomer = await Agency.findByIdAndUpdate(
      agency._id,
      billCustomer,
      { new: true }
    );
  } else if (provider) {
    switch (bill.type) {
      case "tiền":
        if (billCustomer.debit < bill.totalAmount - oldbill.totalAmount) {
          billCustomer.credit +=
            bill.totalAmount - oldbill.totalAmount - billCustomer.debit;
          billCustomer.debit = 0;
        } else billCustomer.debit -= bill.totalAmount + oldbill.totalAmount;
        break;
      default:
        if (billCustomer.debit < bill.exportPrice - oldbill.exportPrice) {
          billCustomer.credit +=
            bill.exportPrice - oldbill.exportPrice - billCustomer.debit;
          billCustomer.debit = 0;
        } else billCustomer.debit -= bill.exportPrice + oldbill.exportPrice;

        break;
    }
    const newcustomer = await Provider.findByIdAndUpdate(
      provider._id,
      billCustomer,
      { new: true }
    );
  }
};

const updateCustomerDelete = async (bill) => {
  const id = bill.customer._id;
  const customer = await Customer.findById(id);
  const agency = await Agency.findById(id);
  const provider = await Provider.findById(id);

  let billCustomer = customer || agency || provider;
  if (!billCustomer) {
    console.log("customer not found");
    return;
  }
  if (customer) {
    switch (bill.type) {
      case "tiền":
    
    if (billCustomer.debit < bill.totalAmount) {
      
        billCustomer.credit = bill.totalAmount - billCustomer.debit;
        billCustomer.debit = 0;
    } else {
       
        billCustomer.debit -= bill.totalAmount;
    }
    break;

default:

    if (billCustomer.debit < bill.exportPrice) {
        billCustomer.credit = bill.exportPrice - billCustomer.debit;
        billCustomer.debit = 0;
    } else {
        billCustomer.debit -= bill.exportPrice;
    }
    break;

    }

    const newcustomer = await Customer.findByIdAndUpdate(
      customer._id,
      billCustomer,
      { new: true }
    );
  } else if (agency) {
     switch (bill.type) {
      case "tiền":
    
    if (billCustomer.debit < bill.totalAmount) {
      
        billCustomer.credit = bill.totalAmount - billCustomer.debit;
        billCustomer.debit = 0;
    } else {
       
        billCustomer.debit -= bill.totalAmount;
    }
    break;

default:

    if (billCustomer.debit < bill.exportPrice) {
        billCustomer.credit = bill.exportPrice - billCustomer.debit;
        billCustomer.debit = 0;
    } else {
        billCustomer.debit -= bill.exportPrice;
    }
    break;

    }
    const newcustomer = await Agency.findByIdAndUpdate(
      agency._id,
      billCustomer,
      { new: true }
    );
  } else if (provider) {
     switch (bill.type) {
      case "tiền":
    
    if (billCustomer.debit < bill.totalAmount) {
      
        billCustomer.credit = bill.totalAmount - billCustomer.debit;
        billCustomer.debit = 0;
    } else {
       
        billCustomer.debit -= bill.totalAmount;
    }
    break;

default:

    if (billCustomer.debit < bill.exportPrice) {
        billCustomer.credit = bill.exportPrice - billCustomer.debit;
        billCustomer.debit = 0;
    } else {
        billCustomer.debit -= bill.exportPrice;
    }
    break;
    }
    const newcustomer = await Provider.findByIdAndUpdate(
      provider._id,
      billCustomer,
      { new: true }
    );
    
  }
};
