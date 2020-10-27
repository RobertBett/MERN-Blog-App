const { validationResult } = require ('express-validator/check');
const Post = require('../models/post');


exports.getPosts = (req, res, next ) =>{
    Post.find()
    .then((result) => {
        res.status(200).json({ 
            posts: result
        });
        next()
    }).catch((err) => {
        console.error(err);
    });

};

exports.getPost = ( req, res, next ) =>{
    const { postId } = req.params;
    Post.findById(postId)
    .then((result) => {
        console.log(result,'THIS IS SHOULD BE A POST')
            res.status(200).json({
                post: result,
            })
    }).catch((err) => {
        console.error(err);
    });
}

exports.editPost = ( req, res, next ) =>{
    const { postId } = req.params;
    const { title, content } = req.body
    console.log(req.body,'REQUEST FOR EDITING')
    Post.updateOne({ _id: postId},{
        title,
        content
    })
    .then((result) => {
        console.log(result);
        res.status(201).json({
            post: result
        })
    }).catch((err) => {
        console.error(err);
    });
}
exports.deletePost = ( req, res, next ) =>{
    const { postId } = req.params;
    console.log(req,['REGERBGOBER','VROINER']);
    Post.deleteOne({_id:postId})
    .then(() => {
        res.status(200).json({
            message: 'Post Deleted Successfully'
        })
    }).catch((err) => {
        console.error(err);
    });
}

exports.createPost = (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            message: 'Validation failed, entered data is incorrect.', 
            errors: errors.array()
        });
    }
    const { title, content} = req.body;
    const post = new Post({
        title,
        content,
        imageUrl: 'images/Apple_macbookpro-13-inch_screen_05042020_big.jpg.large.jpg',
        creator:{
            name:'Roberto'
        }
    })  
    post.save()
    .then((result) => {
        console.log(result);
        res.status(201).json({
            message:'Post created Successfully!',
            post: result
        });
    }).catch((err) => {
        console.error(err);
    });

}