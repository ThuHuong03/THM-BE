import express from 'express';
import customerRouter from  './routers/customer'
import agencyRouter from './routers/agency'
import providerRouter from './routers/provider'
import fertilizerRouter from './routers/fertilizer';
import billRouter from './routers/bill';
import purchaseInvoiceRouter from './routers/purchaseInvoice';
import saleInvoiceRouter from './routers/saleInvoice';
import invoiceRouter from './routers/invoice';
import inventoryRouter from './routers/inventory';
import { connectDB } from './config/db';
import dotenv from 'dotenv'
import cors from 'cors';
const app= express();
dotenv.config();
//middleware
app.use(express.json());
app.use(cors())
// connect database
connectDB(process.env.DB_URI);

//routes
app.use('/', customerRouter );
app.use('/', agencyRouter);
app.use('/',providerRouter);
app.use('/', fertilizerRouter)
app.use('/', billRouter );
app.use('/', purchaseInvoiceRouter);
app.use('/', saleInvoiceRouter);
app.use('/', invoiceRouter);
app.use('/', inventoryRouter);


app.listen(8080, () => {
    console.log('Server running on port 8080');
  });
export const viteNodeApp =app;