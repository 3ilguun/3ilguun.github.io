'use strict';

import Flickity from 'flickity';

console.log('Hello world!');

var galleryElems = document.querySelectorAll('.work__img');
for (var i=0, len = galleryElems.length; i < len; i++) {
  var galleryElem = galleryElems[i];
  new Flickity( galleryElem, {
    pageDots: false
  })
}