
import { getBills } from './bill';
import { getNameFertilizer } from './fertilizer';
import { getPurchaseInvoices } from './purchaseInvoice';
import { getSaleInvoices } from './saleInvoice';

export default async function getInvoices(req, res) {
    try {
   
        let invoices= [];
       invoices = invoices.concat(await getBills());
      invoices = invoices.concat(await getPurchaseInvoices());
      invoices = invoices.concat(await getSaleInvoices());
      invoices.sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('-'));
        const dateB = new Date(b.date.split('/').reverse().join('-'));
        return dateB - dateA;
    });

    const updateInvoices = async () => {
      const updatedInvoices = await Promise.all(
        invoices.map(async (invoice) => {
          if (invoice.type !== 'tiền' && invoice.type !== 'tiêu' && invoice.type !== 'cà tươi' && invoice.type !== 'cà nhân') {
            try {
              const name = await getNameFertilizer(invoice.type);
              console.log(invoice.type, name);
              return {
                ...invoice,
                type: name
              };
            } catch (error) {
              console.error('Error fetching fertilizer name:', error);
              // Nếu có lỗi, trả về invoice không thay đổi
              return invoice;
            }
          }
          // Nếu không thỏa mãn điều kiện, giữ nguyên invoice
          return invoice;
        })
      );
    
      return updatedInvoices;
    };
    

    updateInvoices().then(updatedInvoices => {
     
        res.status(200).json( updatedInvoices );
    });
    
    
  } catch (error) {
       console.log(error);
      res.status(500).json({ error: 'Mời kiểm tra lại kết nối' });
  }
}

const parseDate = (dateString) => {
const [day, month, year] = dateString.split('/');
return new Date(`${year}-${month}-${day}`);
};

