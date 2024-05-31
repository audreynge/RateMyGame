const express = require('express');
const router = express.Router();
const post = require('../models/post');

/**
 * GET /
 * HOME
 */
router.get('', async (req, res) => {
    try {
        const locals = {
            title: "Blog",
            description: "Blog for rating games"
        }

        let perPage = 10;
        let page = req.query.page || 1;

        const data = await post.aggregate([{$sort: {createdAt: -1}}])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count/perPage);
        
        res.render('index', {
            locals, 
            data, 
            current: page,
            nextPage: hasNextPage ? nextPage : null // if doesn't have next page, set to null
        });
    } catch (error) {
        console.log(error)
    }
});

/**
 * GET /
 * post: id
 */

router.get('/post/:id', async (req, res) => {
    try {
        
        let slug = req.params.id;
        const data = await post.findById({ _id: slug });
        

        const locals = {
            title: data.title,
            description: "Blog for rating games"
        }

        res.render('post', {locals, data});

    } catch (error) {
        console.log(error);
    }
});

/**
 * POST /
 * post - searchTerm
 */

router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "Blog for rating games"
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")
        const data = await post.find({
            $or: [
                {title: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
                {body: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
            ]
        });

        res.render("search", {
            data,
            locals
        });
    } catch (error) {
        console.log(error);
    }
});

/*
function insertPostData() {
    post.insertMany([
        {
            title: "Building a Blog",
            body: "This is the body text"
        },
        {
            title: "Discover how to use Express.js",
            body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications."
        },
        {
            title: "Asynchronous Programming with Node.js",
            body: "Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations."
        },
    ]);
}
insertPostData();
*/

module.exports = router;