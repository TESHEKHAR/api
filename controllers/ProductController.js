import Product from '../models/ProductModel.js'; // Adjust the import path as needed
import fs from 'fs'; // For file operations
import path from 'path';

// Create a new product
// export const createProduct = async (req, res) => {
//   try {
//     const { productName, category, price, description, stockStatus } = req.body;
//     const image = req.file ? req.file.path : null; // Get image path from multer

//     const product = new Product({ productName, category, price, description, stockStatus, image });
//     await product.save();
//     res.status(201).json({ message: 'Product created successfully', product });
//   } catch (error) {
//     res.status(400).json({ message: 'Error creating product', error: error.message });
//   }
// };


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


// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Get a single product by ID
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

// Update a product by ID
// export const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedData = req.body;
//     const product = await Product.findById(id);

//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Check if a new image is being uploaded
//     if (req.file) {
//       // Delete the old image file if it exists
//       if (product.image) {
//         fs.unlinkSync(product.image); // Deletes the old image file
//       }
//       updatedData.image = req.file.path; // Update to new image path
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
//     res.status(200).json({ message: 'Product updated successfully', updatedProduct });
//   } catch (error) {
//     res.status(400).json({ message: 'Error updating product', error: error.message });
//   }
// };

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if a new image is being uploaded
    if (req.file) {
      // Delete the old image file if it exists
      if (product.image) {
        // Extract the filename from the URL
        const oldImagePath = product.image.replace(/^https?:\/\/[^\/]+/, ''); // Remove protocol and host
        const fullOldImagePath = path.join(process.cwd(), 'uploads', oldImagePath); // Assuming images are stored in 'uploads' folder

        // Check if the old image exists and unlink it
        if (fs.existsSync(fullOldImagePath)) {
          fs.unlinkSync(fullOldImagePath); // Deletes the old image file if it exists
        }
      }
      // Update to new image path
      updatedData.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json({ message: 'Product updated successfully', updatedProduct });
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete the image file
    if (product.image) {
      fs.unlinkSync(product.image); // Deletes the image file
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};
