'use strict';


import REM from 'rem-unit-polyfill';
import { getSupportedTransform, IEversion } from './modules';
import anime from 'animejs/lib/anime.es';
import LazyLoad from 'vanilla-lazyload';


{
  const DOM = {};
  DOM.curtain = document.querySelector('.curtain');
  DOM.shape = DOM.curtain.querySelector('.morph');
  DOM.path = DOM.shape.querySelector('path');
  DOM.introContent = document.querySelector('.intro__content');
  DOM.introTitle = document.querySelector('.intro__title');
  DOM.contact = document.querySelector('.contact');

  let loaded;
  const morph = () => {
    if (loaded) return;
    loaded = true;

    anime({
      targets: DOM.curtain,
      duration: 1000,
      easing: 'easeInOutSine',
      translateY: '-200vh'
    });

    anime({
      targets: DOM.shape,
      scaleY: [
        { value: [0.8, 1.8], duration: 500, easing: 'easeInQuad' },
        { value: 1, duration: 500, easing: 'easeOutQuad' }
      ]
    });

    anime({
      targets: DOM.path,
      duration: 1000,
      easing: 'easeOutQuad',
      d: DOM.path.getAttribute('pathdata:id')
    });

    anime({
      targets: DOM.introTitle,
      duration: 500,
      delay: 500,
      opacity: [0, 1],
      ease: 'easeInOutSine'
    });

    anime({
      targets: DOM.introContent,
      duration: 500,
      delay: 1000,
      opacity: [0, 1],
      ease: 'easeInOutSine'
    });

    anime({
      targets: DOM.contact,
      scale: [
        { value: 0.5, duration: 500, easing: 'easeInQuad' },
        { value: 1, duration: 500, easing: 'easeOutQuad' }
      ]
    });
  };

  const finish = () => {
    setTimeout(() => {
      document.body.classList.remove('loading');
      document.body.classList.add('loaded');
      DOM.curtain.remove();
    }, 1500);
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (getSupportedTransform() && !IEversion()) {
      setTimeout(() => {
        morph();
      }, 500);
    }
    finish();
  });

  //- Lazyload
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
      },
      callback_error: (el) => {
        el.parentNode.classList.add('reveal');
      }
    });
  }
};

//- Typekit
(function(d) {
  var config = {
    kitId: 'rao4iij',
    scriptTimeout: 3000,
    async: true
  },
  h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
})(document);


import * as Scroll from './scroll';