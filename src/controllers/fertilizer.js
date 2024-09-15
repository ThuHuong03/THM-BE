import Fertilizer from "../model/fertilizer";
import { addFertilizerSchema } from "../schemas/fertilizer";
import { getBillsByFertilizerrId } from "./bill";
import { getPurchaseInvoicesByFertilizerId } from "./purchaseInvoice";

// Get all fertilizers
export const getFertilizers = async (req, res) => {
    try {
        const fertilizers = await Fertilizer.find();
        const updateFertilizers = await Promise.all(fertilizers.map(async (fertilizer) => {
            let totalExportMoney = 0;
            let totalImportMoney = 0;
            const id = fertilizer._id;
          
            // Lấy các hóa đơn xuất
            const bills = await getBillsByFertilizerrId(id);
            bills.forEach((bill) => {
              
                totalExportMoney += bill.totalAmount;
              
            });
          
            // Lấy các hóa đơn nhập
            const purchaseInvoices = await getPurchaseInvoicesByFertilizerId(id);
            purchaseInvoices.forEach((invoice) => {
              
                totalImportMoney += invoice.totalAmount;
              
            });
          
            // Cập nhật thông tin vào phân
            return {
              ...fertilizer._doc, // Giữ lại tất cả các thuộc tính hiện tại của ohaan
              totalExportMoney,
              totalImportMoney,
            };
          }));
          
          res.status(200).json( updateFertilizers );

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Mời kiểm tra lại kết nối' });
    }
};

// Add a new fertilizer
export const addFertilizer = async (req, res) => {
    const { error } = addFertilizerSchema.validate(req.body, { abortEarly: false });

    if (error) {
        // Extract error messages
        const errorMessages = error.details.map(err => err.message);
        
        // Send the error messages as a response
        return res.status(400).json({ errors: errorMessages });
    }

    try {
        const data = await Fertilizer(req.body).save();
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Mời kiểm tra lại kết nối' });
    }
};

// Edit an existing fertilizer
export const editFertilizer = async (req, res) => {
    const { error } = addFertilizerSchema.validate(req.body, { abortEarly: false });

    if (error) {
        // Extract error messages
        const errorMessages = error.details.map(err => err.message);
        
        // Send the error messages as a response
        return res.status(400).json({ errors: errorMessages });
    }

    try {
        const { id } = req.params;
        const updatedFertilizer = await Fertilizer.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedFertilizer) {
            return res.status(404).json({ error: 'Phân bón không tìm thấy' });
        }
        res.status(200).json(updatedFertilizer);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Mời kiểm tra lại kết nối' });
    }
};

// Delete a fertilizer
export const deleteFertilizer = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFertilizer = await Fertilizer.findByIdAndDelete(id);
        if (!deletedFertilizer) {
            return res.status(404).json({ error: 'Phân bón không tìm thấy' });
        }
        res.status(200).json({ message: 'Phân bón đã được xóa thành công' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Mời kiểm tra lại kết nối' });
    }
};
export const getNameFertilizer = async (id) => {
    try {
      
        const fertilizer = await Fertilizer.findById(id);
        if (!fertilizer) {
            throw new Error({ error: 'Phân bón không tìm thấy' });
        }
      
        return fertilizer.name;
    } catch (error) {
        console.log(error);
    }
};
export const getNameFertilizerById = async (req, res ) => {
    try {
      const {id}= req.params;
        const fertilizer = await Fertilizer.findById(id);
        if (!fertilizer) {
            throw new Error({ error: 'Phân bón không tìm thấy' });
        }
      
       res.status(200).json( fertilizer.name);
    } catch (error) {
        console.log(error);
        res.status(404).json(message.error);
    }
};

