const express           = require('express')
const { body, validationResult } = require('express-validator')
const Registration      = require('../models/Registration')

const router = express.Router()

// ── Validators ───────────────────────────────────────────────────────────────
const registerRules = [
  body('dogName')
    .trim().notEmpty().withMessage('Dog name is required')
    .isLength({ min: 3 }).withMessage('Dog name must be at least 3 characters'),

  body('dogBreed')
    .trim().notEmpty().withMessage('Dog breed is required'),

  body('dogColor1')
    .notEmpty().withMessage('Primary color is required')
    .isIn(['Black', 'White', 'Brown', 'Gray']).withMessage('Invalid primary color'),

  body('dogColor2')
    .optional({ checkFalsy: true })
    .isIn(['Black', 'White', 'Brown', 'Gray']).withMessage('Invalid secondary color'),

  body('dogDob')
    .notEmpty().withMessage('Date of birth is required')
    .isISO8601().withMessage('Invalid date format')
    .custom((val) => {
      if (new Date(val) > new Date()) throw new Error('Date of birth cannot be in the future')
      return true
    }),

  body('dogGender')
    .isIn(['male', 'female']).withMessage('Gender is required'),

  body('neutered')
    .isIn(['yes', 'no']).withMessage('Neutered field is required'),

  body('spayed')
    .isIn(['yes', 'no']).withMessage('Spayed field is required'),

  body('ownerName')
    .trim().notEmpty().withMessage('Owner name is required'),

  body('email')
    .trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Enter a valid email address').normalizeEmail(),

  body('address')
    .trim().notEmpty().withMessage('Address is required'),

  body('city')
    .trim().notEmpty().withMessage('City is required'),

  body('state')
    .trim().notEmpty().withMessage('State is required'),

  body('postalCode')
    .notEmpty().withMessage('Postal code is required')
    .matches(/^\d+$/).withMessage('Postal code must contain digits only'),

  body('phoneNum')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^\d{10}$/).withMessage('Phone number must be exactly 10 digits'),
]

// ── POST /api/register ───────────────────────────────────────────────────────
router.post('/register', registerRules, async (req, res) => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    const errors = result.array().reduce((acc, e) => {
      acc[e.path] = e.msg
      return acc
    }, {})
    return res.status(400).json({ success: false, message: 'Validation failed', errors })
  }

  try {
    await Registration.create(req.body)
    res.status(201).json({ success: true, message: 'Registration completed successfully.' })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ success: false, message: 'Server error. Please try again.' })
  }
})

// ── GET /api/registrations ───────────────────────────────────────────────────
router.get('/registrations', async (req, res) => {
  try {
    const {
      page      = 1,
      limit     = 10,
      search    = '',
      sortOrder = 'desc',
    } = req.query

    const pageNum  = Math.max(1, parseInt(page)  || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10))
    const skip     = (pageNum - 1) * limitNum

    const query = search
      ? {
          $or: [
            { dogName:   { $regex: search, $options: 'i' } },
            { ownerName: { $regex: search, $options: 'i' } },
            { email:     { $regex: search, $options: 'i' } },
          ],
        }
      : {}

    const sort = { createdAt: sortOrder === 'asc' ? 1 : -1 }

    const [data, total] = await Promise.all([
      Registration.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
      Registration.countDocuments(query),
    ])

    res.json({
      success: true,
      data,
      total,
      page:  pageNum,
      pages: Math.ceil(total / limitNum) || 1,
    })
  } catch (err) {
    console.error('Fetch error:', err)
    res.status(500).json({ success: false, message: 'Failed to fetch registrations.' })
  }
})

module.exports = router
