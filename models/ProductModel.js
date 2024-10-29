import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    stockStatus: {
        type: String,
        enum: ['In Stock', 'Out of Stock'],
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
},
{ 
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;