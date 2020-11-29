let express = require('express');
let router = express.Router();

// create book model instance
let Book = require('../models/book');

// import index controller
let indexController = require('../controllers/index');

// import pagination
let pagination = require('../config/pagination');


// ROUTES
// GET - Home page
router.get('/', indexController.displayHomePage);

// GET - List page
router.get('/list', pagination.paginate(Book), indexController.displayListPage);



module.exports = router;

