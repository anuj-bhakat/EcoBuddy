import express from "express";
import * as orderController from "../controllers/orderController.js";

const router = express.Router();

router.post("/", orderController.addOrder);
router.put("/:id", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);
router.get("/:id", orderController.getOrderById);
router.get("/user/:user_id", orderController.getOrdersByUserId);

export default router;
