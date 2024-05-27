const express = require('express');
const router = express.Router();

//routes
router.get('', (req, res) => {
    const locals = {
        title: "Blog",
        description: "Simple blog"
    }

    res.render('index', {locals});
});

/*
router.get('/asdhfasdf', (req, res) => {
    res.render('adsfasdf');
});
then create adsfasd.ejs in views

*/



module.exports = router;