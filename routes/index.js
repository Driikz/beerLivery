const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_uazSXLD1OuOgwsSwf6r93K8S');
const mongoose = require('mongoose');

const optionsData = [
  {
    name: "Cacahuètes",
    quantity: 0
  }, {
    name: "Bretzels",
    quantity: 0
  }, {
    name: "Chips",
    quantity: 0
  }
];

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.session.dataCardBeer) {
    req.session.dataCardBeer = [];
  }
  const cardsData = [
    {
      img: "/images/icecubes.svg",
      tag: "Fraicheur",
      data: "Une bière fraiche, c'est pas une meilleure bière ? C'est pourquoi lors de la livraison, votre bière sera toujours à bonne température, pour votre plus grand bonheur."
    }, {
      img: "/images/medal.svg",
      tag: "Qualité",
      data: "Nous avons sélectionné pour vous le meilleur de la bière du marché."
    }, {
      img: "/images/stopwatch.svg",
      tag: "Rapidité",
      data: "Quoi de mieux qu'un client content ? Nous estimons que vous ne devez pas trop attendre, pour cette raison, nous nous engageons à vous livrer dans les plus brefs délais."
    }
  ];
  res.render('index', {cardsData});
});

router.get('/catalogue', function(req, res, next) {
  res.render('catalogue');
});

router.get('/card', function(req, res, next) {
  res.render('card', {optionsData});
});

router.post('/search-address', function(req, res) {
  if (!req.body.address) {
    res.redirect('/')
  } else {
    console.log(req.body.address);
    res.redirect('catalogue');
  }
});

router.post('/checkout', function(req, res) {
  var totalCmd = 0;
  for (var i = 0; i < req.session.dataCardBeer.length; i++) {
    req.session.dataCardBeer[i].total = req.session.dataCardBeer[i].price * req.session.dataCardBeer[i].quantity;
    totalCmd += req.session.dataCardBeer[i].total * 100;
  }

  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer =>
  stripe.charges.create({
    amount: totalCmd,
    description: "Sample Charge",
    currency: "eur",
    customer: customer.id
  }))
  .then(charge => res.redirect('card'));
});

module.exports = router;
