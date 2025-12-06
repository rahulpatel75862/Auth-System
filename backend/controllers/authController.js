const User = require("../models/User");
const bcrypt = require('bcrypt')
const signin = require('../middlewares/authMiddlewares').signin
exports.registerUser = async(req, res) => {
    try{
        let {username, email, password, role} = req.body;
        if(!username || !email || !password || !role){
            return res.status(403).json({error: 'All fields are required'});
        }
        username = String(username).trim();
        email = String(email).trim().toLowerCase();
        if(!username || !email || !password){
            return res.status(403).json({error: 'Fields cannot be empty or whiteSpace'})
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(401).json({error: 'user already exists.'})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        });
        await newUser.save();
        const token = signin(newUser);
        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        })
    } catch(error){
        console.log(error);
        return res.status(500).json({message: 'Server Error'})
    }
}

exports.signinUser = async(req, res) => {
    try{
        let {email, password} = req.body;
        if(!email || !password){
            return res.status(403).json({error:'Please enter username and password'});
        }
        email = String(email).trim().toLowerCase();
        const existingUser = await User.findOne({email});
        if(!existingUser){
            return res.status(401).json({error: 'User does not exists'});
        };
        const match = await bcrypt.compare(password, existingUser.password);
        if(!match){
            return res.status(401).json({error: 'Invalid credentials'})
        }
        const token = signin(existingUser);
        res.status(200).json({
            token,
            user: {
                id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email, 
                role: existingUser.role
            }
        })
    } catch(error){
        return res.status(500).json({message: 'Server Error'});
    }
}


exports.getCurrentUser = async(req, res) => {
    try{
        if(!req.user){
            return res.status(403).json({error: 'User not authenticated'})
        };
        const user = await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({error: 'User not found'})
        }
        res.status(200).json({user});  
    }catch(error){
        return res.status(500).json({message: 'Server Error'});
    }
}