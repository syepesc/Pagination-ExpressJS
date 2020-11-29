const express = require('express');
const mongoose = require('mongoose');

// VANILLA JS PAGINATION
/*
for pagination we are always receiving an array of objects
so the main goal is to catch the objects between a given range

for example:

URL = http://www.ourWebPage.com/users?page=1&itemsPerPage=5

in this example we are taking 5 items per page from the users array
in the query string (/users?-->querystring) we catch the variable page
to determine the current page and the items per page to display in the 
current page.

first we need to define the start index of the array and the end index of the array
then we 'slice' the array of objects between the start and end index.
 */

/*
// array of data
const model = [
    {id: 1, name: 'User 1'},
    {id: 2, name: 'User 2'},
    {id: 3, name: 'User 3'},
    {id: 4, name: 'User 4'},
    {id: 5, name: 'User 5'},
    {id: 6, name: 'User 6'},
    {id: 7, name: 'User 7'},
    {id: 8, name: 'User 8'},
    {id: 9, name: 'User 9'},
    {id: 10, name: 'User 10'},
    {id: 11, name: 'User 11'},
    {id: 12, name: 'User 12'},
    {id: 13, name: 'User 13'}
];

// the model must be and array of items or objects
function paginate(model) {
    const page = req.query.page;
    const itemsPerPage = req.query.itemsPerPage;

    // page 1 = (1 - 1) * 5 = 0 <--- so we grab the item on the position[0] of the objects array
    // page 2 = (2 -1) * 5 = 5 <-- so page 2 will start on the position[5] of the objects array
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;

    // create a results object to store more pagination data as next page or previous
    const results = {};

    if (endIndex < model.length) {
        results.nextPage = {
            page: page + 1,
            itemsPerPage: itemsPerPage
        }
    }

    if (startIndex > 0)
    results.previousPage = {
        page: page - 1,
        itemsPerPage: itemsPerPage
    }

    // we use the slice method to take the objects between the start and end index of the objects array
    results.result = model.slice(startIndex, endIndex);  
}
*/

// Mongo pagination
module.exports.paginate = function(model) {
    // to create a middleware we need to return a function with req, res and next parameters
    return async (req, res, next) => {

        // URL Example = http://www.ourWebPage.com/users?page=1&itemsPerPage=5

        const page = parseInt(req.query.page);
        const itemsPerPage = parseInt(req.query.itemsPerPage);

        // page 1 = (1 - 1) * 5 = 0 <--- so we grab the item on the position[0] of the objects array
        // page 2 = (2 -1) * 5 = 5 <-- so page 2 will start on the position[5] of the objects array
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = page * itemsPerPage;

        // create a results object to store more pagination data as next page or previous
        const results = {};

        results.page = page;
        results.itemsPerPage = itemsPerPage;
        results.totalItems = await model.countDocuments().exec();

        if (endIndex < await model.countDocuments().exec()) {
            results.nextPage = {
                page: page + 1,
                itemsPerPage: itemsPerPage
            }
        }

        if (startIndex > 0) {
            results.previousPage = {
                page: page - 1,
                itemsPerPage: itemsPerPage
            }
        }

        try {
            // instead od vanilla JS slice() method we are going to use MongoDB (mongoose) methods
            results.result = await model.find().limit(itemsPerPage).skip(startIndex).exec();
            
            // create a field inside the result object (paginationResult) to pass to the next() middleware
            res.paginationResult = results;
            next();
        } catch (e) {
            res.status(500).json( {message: e.message });
        }
    }
}