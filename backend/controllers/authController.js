const User = require("../models/User");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

export const register = async(req, res) => {
    const {username, email, password} = req.body;
    if(!username || !email || !password){
        return res.status(400).json({message: 'All Fields are required'})
    }
    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: 'User already exists'})
        };
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new User({
            username,
            email,
            password: hashedPassword
        })
        await user.save();
    } catch(error){
        return res.status(500).json({message: 'Server Error'})
    }
}

export const login = async(req, res) => {
    const {email, password}=req.body;
    if(!email || !password){
        return res.status(400).json({message: 'All the fields are required'})
    }
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: 'User does not exists'})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message:'Wrong password'})
        }
        const accessToken = jwt.sign({
            id:user._id,
            role: user.role
        }, process.env.access_token, {expiresIn: '15m'});
        
        const refreshToken = jwt.sign({
            id: user._id,
            role:user.role,
        }, process.env.refresh_token, {expiresIn: '7d'})
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        })
        res.status(200).json({
            accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })

    } catch(error){
        return res.status(500).json({message: 'Server Error'})
    }
}

export const refreshToken = async(req, res) => {
    const token = req.cookies.refreshToken;
    if(!token){
        return res.status(401).json({message: 'Refresh Token not found'})
    }
    try{
        const decoded = jwt.verify(token, process.env.refresh_token);
        const user = await User.findById(decoded.id);
        if(!user){
            return res.status(404).json({message: 'user not found'})
        }
        const newAccessToken = jwt.sign({
            id:user._id,
            role: user.role
        }, process.env.access_token, {expiresIn: '15m'})
        res.status(200).json({
            accesToken : newAccessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
    } catch(error){
        return res.status(500).json({message: 'Something went wrong'})
    }
}

export const logout = async(req, res) => {
    try{
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        });
        res.status(200).json({message: 'Logout Successfully'})
    } catch(error){
        return res.status(500).json({message: 'Server Error'})
    }
}