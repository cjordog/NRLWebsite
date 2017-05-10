var express = require('express');
var router = express.Router();


// Require our controllers
var reservation_controller = require('../controllers/reservationController');


/// BOOK ROUTES ///

/* GET catalog home page. */
router.get('/', reservation_controller.index);  

/// AUTHOR ROUTES ///

/* GET request for creating Author. NOTE This must come before route for id (ie display author)*/
router.get('/reservation/create', reservation_controller.reservation_create_get);

/* POST request for creating Author. */
router.post('/reservation/create', reservation_controller.reservation_create_post);

/* GET request to delete Author. */
router.get('/reservation/:id/delete', reservation_controller.reservation_delete_get);

// POST request to delete Author
router.post('/reservation/:id/delete', reservation_controller.reservation_delete_post);

/* GET request for one Author. */
router.get('/reservation/:id', reservation_controller.reservation_detail);

/* GET request for list of all Authors. */
router.get('/reservations', reservation_controller.reservation_list);




module.exports = router;
