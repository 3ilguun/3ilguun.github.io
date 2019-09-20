'use strict';

import Flickity from 'flickity';

alert('hello world');
var elem = document.querySelector('.work__img');
var flkty = new Flickity( elem, {
  cellAlign: 'left',
  contain: true
});