
var express = require('express');
var router = express.Router();

let serverCakeOrderArray = []; // our "permanent storage" on the web server


/* POST to addCakeOrder */
router.post('/addCakeOrder', function(req, res) {
  console.log(req.body);
  serverCakeOrderArray.push(req.body);
  console.log(serverCakeOrderArray);

  res.status(200).send(JSON.stringify('success'));
});


/* GET cakeList */
router.get('/cakeList', function(req, res) {
  res.json(serverCakeOrderArray);
});

/* DELETE to deleteCakeOrder */
router.delete('/deleteCakeOrder/:orderNumber', function(req, res) {
  let orderNumber = req.params.orderNumber;
  orderNumber = orderNumber.toLowerCase();  // allow user to be careless about capitalization
  console.log('deleting ID: ' + orderNumber);
  
  for(let i=0; i < serverCakeOrderArray.length; i++) {
    if(orderNumber == (serverCakeOrderArray[i].Order).toLowerCase()) {
      serverCakeOrderArray.splice(i,1);
      break;
    }
  }
  res.status(200).send(JSON.stringify('deleted successfully'));
});


//  router.???('/userlist', function(req, res) {
//  users.update({name: 'foo'}, {name: 'bar'})



module.exports = router;

