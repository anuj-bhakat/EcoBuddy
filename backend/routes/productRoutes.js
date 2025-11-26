import express from 'express';
import * as productController from '../controllers/productController.js';

const router = express.Router();

router.post('/', productController.addProduct);                     // Add product
router.put('/:id', productController.updateProduct);                // Update product
router.delete('/:id', productController.deleteProduct);             // Delete product
router.get('/', productController.getAllProducts);                  // Get all products
router.get('/available', productController.getAvailableProducts);   // Get all available
router.get('/:id', productController.getProductById);               // Get product by id (basic)
router.get('/:id/details', productController.getProductDetails);    // Get product + creator + user details

export default router;
