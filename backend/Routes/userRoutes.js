const router = require('express').Router();
const UserModel = require('../Models/User');
const bcrypt = require('bcryptjs');
const ensureAuthenticated = require('./Middlewares/auth');
const ADMIN_EMAIL = 'ritualcake2019@gmail.com';

const isAdminUser = (user) => user?.email?.toLowerCase() === ADMIN_EMAIL;

router.get('/user', ensureAuthenticated, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id); 
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    res.json({
      success: true,
      user: {
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: isAdminUser(user) ? 'admin' : user.role,
        mobile: user.mobile,
        dob: user.dob,
        address: user.address,
      },
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data', success: false });
  }
});

router.put('/user', ensureAuthenticated, async (req, res) => {
  try {
    const { name, surname, email, password, address, mobile, dob } = req.body;
    const user = await UserModel.findById(req.user._id); 
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    if (name) user.name = name;
    if (surname) user.surname = surname;
    if (address) user.address = address;
    if (mobile) user.mobile = mobile;
    if (dob) user.dob = dob;
    if (password) user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.status(200).json({
      message: `User details updated successfully at ${new Date().toLocaleString()}`,
      success: true,
      user: {
        name: user.name,
        surname: user.surname,
        email: user.email,
        mobile: user.mobile,
        dob: user.dob,
        address: user.address,
      },
    });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ message: 'Error updating user data', success: false });
  }
});

router.get('/admin/authorize', ensureAuthenticated, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);

    if (!isAdminUser(user)) {
      return res.status(403).json({ authorized: false, message: 'Admin access denied' });
    }

    res.json({ authorized: true });
  } catch (error) {
    console.error('Error authorizing admin:', error);
    res.status(500).json({ authorized: false, message: 'Error authorizing admin' });
  }
});

router.get('/users', ensureAuthenticated, async (req, res) => {
  try {
    const users = await UserModel.find(); 
    res.json(users); 
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Error fetching users data' });
  }
});
router.delete('/users/:id', ensureAuthenticated, async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await UserModel.findByIdAndDelete(userId); 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;
