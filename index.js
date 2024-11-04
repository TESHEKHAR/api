import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import categoryRoute from './routes/categoryRoute.js'; 
import productRoutes from './routes/productRoute.js'
import cors from 'cors'; 

dotenv.config();
connectDB();
const app = express();

const port = process.env.PORT || 4000;

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
}));

app.use('/uploads', express.static('uploads'));
app.use(express.json());

app.use('/api/categories', categoryRoute);
app.use('/api/products', productRoutes);

app.get('/', (req,res) => {
    res.send("Hello World")
});

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})