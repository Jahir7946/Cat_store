import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/orders - Create new order (authenticated)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { items, shippingInfo, paymentInfo } = req.body;

    // Validate items and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ message: `Producto no encontrado: ${item.productId}` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuficiente para ${product.name}` });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
    }

    const shipping = 0; // Free shipping for now
    const total = subtotal + shipping;

    // Create order
    const order = new Order({
      user: req.user.userId,
      items: orderItems,
      shippingInfo,
      paymentInfo: {
        cardNumber: paymentInfo.cardNumber.slice(-4), // Only store last 4 digits
        expiryDate: paymentInfo.expiryDate,
        cvc: '***' // Don't store CVC
      },
      subtotal,
      shipping,
      total
    });

    await order.save();

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Populate order with product details
    const populatedOrder = await Order.findById(order._id)
      .populate('items.product')
      .populate('user', 'name email');

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ message: 'Error al crear pedido', error: error.message });
  }
});

// GET /api/orders - Get user's orders (authenticated)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error al obtener pedidos' });
  }
});

// GET /api/orders/:id - Get specific order (authenticated)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user.userId 
    })
    .populate('items.product')
    .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error al obtener pedido' });
  }
});

// PUT /api/orders/:id/status - Update order status (admin only)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(400).json({ message: 'Error al actualizar estado del pedido', error: error.message });
  }
});

// GET /api/orders/admin/all - Get all orders (admin only)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('items.product')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Error al obtener todos los pedidos' });
  }
});

export default router;
