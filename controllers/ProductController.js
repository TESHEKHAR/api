import Product from '../models/ProductModel.js';
import fs from 'fs'; 
import path from 'path';

export const createProduct = async (req, res) => {
  try {
    const { productName, category, price, description, stockStatus } = req.body;
    const image = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

    const product = new Product({ productName, category, price, description, stockStatus, image });
    await product.save();

    res.status(201).json({ 
      message: 'Product created successfully', 
      product: {
        ...product.toObject(),
        image 
      }
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (req.file) {
      if (product.image) {
        const oldImagePath = product.image.replace(`${req.protocol}://${req.get('host')}/uploads/`, '');
        const fullOldImagePath = path.join(process.cwd(), 'uploads', oldImagePath);

        if (fs.existsSync(fullOldImagePath)) {
          try {
            fs.unlinkSync(fullOldImagePath);
            console.log('Old image deleted successfully');
          } catch (unlinkError) {
            console.error(`Failed to delete old image: ${unlinkError.message}`);
          }
        }
      }
      updatedData.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json({ message: 'Product updated successfully', updatedProduct });
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.image) {
      const imagePath = product.image.replace(`${req.protocol}://${req.get('host')}/uploads/`, '');
      const fullImagePath = path.join(process.cwd(), 'uploads', imagePath);

      if (fs.existsSync(fullImagePath)) {
        try {
          fs.unlinkSync(fullImagePath);
          console.log('Image deleted successfully');
        } catch (unlinkError) {
          console.error(`Failed to delete image: ${unlinkError.message}`);
        }
      }
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};
