'use strict';


import REM from 'rem-unit-polyfill';
import { IEversion } from './modules';
import LazyLoad from 'vanilla-lazyload';
import * as Scroll from './scroll';


if (IEversion()) {
  document.body.classList.add('is-ie');
  const images = document.querySelectorAll('.lazy');
  for(let i = 0; i < images.length; i++) {
    const url = images[i].getAttribute('data-src');
    images[i].setAttribute('src', url);
  }
} else {
  document.body.classList.add('lazyload');
  new LazyLoad({
    use_native: true,
    callback_loaded: (el) => {
      el.parentNode.classList.add('reveal');
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add('loaded');
  // window.addEventListener('scroll', function() {
    // const content = document.querySelector('.wrapper');
    // const contentOffset = window.pageYOffset | document.body.scrollTop;
    // data.last = math.lerp( data.last, data.current, data.ease )
    // data.last = Math.floor( data.last * 100 ) / 100

    // if ( data.last < .1 ) {
    //   data.last = 0
    // }

    // TweenMax.to(content, 10, { y: - contentOffset, ease: Power4.easeOut });
  // });
});