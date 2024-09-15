import Customer from "../model/customer";
import { addCustomerSchema } from "../schemas/customer";
import { getBillsByCustomerId } from "./bill";
import { updateInventoryAdd } from "./inventory";
import { getPurchaseInvoicesByCustomerId } from "./purchaseInvoice";
import {  getSaleInvoicesByCustomerId } from "./saleInvoice";

export const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        const updatedCustomers = await Promise.all(customers.map(async (customer) => {
            let totalExportMoney = 0;
            let totalImportMoney = 0;
            const id = customer._id;
          
            // Lấy các hóa đơn xuất
            const bills = await getBillsByCustomerId(id);
            bills.forEach((bill) => {
              if (bill.type === "tiền") {
                totalExportMoney += bill.totalAmount;
              }
            });
          
            // Lấy các hóa đơn nhập
            const purchaseInvoices = await getPurchaseInvoicesByCustomerId(id);
            purchaseInvoices.forEach((invoice) => {
              if (invoice.type === "tiền") {
                totalImportMoney += invoice.totalAmount;
              }
            });
          
            // Cập nhật thông tin vào khách hàng
            return {
              ...customer._doc, // Giữ lại tất cả các thuộc tính hiện tại của khách hàng
              totalExportMoney,
              totalImportMoney,
            };
          }));
          
          res.status(200).json( updatedCustomers );
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Mời kiểm tra lại kết nối' });
    }
};

export const addCustomer = async (req, res) => {
    const { error } = addCustomerSchema.validate(req.body, { abortEarly: false });

    if (error) {
        // Extract error messages
        const errorMessages = error.details.map(err => err.message);
        
        // Send the error messages as a response
        return res.status(400).json({ errors: errorMessages });
    }



    try {
        // Uncomment the following lines to save the customer data
        const data = await Customer(req.body).save();
        updateInventoryAdd(true, data);
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Mời kiểm tra lại kết nối' });
    }
};
export const editCustomer = async (req, res) => {
    const { error } = addCustomerSchema.validate(req.body, { abortEarly: false });

    if (error) {
        // Extract error messages
        const errorMessages = error.details.map(err => err.message);
        
        // Send the error messages as a response
        return res.status(400).json({ errors: errorMessages });
    }

    try {
        const { id } = req.params;
        const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedCustomer) {
            return res.status(404).json({ error: 'Khách hàng không tìm thấy' });
        }
        res.status(200).json(updatedCustomer);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Mời kiểm tra lại kết nối' });
    }
};
export const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(req.params);
        const deletedCustomer = await Customer.findByIdAndDelete(id);
        if (!deletedCustomer) {
            return res.status(404).json({ error: 'Khách hàng không tìm thấy' });
        }
        res.status(200).json({ message: 'Khách hàng đã được xóa thành công' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Mời kiểm tra lại kết nối' });
    }
};
export const getCustomerById = async (req, res) => {

    try {
          const { id } = req.params;
          const customer = await Customer.findById(id);
          let invoices= [];
         invoices = invoices.concat(await getBillsByCustomerId(id));
        invoices = invoices.concat(await getPurchaseInvoicesByCustomerId(id));
        invoices = invoices.concat(await getSaleInvoicesByCustomerId(id));
          invoices.sort((a, b) => parseDate(b.date) - parseDate(a.date));

        res.status(200).json({ customer: customer, invoices: invoices });
    } catch (error) {
         console.log(error);
        res.status(500).json({ error: 'Mời kiểm tra lại kết nối' });
    }
}
const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('/');
  return new Date(`${year}-${month}-${day}`);
};
