const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_uazSXLD1OuOgwsSwf6r93K8S');
const mongoose = require('mongoose');
const request = require('request');

const addrOrigin = '153 Cours albert Thomas, Lyon 69003';

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

router.post('/search-address', function(req, res) {
  if (!req.body.address) {
    res.redirect('/')
  } else {
    req.session.address = req.body.address;
    request("https://maps.googleapis.com/maps/api/directions/json?origin=" + addrOrigin + "&destination=" + req.body.address + "&mode=bicycling&key=AIzaSyDsUHAZo4SpFfe0M0_05WWmYKy7AcLoFtI", function(err, response, body) {
      if (body.routes) {
        body = JSON.parse(body);
        req.session.location = {
          latLng: body.routes[0].legs[0].end_location,
          name: body.routes[0].legs[0].end_address
        };
        res.redirect('catalogue');
      } else {
        res.redirect('/');
      }
    });
  }
});

module.exports = router;
