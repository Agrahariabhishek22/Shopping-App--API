const express=require('express');
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser } = require('../controllers/userController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router=express.Router();

// controllers
// routes
router.post('/user/register',registerUser);
router.post('/user/login',loginUser);
router.get('/user/logout',logoutUser);
router.post('/password/forgot',forgotPassword);
router.put('/password/reset/:token',resetPassword);
router.get('/me',isAuthenticatedUser,getUserDetails);
router.put('/password/update',isAuthenticatedUser,updatePassword)
router.put('/me/update',isAuthenticatedUser,updateProfile)
router.get('/admin/users',isAuthenticatedUser,authorizeRoles("admin"),getAllUsers);

router.get('/admin/user/:id',isAuthenticatedUser,authorizeRoles("admin"),getSingleUser);
router.put('/admin/user/:id',isAuthenticatedUser,authorizeRoles("admin"),updateUserRole);
router.delete('/admin/user/:id',isAuthenticatedUser,authorizeRoles("admin"),deleteUser);
 

module.exports=router;
