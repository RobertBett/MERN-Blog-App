const fs = require('fs');
const path = require('path');
const { validationResult } = require ('express-validator/check');
const Post = require('../models/post');


exports.getPosts = (req, res, next ) =>{
    const currentPage = req.query.page || 1;
    const perPage = 2;
    Post.find()
    .countDocuments()
    .then((count) => {
        totalItems = count;
        return Post.find()
            .skip(( currentPage - 1 ) * perPage)
            .limit(perPage);
    })  
    .then((posts) => {
        res.status(200).json({ 
            message: 'Fetched Posts Successfully',
            posts,
            totalItems
        });
    }).catch((err) => {
        console.error(err);
    });
};

exports.getPost = ( req, res, next ) =>{
    const { postId } = req.params;
    Post.findById(postId)
    .then((post) => {
            if(!post){
                const error = new Error('Could not find post');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                post,
            })
    }).catch((err) => {
        console.error(err);
    });
}

exports.editPost = ( req, res, next ) =>{
    const errors = validationResult(req);
    const { postId } = req.params;
    const { title, content } = req.body;

    Post.findById(postId)
    .then((post) => {
        let imageUrl = req.file && req.file.path || post.imageUrl;
        
        if(!errors.isEmpty()){
            return res.status(422).json({
                message: 'Validation failed, entered data is incorrect.', 
                errors: errors.array()
            });
        };

        if(!imageUrl){
            const error = new Error('No image provided');
            error.statusCode = 422;
            throw error;
        };

        if(imageUrl !== post.imageUrl){
            clearImage(post.imageUrl);
        };

        return Post.updateOne({ _id: postId},{
            title,
            content,
            imageUrl: imageUrl.replace(/\s/g, '')
        });
    })
    .then(() => { res.status(201).json({ message:'Post Updated Successfully' })})
    .catch((err) => {
        console.error(err);
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.deletePost = ( req, res, next ) =>{
    const { postId } = req.params;

    Post.findById(postId)
    .then((post) => {
        clearImage(post.imageUrl);
        Post.deleteOne({_id:postId})
        .then(() => {
            res.status(200).json({
                message: 'Post Deleted Successfully'
            })
        })
    }).catch((err) => {
        console.error(err);
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.createPost = (req, res, next) =>{
    const errors = validationResult(req);
    console.log(req.body, req.file,'IS FORM DATA WORKING?')
    if(!errors.isEmpty()){
        return res.status(422).json({
            message: 'Validation failed, entered data is incorrect.', 
            errors: errors.array()
        });
    };

    if(!req.file){
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;
    };

    const imageUrl = req.file.path
    const { title, content} = req.body;

    const post = new Post({
        title,
        content,
        imageUrl: imageUrl.replace(/\s/g, ''),
        creator:{
            name:'Roberto'
        }
    })  
    post.save()
    .then((result) => {
        res.status(201).json({
            message:'Post created Successfully!',
            post: result
        });
    }).catch((err) => {
        console.error(err);
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
};

const clearImage = filePath =>{
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err,'Clear Image error'));
};