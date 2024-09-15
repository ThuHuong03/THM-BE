import SaleInvoice from "../model/saleInvoice";
import { addSaleInvoiceSchema } from "../schemas/saleInvoice";
import Customer from "../model/customer";



export const getSaleInvoices = async () => {
    try {

        const saleInvoices = await SaleInvoice.find();
        
       
        const updatedSaleInvoices = saleInvoices.map(invoice => ({
          ...invoice.toObject(), 
          title: "Phiếu Bán"
        }));
        
        return updatedSaleInvoices;
      } catch (error) {
        console.error("Error fetching SaleInvoices by customer ID:", error);
        throw error;
      }
};

export const getSaleInvoiceById= async (req, res) => {
    try {
      const id= req.params;
      const saleInvoice = await SaleInvoice.findById(id);
      res.status(200).json(saleInvoice);
    } catch (error) {
        console.log(error);
      res.status(500).json({ error: "Mời kiểm tra lại kết nối" });
    }
  
  }
  
  export const getSaleInvoicesByCustomerId = async (customerId) => {
    try {

      const saleInvoices = await SaleInvoice.find({ 'customer._id': customerId });
      
     
      const updatedSaleInvoices = saleInvoices.map(invoice => ({
        ...invoice.toObject(), 
        title: "Phiếu Bán"
      }));
      
      return updatedSaleInvoices;
    } catch (error) {
      console.error("Error fetching SaleInvoices by customer ID:", error);
      throw error;
    }
  };
export const addSaleInvoice = async (req, res) => {
  const { error } = addSaleInvoiceSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    // Extract error messages
    const errorMessages = error.details.map((err) => err.message);

    // Send the error messages as a response
    return res.status(400).json({ errors: errorMessages });
  }
 
  
  try {
    // Uncomment the following lines to save the agency data
    const data = await SaleInvoice(req.body).save();
    const customer=await updateCustomerAdd(req.body);
    console.log("update customer",customer);
    
    res.status(201).json({invoice: data, customer:customer } );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Mời kiểm tra lại kết nối" });
  }
};

export const editSaleInvoice = async (req, res) => {
  const { error } = addSaleInvoiceSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    // Extract error messages
    const errorMessages = error.details.map((err) => err.message);

    // Send the error messages as a response
    return res.status(400).json({ errors: errorMessages });
  }

  try {
    const { id } = req.params;
    const saleInvoice = await SaleInvoice.findById(id);
    const updatedSaleInvoice = await SaleInvoice.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );

    
 
    if (!updatedSaleInvoice) {
      return res.status(404).json({ error: "Phiếu xuất không tìm thấy" });
    }
    res.status(200).json(updatedSaleInvoice);
    updateCustomerUpdate(updatedSaleInvoice,saleInvoice);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Mời kiểm tra lại kết nối" });
  }
};
export const deleteSaleInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSaleInvoice = await SaleInvoice.findByIdAndDelete(id);

    if (!deletedSaleInvoice) {
      return res.status(404).json({ error: "Phiếu xuất không tìm thấy" });
    }

    updateCustomerDelete(deletedSaleInvoice);
    res.status(200).json({ message: "Phiếu xuất đã được xóa thành công" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Mời kiểm tra lại kết nối" });
  }
};

const updateCustomerAdd = async (SaleInvoice) => {
  const id = SaleInvoice.customer._id;
  const customer = await Customer.findById(id);


  let SaleInvoiceCustomer = customer ;
  if (!SaleInvoiceCustomer) {
    console.log("customer not found");
    return;
  }
 
    switch (SaleInvoice.type) {
      case "cà tươi":
        SaleInvoiceCustomer.totalRawCF -= SaleInvoice.totalAmount;
          SaleInvoiceCustomer.credit +=
            SaleInvoice.salePrice ;
        
        
        break;
        case "cà nhân":
            SaleInvoiceCustomer.totalCF -= SaleInvoice.totalAmount;
              SaleInvoiceCustomer.credit +=
                SaleInvoice.salePrice ;
            
            
            break;
            case "tiêu":
        SaleInvoiceCustomer.totalPepper -= SaleInvoice.totalAmount;
          SaleInvoiceCustomer.credit +=
            SaleInvoice.salePrice ;
        
        
        break;
        default: break;
    }
    const newcustomer = await Customer.findByIdAndUpdate(
      customer._id,
      SaleInvoiceCustomer,
      { new: true }
    );
    console.log("update",newcustomer);
    return newcustomer;
  
};

const updateCustomerUpdate = async (SaleInvoice, oldSaleInvoice) => {
    const id = SaleInvoice.customer._id;
    const customer = await Customer.findById(id);
  
  
    let SaleInvoiceCustomer = customer ;
    if (!SaleInvoiceCustomer) {
      console.log("customer not found");
      return;
    }
   
      switch (SaleInvoice.type) {
        case "cà tươi":
          SaleInvoiceCustomer.totalRawCF -= SaleInvoice.totalAmount + oldSaleInvoice.totalAmount;
            SaleInvoiceCustomer.credit +=
              SaleInvoice.salePrice - oldSaleInvoice.salePrice;
          
          
          break;
          case "cà nhân":
              SaleInvoiceCustomer.totalCF -= SaleInvoice.totalAmount + oldSaleInvoice.totalAmount;
                SaleInvoiceCustomer.credit +=
                  SaleInvoice.salePrice- oldSaleInvoice.salePrice ;
              
              
              break;
              case "tiêu":
          SaleInvoiceCustomer.totalPepper -= SaleInvoice.totalAmount + oldSaleInvoice.totalAmount;
            SaleInvoiceCustomer.credit +=
              SaleInvoice.salePrice - oldSaleInvoice.salePrice;
          
          
          break;
          default: break;
      }
      const newcustomer = await Customer.findByIdAndUpdate(
        customer._id,
        SaleInvoiceCustomer,
        { new: true }
      );

};

const updateCustomerDelete = async (SaleInvoice) => {
  const id = SaleInvoice.customer._id;
  const customer = await Customer.findById(id);


  let SaleInvoiceCustomer = customer ;
  if (!SaleInvoiceCustomer) {
    console.log("customer not found");
    return;
  }
 
    switch (SaleInvoice.type) {
      case "cà tươi":
        SaleInvoiceCustomer.totalRawCF += SaleInvoice.totalAmount;
          SaleInvoiceCustomer.credit -=
            SaleInvoice.salePrice ;
        
        
        break;
        case "cà nhân":
            SaleInvoiceCustomer.totalCF += SaleInvoice.totalAmount;
              SaleInvoiceCustomer.credit -=
                SaleInvoice.salePrice ;
            
            
            break;
            case "tiêu":
        SaleInvoiceCustomer.totalPepper += SaleInvoice.totalAmount;
          SaleInvoiceCustomer.credit -=
            SaleInvoice.salePrice ;
        
        
        break;
        default: break;
    }
    const newcustomer = await Customer.findByIdAndUpdate(
      customer._id,
      SaleInvoiceCustomer,
      { new: true }
    );
};
