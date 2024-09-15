import Provider from "../model/provider";
import { addProviderSchema } from "../schemas/provider";
import { getBillsByCustomerId } from "./bill";
import { updateInventoryAdd } from "./inventory";
import { getPurchaseInvoicesByCustomerId } from "./purchaseInvoice";
import {  getSaleInvoicesByCustomerId } from "./saleInvoice";
export const getProviders = async (req, res) => {
    try {
        const providers = await Provider.find();
        res.status(200).json(providers);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Mời kiểm tra lại kết nối' });
    }
};

export const addProvider = async (req, res) => {
    const { error } = addProviderSchema.validate(req.body, { abortEarly: false });

    if (error) {
        // Extract error messages
        const errorMessages = error.details.map(err => err.message);
        
        // Send the error messages as a response
        return res.status(400).json({ errors: errorMessages });
    }

    try {
        const data = await Provider(req.body).save();
        updateInventoryAdd(false, data)
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Mời kiểm tra lại kết nối' });
    }
};

export const editProvider = async (req, res) => {
    const { error } = addProviderSchema.validate(req.body, { abortEarly: false });

    if (error) {
        // Extract error messages
        const errorMessages = error.details.map(err => err.message);
        
        // Send the error messages as a response
        return res.status(400).json({ errors: errorMessages });
    }

    try {
        const { id } = req.params;
        const updatedProvider = await Provider.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProvider) {
            return res.status(404).json({ error: 'Nhà cung cấp không tìm thấy' });
        }
        res.status(200).json(updatedProvider);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Mời kiểm tra lại kết nối' });
    }
};

export const deleteProvider = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProvider = await Provider.findByIdAndDelete(id);
        if (!deletedProvider) {
            return res.status(404).json({ error: 'Nhà cung cấp không tìm thấy' });
        }
        res.status(200).json({ message: 'Nhà cung cấp đã được xóa thành công' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Mời kiểm tra lại kết nối' });
    }
};

export const getProviderById = async (req, res) => {

    try {
          const { id } = req.params;
          const provider = await Provider.findById(id);

          let invoices= [];
         invoices= invoices.concat(await getBillsByCustomerId(id));
         
            invoices= invoices.concat(await getPurchaseInvoicesByCustomerId(id));

          invoices.sort((a, b) => parseDate(b.date) - parseDate(a.date));
        
        res.status(200).json({ provider: provider, invoices: invoices });
    } catch (error) {
         console.log(error);
        res.status(500).json({ error: 'Mời kiểm tra lại kết nối' });
    }
}

const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
    };
    