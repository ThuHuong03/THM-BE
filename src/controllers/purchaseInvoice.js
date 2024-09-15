import mongoose from "mongoose";
import PurchaseInvoice from "../model/PurchaseInvoice";
import { addPurchaseInvoiceSchema } from "../schemas/purchaseInvoice";
import { updateInventory, updatePurchaseInventory } from "./inventory";
import Customer from "../model/customer";
import Agency from "../model/agency";
import Provider from "../model/provider";

export const getPurchaseInvoices = async () => {
  try {
    const purchaseInvoices = await PurchaseInvoice.find();
  const updatePurchaseInvoices= purchaseInvoices.map(invoice => ({
    ...invoice.toObject(), 
    title: "Phiếu Nhập"
  }));
    return updatePurchaseInvoices;
  } catch (error) {
    console.error("Error fetching PurchaseInvoices :", error);
    throw error;
  }
};


export const getPurchaseInvoiceById= async (req, res) => {
  try {
    const id= req.params;
    const purchaseInvoice = await PurchaseInvoice.findById(id);
    res.status(200).json(purchaseInvoice);
  } catch (error) {
      console.log(error);
    res.status(500).json({ error: "Mời kiểm tra lại kết nối" });
  }

}

 export const getPurchaseInvoicesByCustomerId = async (customerId) => {
  try {
    const purchaseInvoices = await PurchaseInvoice.find({ 'customer._id': customerId });
  const updatePurchaseInvoices= purchaseInvoices.map(invoice => ({
    ...invoice.toObject(), 
    title: "Phiếu Nhập"
  }));
    return updatePurchaseInvoices;
  } catch (error) {
    console.error("Error fetching PurchaseInvoices by customer ID:", error);
    throw error;
  }
};
export const getPurchaseInvoicesByFertilizerId = async (id) => {
  try {
    const purchaseInvoices = await PurchaseInvoice.find({ 'type': id });
  const updatePurchaseInvoices= purchaseInvoices.map(invoice => ({
    ...invoice.toObject(), 
    title: "Phiếu Nhập"
  }));
    return updatePurchaseInvoices;
  } catch (error) {
    console.error("Error fetching PurchaseInvoices by fertilizer ID:", error);
    throw error;
  }
};

export const addPurchaseInvoice = async (req, res) => {
  const { error } = addPurchaseInvoiceSchema.validate(req.body, { abortEarly: false });

  if (error) {
    // Extract error messages
    const errorMessages = error.details.map((err) => err.message);

    // Send the error messages as a response
    return res.status(400).json({ errors: errorMessages });
  }
  if(req.body.status !="chưa hoàn thành" )  
   await updatePurchaseInventory(req.body, "add");
  updateCustomerAdd(req.body);
  try {
    // Uncomment the following lines to save the agency data
    const data = await PurchaseInvoice(req.body).save();

    res.status(201).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Mời kiểm tra lại kết nối" });
  }
};

export const editPurchaseInvoice = async (req, res) => {
  const { error } = addPurchaseInvoiceSchema.validate(req.body, { abortEarly: false });

  if (error) {
    // Extract error messages
    const errorMessages = error.details.map((err) => err.message);

    // Send the error messages as a response
    return res.status(400).json({ errors: errorMessages });
  }

  try {
    const { id } = req.params;
    const purchaseInvoice = await PurchaseInvoice.findById(id);
    const updatedPurchaseInvoice = await PurchaseInvoice.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (purchaseInvoice.status != updatedPurchaseInvoice.status) {
      if (
      (  purchaseInvoice.status == "hoàn thành" || purchaseInvoice.status =="gửi tại kho") &&
       ( updatedPurchaseInvoice.status == "chưa hoàn thành" )
      )
        updateInventory(purchaseInvoice, "delete");
        // console.log("updated PurchaseInvoice");
        else if (
purchaseInvoice.status == "chưa hoàn thành" &&
                (updatedPurchaseInvoice.status == "hoàn thành" ||  updatedPurchaseInvoice.status =="gửi tại kho")
      )
      updateInventory(updatedPurchaseInvoice, "add");
      
    }
    if (PurchaseInvoice.totalAmount != updatedPurchaseInvoice.totalAmount) {
              updateInventory(updatedPurchaseInvoice, "edit", purchaseInvoice.totalAmount);
    }

    updateCustomerUpdate(updatedPurchaseInvoice, purchaseInvoice)
    if (!updatedPurchaseInvoice) {
      return res.status(404).json({ error: "Phiếu nhập không tìm thấy" });
    }
    res.status(200).json(updatedPurchaseInvoice);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Mời kiểm tra lại kết nối" });
  }
};
export const deletePurchaseInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedPurchaseInvoice = await PurchaseInvoice.findByIdAndDelete(id);
    
    if (!deletedPurchaseInvoice) {
      return res.status(404).json({ error: "Phiếu nhập không tìm thấy" });
    }
    if(deletePurchaseInvoice.status =="hoàn thành" ) 
    updateInventory(deletedPurchaseInvoice, "delete");
    updateCustomerDelete(deletedPurchaseInvoice);
    res.status(200).json({ message: "Phiếu nhập đã được xóa thành công" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Mời kiểm tra lại kết nối" });
  }
};


const updateCustomerAdd = async (purchaseInvoice) => {

  const id= purchaseInvoice.customer._id;
  const customer=await Customer.findById(id);
  const agency= await Agency.findById(id);
  const provider= await Provider.findById(id);
  
  let purchaseInvoiceCustomer = customer|| agency|| provider;
  if(!purchaseInvoiceCustomer )
  {
  console.log("customer not found");
  return;
  }
  if(customer && purchaseInvoice.status ==="gửi tại kho"){

  switch(purchaseInvoice.type) {
  case "cà tươi": purchaseInvoiceCustomer.totalRawCF += purchaseInvoice.totalAmount;
  break;
  case "cà nhân" : purchaseInvoiceCustomer.totalCF += purchaseInvoice.totalAmount;
  break;
  case "tiêu": purchaseInvoiceCustomer.totalPepper += purchaseInvoice.totalAmount;
  break;
  case "tiền": purchaseInvoiceCustomer.credit += purchaseInvoice.totalAmount;
  break;

  }
   const newcustomer =await Customer.findByIdAndUpdate(customer._id, purchaseInvoiceCustomer, {new: true});
 
  }
  else if(agency)
  {
    purchaseInvoiceCustomer.credit += purchaseInvoice.importPrice;
   const newcustomer= await Agency.findByIdAndUpdate(agency._id, purchaseInvoiceCustomer, {new: true});
    
  }
  else if(provider)
  {
    purchaseInvoiceCustomer.credit += purchaseInvoice.importPrice;
  const newcustomer = await Provider.findByIdAndUpdate(provider._id, purchaseInvoiceCustomer, {new: true});

  }

}


const updateCustomerUpdate = async (purchaseInvoice, oldPurchaseInvoice) => {

  const id= purchaseInvoice.customer._id;
  const customer=await Customer.findById(id);
  const agency= await Agency.findById(id);
  const provider= await Provider.findById(id);
  
  let purchaseInvoiceCustomer = customer|| agency|| provider;
  if(!purchaseInvoiceCustomer )
  {
  console.log("customer not found");
  return;
  }
  if(customer && purchaseInvoice.status ==="gửi tại kho"){

  switch(purchaseInvoice.type) {
  case "cà tươi": purchaseInvoiceCustomer.totalRawCF += purchaseInvoice.totalAmount - oldPurchaseInvoice.totalAmount ;
  break;
  case "cà nhân" : purchaseInvoiceCustomer.totalCF += purchaseInvoice.totalAmount - oldPurchaseInvoice.totalAmount;
  break;
  case "tiêu": purchaseInvoiceCustomer.totalPepper += purchaseInvoice.totalAmount - oldPurchaseInvoice.totalAmount;
  break;
  case "tiền": purchaseInvoiceCustomer.credit += purchaseInvoice.totalAmount - oldPurchaseInvoice.totalAmount;
  break;

  }
   const newcustomer =await Customer.findByIdAndUpdate(customer._id, purchaseInvoiceCustomer, {new: true});
 
  }
  else if(agency)
  {
    purchaseInvoiceCustomer.credit += purchaseInvoice.importPrice - oldPurchaseInvoice.importPrice;
   const newcustomer= await Agency.findByIdAndUpdate(agency._id, purchaseInvoiceCustomer, {new: true});
    
  }
  else if(provider)
  {
    purchaseInvoiceCustomer.credit += purchaseInvoice.importPrice - oldPurchaseInvoice.importPrice;
  const newcustomer = await Provider.findByIdAndUpdate(provider._id, purchaseInvoiceCustomer, {new: true});

  }

}


const updateCustomerDelete = async (purchaseInvoice) => {

  const id= purchaseInvoice.customer._id;
  const customer=await Customer.findById(id);
  const agency= await Agency.findById(id);
  const provider= await Provider.findById(id);
  
  let purchaseInvoiceCustomer = customer|| agency|| provider;
  if(!purchaseInvoiceCustomer )
  {
  console.log("customer not found");
  return;
  }
  if(customer && purchaseInvoice.status ==="gửi tại kho"){

  switch(purchaseInvoice.type) {
  case "cà tươi": purchaseInvoiceCustomer.totalRawCF -= purchaseInvoice.totalAmount  ;
  break;
  case "cà nhân" : purchaseInvoiceCustomer.totalCF -= purchaseInvoice.totalAmount ;
  break;
  case "tiêu": purchaseInvoiceCustomer.totalPepper -= purchaseInvoice.totalAmount;
  break;
  case "tiền": purchaseInvoiceCustomer.credit -= purchaseInvoice.totalAmount ;
  break;

  }
   const newcustomer =await Customer.findByIdAndUpdate(customer._id, purchaseInvoiceCustomer, {new: true});
 
  }
  else if(agency)
  {
    purchaseInvoiceCustomer.credit -= purchaseInvoice.importPrice;
   const newcustomer= await Agency.findByIdAndUpdate(agency._id, purchaseInvoiceCustomer, {new: true});
    
  }
  else if(provider)
  {
    purchaseInvoiceCustomer.credit -= purchaseInvoice.importPrice ;
  const newcustomer = await Provider.findByIdAndUpdate(provider._id, purchaseInvoiceCustomer, {new: true});

  }

}