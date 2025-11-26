import * as productService from '../services/productService.js';

export const addProduct = async (req, res) => {
  try {
    const { name, description, green_points, images, is_available, listed_by } = req.body;
    if (!name || !green_points || !images || !listed_by) {
      return res.status(400).json({ error: "name, green_points, images, listed_by are required" });
    }
    const product = await productService.addProduct({
      name, description, green_points, images, is_available, listed_by
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const product = await productService.updateProduct(id, updates);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getAvailableProducts = async (req, res) => {
  try {
    const products = await productService.getAvailableProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// New: Get full product details with creator and user info
export const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const fullProduct = await productService.getProductWithCreatorAndUser(id);
    res.json(fullProduct);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
