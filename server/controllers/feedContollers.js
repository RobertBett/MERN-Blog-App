exports.getPosts = (req, res, next ) =>{
    res.status(200).json({ 
        posts: [
            {   
                _id: '1',
                title: 'First Post', 
                content: 'This is the first post!',
                imageUrl: 'images/Apple_macbookpro-13-inch_screen_05042020_big.jpg.large.jpg',
                creator:{
                    name: 'Roberto'
                },
                createdAt: new Date()
            }
        ]
    });
};
exports.createPost = (req, res, next) =>{
    const { title, content} = req.body;
    console.log(req.body);
    res.status(201).json({
        message:'Post created Successfully',
        post:{
            _id: new Date().toISOString(), 
            title, 
            content,
            creator: { name:'Roberto'},
            createdAt: new Date()
        }
    });
}