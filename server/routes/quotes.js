import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import Quote from '../models/Quote.js';

const router = Router();

const submitLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });

const FIELDS = ['name', 'phone', 'pickup', 'drop', 'goods', 'vehicle', 'date', 'message'];

router.post('/', submitLimiter, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ ok: false, error: 'Service temporarily unavailable, please call us directly' });
  }
  try {
    const data = {};
    for (const f of FIELDS) if (typeof req.body?.[f] === 'string') data[f] = req.body[f].trim();
    data.phone = (data.phone || '').replace(/\D/g, '').slice(-10);

    const missing = ['name', 'phone', 'pickup', 'drop'].filter((f) => !data[f]);
    if (missing.length) return res.status(400).json({ ok: false, error: `Missing: ${missing.join(', ')}` });
    if (!/^[6-9]\d{9}$/.test(data.phone)) return res.status(400).json({ ok: false, error: 'Enter a valid 10-digit mobile number' });

    const quote = await Quote.create(data);
    res.status(201).json({ ok: true, id: quote._id });
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ ok: false, error: 'Please check the details entered' });
    console.error(err);
    res.status(500).json({ ok: false, error: 'Server error, please call us directly' });
  }
});

// Admin listing: GET /api/quotes  (header: x-admin-key: <ADMIN_KEY>)
router.get('/', async (req, res) => {
  if (!process.env.ADMIN_KEY || req.get('x-admin-key') !== process.env.ADMIN_KEY) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }
  const quotes = await Quote.find().sort({ createdAt: -1 }).limit(200).lean();
  res.json({ ok: true, quotes });
});

export default router;
