const express = require("express");

const contactRouter = express.Router();

contactRouter.get('/contact', (req, res) => {
    res.render('contact', {page_title: 'Contact'}); 
});

module.exports = contactRouter;