'use strict';

import * as Modules from './modules';
import LazyLoad from 'vanilla-lazyload';
import * as SmoothScroll from './smooth-scroll';
import ScrollMagic from 'scrollmagic';
import * as Cursor from './cursor';

const DOM = {};
DOM.html = document.documentElement;
DOM.body = document.body;
DOM.loaded = false;
DOM.supportTransform = false;
DOM.supportFlexbox = true;
DOM.isIE = false;
DOM.touch = matchMedia('(pointer: coarse)').matches;

if (Modules.getSupportedTransform()) {
  DOM.supportTransform = true;
  DOM.html.classList.add('transform');
}

if (!Modules.getSupportedFlexbox()) {
  DOM.supportFlexbox = false;
  DOM.html.classList.add('no-flexbox');
}

if (DOM.touch === false) {
  DOM.html.classList.add('no-touch');
}

if (Modules.isIE()) {
  DOM.isIE = true;
  DOM.html.classList.add('IE');
}

window.onload = () => {
  DOM.loaded = true;
  DOM.body.classList.add('is--loaded');

  setTimeout(() => {
    document.querySelector('.preloader').remove();
  }, 3000);

  new LazyLoad({
    // use_native: true,
    callback_enter: (element) => {
      element.parentNode.classList.add('in--view');
    },
    callback_error: (element) => {
      element.parentNode.classList.add('in--view');
    },
  });

  DOM.body.classList.add('is--lazyload');

  if (
    window.innerWidth >= 960 &&
    DOM.touch === false &&
    DOM.supportTransform
  ) {
    const controller = new ScrollMagic.Controller();
    const imgBlock = document.querySelectorAll('.work--grow');

    SmoothScroll.setSmoothScroll();
    document.
      addEventListener('scroll', SmoothScroll.onSmoothScroll);
    window.
      addEventListener('resize', SmoothScroll.onSmoothResize);
    DOM.body
      .addEventListener('mousemove', Cursor.onMouseMove);
    Cursor.mouseHoverHandle();
    Cursor.mouseHoverWorkHandle();

    for (let i = 0; i < imgBlock.length; i++) {
      new ScrollMagic.Scene({
        triggerElement: imgBlock[i],
        triggerHook: 0.3,
      })
        .setClassToggle(imgBlock[i], 'is--grow')
        .addTo(controller)
        .on('enter', () => {});
    }
  }
};

import 'rem-unit-polyfill/js/rem';
import 'intersection-observer/intersection-observer';
