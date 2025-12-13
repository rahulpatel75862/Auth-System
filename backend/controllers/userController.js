const User = require('../models/User');
const bcrypt = require('bcrypt')



exports.getAllUsers = async(req, res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page-1)*limit;
        const totalUsers = await User.countDocuments();
        const users = await User.find().skip(skip).limit(limit).select("-password");
        res.status(200).json({users, totalUsers, totalPage: Math.ceil(totalUsers/page), currentPage: page})
    } catch(error){
        console.log(error.message);
        res.status(500).json({message: 'Server Error'})
    }
}

exports.getUserById = async(req, res) => {
    try{
        const id = req.params.id;

        if(req.user.id !==id){
            return res.status(403).json({error: 'Access Denied'})
        }
        const user = await User.findById(id).select("-password");
        if(!user){
            return res.status(404).json({message: 'User does not exists'}); 
        }
        return res.status(200).json(user);
    } catch(error){
        console.log(error.message);
        res.status(500).json({message: 'Server Error'})
    }
}

exports.updateUser = async(req, res) => {
    try{
        const targetId = req.params.id;
        let {username, email, password} = req.body;
        if(req.user.id!==targetId && req.user.role !=='admin'){
            return res.status(403).json({error: 'Access Denied'});
        }
        const fields = {};
        if(username!==undefined){
            username = String(username).trim();
            if(username===''){
                return res.status(403).json({error: 'username cannot be empty'})
            }
            fields.username = username;
        }
        if(email!==undefined){
            email = String(email).trim().toLowerCase();
            if(email===''){
                return res.status(403).json({error: 'email cannot be empty'});
            }
            fields.email = email;
        }
        if(password !==undefined){
            password = String(password).trim();
            if(password===''){
                return res.status(403).json({error: 'password cannot be empty'});
            }
            fields.password = await bcrypt.hash(password,10);
        }
        if(req.body.role!==undefined){
            if(req.user.role !=='admin'){
                return res.staus(403).json({error: 'Only admin can update role'});
            }
            if(!['user', 'admin'].includes(req.body.role)){
                return res.status(403).json({error:'Invalid role'})
            }
            fields.role = req.body.role;
        }
        const updateUser = await User.findByIdAndUpdate(targetId, fields, {new:true, runValidators: true});
        if(!updateUser){
            return res.status(404).json({error: 'user does not exists'});
        }
        res.status(200).json({updateUser});
    } catch(error){
        console.log(error.message);
        res.status(500).json({message: 'Server Error'})
    }
}

exports.deleteUser = async(req, res) => {
    try{
        const targetId = req.params.id;
        if(req.user.id !==targetId && req.user.role !=='admin'){
            return res.status(403).json({error: 'Access Denied'});
        }
        const user = await User.findByIdAndDelete(targetId);
        if(!user){
            return res.status(404).json({message: 'User does not exists'});
        }
        res.status(200).json({message: 'User Deleted Successfully'})
    } catch(error){
        console.log(error.message);
        res.status(500).json({message: 'Server Error'})
    }
}