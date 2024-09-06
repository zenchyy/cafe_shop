const express = require("express");

const aboutRouter = express.Router();

aboutRouter.get('/about', (req, res) => {
    res.render('about-us', {page_title: 'About-Us'}); 
});

module.exports = aboutRouter;