import Agency from "../model/agency";
import { addAgencySchema } from "../schemas/agency";
import { getBillsByCustomerId } from "./bill";
import { updateInventoryAdd } from "./inventory";
import { getPurchaseInvoicesByCustomerId } from "./purchaseInvoice";
import {  getSaleInvoicesByCustomerId } from "./saleInvoice";
export const getAgencies = async (req, res) => {
    try {
        const agencies = await Agency.find();
        res.status(200).json(agencies);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Mời kiểm tra lại kết nối' });
    }
};

export const addAgency = async (req, res) => {
    const { error } = addAgencySchema.validate(req.body, { abortEarly: false });

    if (error) {
        // Extract error messages
        const errorMessages = error.details.map(err => err.message);
        
        // Send the error messages as a response
        return res.status(400).json({ errors: errorMessages });
    }



    try {
        // Uncomment the following lines to save the agency data
        const data = await Agency(req.body).save();
        updateInventoryAdd(false, data);
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Mời kiểm tra lại kết nối' });
    }
};
export const editAgency = async (req, res) => {
    const { error } = addAgencySchema.validate(req.body, { abortEarly: false });

    if (error) {
        // Extract error messages
        const errorMessages = error.details.map(err => err.message);
        
        // Send the error messages as a response
        return res.status(400).json({ errors: errorMessages });
    }

    try {
        const { id } = req.params;
        const updatedAgency = await Agency.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedAgency) {
            return res.status(404).json({ error: 'nhà cung cấp không tìm thấy' });
        }
        res.status(200).json(updatedAgency);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Mời kiểm tra lại kết nối' });
    }
};
export const deleteAgency = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(req.params);
        const deletedAgency = await Agency.findByIdAndDelete(id);
        if (!deletedAgency) {
            return res.status(404).json({ error: 'nhà cung cấp không tìm thấy' });
        }
        res.status(200).json({ message: 'nhà cung cấp đã được xóa thành công' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Mời kiểm tra lại kết nối' });
    }
};
export const getAgencyById = async (req, res) => {

    try {
          const { id } = req.params;
          const agency = await Agency.findById(id);
          let invoices= [];
          invoices= invoices.concat(getBillsByCustomerId(id));
           invoices= invoices.concat(getPurchaseInvoicesByCustomerId(id));
    
   invoices.sort((a, b) => parseDate(b.date) - parseDate(a.date));

        res.status(200).json({ agency: agency, invoices: invoices });
    } catch (error) {
         console.log(error);
        res.status(500).json({ error: 'Mời kiểm tra lại kết nối' });
    }
}

const parseDate = (dateString) => {
const [day, month, year] = dateString.split('/');
return new Date(`${year}-${month}-${day}`);
};
