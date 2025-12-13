const Post = require('../models/Posts');
const mongoose = require('mongoose');
exports.createPost = async(req, res) => {
    try{
        let {question, option1, option2, option3} = req.body;
        question = String(question)?.trim();
        option1 = String(option1)?.trim();
        option2 = String(option2)?.trim();
        option3 = String(option3)?.trim();
        if(!question || !option1 || !option2 || !option3){
            return res.status(403).json({error: 'All fields are required and it cannot be empty'});
        }
        const options = [option1, option2, option3];
        const optionSet = new Set(options);
        if(optionSet.size !==options.length){
            return res.status(403).json({error: 'Options must be unique'});
        }
        const post = await Post.create({
            question, option1, option2, option3, author: req.user.id
        })
        res.status(201).json({message: 'Post created successfully', post})
    } catch(error){
        console.log(error.message);
        res.status(500).json({message: 'Server Error'})
    }
}

exports.getAllPosts = async(req, res) => {
    try{
        const post = await Post.find().populate('author', 'username email role').sort({createdAt: -1});
        res.status(200).json(post);
    } catch(error){
        console.log(error.message);
        res.status(500).json({message: 'Server Error'})
    }
}

exports.getPostById = async(req, res) => {
    try{
        const id = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(403).json({error: 'Invalid post id'})
        }
        const post = await Post.findById(id).populate('author', 'username email role');
        if(!post){
            return res.status(404).json({error: 'Post not found'});
        }
        res.status(200).json(post);
    } catch(error){
        console.log(error.message);
        res.status(500).json({message: 'Server Error'})
    }
}

exports.updatePost = async(req, res) => {
    try{
        const id = req.params.id;
        let {question, option1, option2, option3} = req.body;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(403).json({error: 'Invalid post id'});
        }
        question = String(question || '').trim();
        option1 = String(option1 || '').trim();
        option2 = String(option2 || '').trim();
        option3 = String(option3 || '').trim();
        if(!question || !option1 || !option2 || !option3){
            return res.status(403).json({error: 'All fields are required and it cannot be empty'});
        }
        const post = await Post.findById(id);
        if(req.user.id !== post.author.toString() && req.user.role !== 'admin'){
            return res.status(403).json({error: 'Access Denied'});
        }
        const options = [option1, option2, option3];
        const optionSet = new Set(options);
        if(options.length!==optionSet.size){
            return res.status(403).json({error: 'Options must be unique'});
        }
        let fields = {};
        if(question) fields.question = question;
        if(option1) fields.option1 = option1;
        if(option2) fields.option2 = option2;
        if(option3) fields.option3 = option3;
        const updatedPost = await Post.findByIdAndUpdate(id, fields, {new: true, runValidators: true});
        if(!updatedPost){
            return res.status(404).json({error: 'Post not found'});
        }
        res.status(200).json({message: 'Post updated successfully', updatedPost});
    } catch(error){
        console.log(error.message);
        res.status(500).json({message: 'Server Error'})
    }
}

exports.deletePost = async(req, res) => {
    try{
        const id = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(403).json({error: 'Invalid post id'});
        }
        const post = await Post.findById(id);
        if(post.author.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(403).json({error: 'Access Denied'})
        }
        await post.deleteOne();
        res.status(200).json({message: 'Post deleted successfully'});
    } catch(error){
        console.log(error.message);
        res.status(500).json({message: 'Server Error'})
    }
}