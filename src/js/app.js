'use strict';

import Flickity from 'flickity';

document.addEventListener("DOMContentLoaded", () => {
  const galleryElems = document.querySelectorAll('.work__images');
  for(const galleryElem of galleryElems) {
    new Flickity(galleryElem, {
      pageDots: false,
      wrapAround: true,
      lazyLoad: true,
      selectedAttraction: 0.2,
      friction: 1
    });
  }
});