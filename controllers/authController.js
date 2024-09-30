const Business = require('../models/Business');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

exports.register = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (!email) {
    return res.status(402).json({ error: 'A valid email is required' });
  }

  if (!password || password.length < 6) {
    return res.status(403).json({ error: 'Password must be at least 6 characters long' });
  }

  if (!phone) {
    return res.status(404).json({ error: 'A valid 10-digit phone number is required' });
  }

  if (!role || !['owner', 'employee'].includes(role)) {
    return res.status(405).json({ error: 'Role must be either Owner or Employee' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email or phone number already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const user = new User({ name, email, password: hashedPassword, phone, role });
    await user.save();

    const token = generateToken(user);

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.seeEmployeePendingRequests = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await  User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // const pendingRequests = user.businessRequests;
        res.status(200).json({ user: user.businessRequests });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
