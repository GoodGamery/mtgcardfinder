# MTG Card Finder

A node server that serves searchable card data and images for MTG.


![Travis CI Build Status](https://travis-ci.org/GoodGamery/mtgcardfinder.svg?branch=master "Travis CI Build Status")

To run:

```
node server
```

To use:

```
# Get the card JSON
GET /card?card=Plains
GET /card/json?card=Plains

# Get the image resource
GET /image?card=Plains
GET /card/image?card=Plains

# Get an html snippet with an img tag pointing to the image
GET /html?card=Plains
GET /card/html?card=Plains
```
