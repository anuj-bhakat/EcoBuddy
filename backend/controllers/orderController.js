import * as orderService from '../services/orderService.js';
import * as productService from '../services/productService.js';
import * as userService from '../services/userService.js';

// Helper: hydrate order with products and user
const hydrateOrder = async (order) => {
  const products = order.product_ids?.length
    ? await productService.getProductsByIds(order.product_ids)
    : [];
  const user = await userService.getUserById(order.user_id);
  return {
    ...order,
    products,
    user
  };
};

// Add order
export const addOrder = async (req, res) => {
  try {
    const { product_ids, user_id, total_green_points, order_date, delivery_date, status, address } = req.body;
    if (!product_ids || !user_id || !total_green_points) {
      return res.status(400).json({ error: "product_ids, user_id, total_green_points are required." });
    }

    // Generate order_id (yyMMddHHmm format)
    const now = order_date ? new Date(order_date) : new Date();
    const pad = (num) => num.toString().padStart(2, '0');
    const y = now.getUTCFullYear().toString().slice(-2);
    const m = pad(now.getUTCMonth() + 1);
    const d = pad(now.getUTCDate());
    const hh = pad(now.getUTCHours());
    const mm = pad(now.getUTCMinutes());
    const order_id = `ECO-${y}${m}${d}${hh}${mm}`;

    const order = await orderService.addOrder({
      order_id,
      product_ids,
      user_id,
      total_green_points,
      order_date: order_date || now.toISOString(),
      delivery_date,
      status,
      address // pass the address JSON
    });

    res.status(201).json(await hydrateOrder(order));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update order
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    // Accept partial updates including address!
    const updates = req.body;
    const order = await orderService.updateOrder(id, updates);
    res.json(await hydrateOrder(order));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await orderService.deleteOrder(id);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get by order ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);
    res.json(await hydrateOrder(order));
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Get all orders for user, hydrated
export const getOrdersByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const orders = await orderService.getOrdersByUserId(user_id);
    const result = [];
    for (const order of orders) {
      result.push(await hydrateOrder(order));
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
