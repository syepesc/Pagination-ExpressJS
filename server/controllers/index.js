const express = require('express');

// import pagination
const pagination = require('../config/pagination');

// create book model instance
let Book = require('../models/book');

// INDEX CONTROLLERS
module.exports = {
    displayHomePage: (req, res) => {
        res.render('home', { title: 'Pagination - Home' });
    },

    displayListPage: (req, res) => {
        res.render('list', { title: 'Pagination - Items list', paginationResult: res.paginationResult});
    }
}