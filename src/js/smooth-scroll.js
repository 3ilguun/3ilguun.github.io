'use strict';

const smoothScroll = {
  target: document.querySelector('.container'),
  endY: 0,
  y: 0,
  resizeRequest: 1,
  scrollRequest: 0,
  requestId: null,
};

const setSmoothScroll = () => {
  const html = document.documentElement;
  const body = document.body;
  const resized = smoothScroll.resizeRequest > 0;
  if (resized) {
    let contentHeight = smoothScroll.target.clientHeight;
    body.style.height = contentHeight + 'px';
    smoothScroll.resizeRequest = 0;
  }

  let scrollY = window.pageYOffset || html.scrollTop || body.scrollTop || 0;
  smoothScroll.endY = scrollY;
  smoothScroll.y += (scrollY - smoothScroll.y) * 0.1;

  if (
    Math.abs(scrollY - smoothScroll.y) < 0.05 ||
    resized
  ) {
    smoothScroll.y = scrollY;
    smoothScroll.scrollRequest = 0;
  }

  const scrolled = smoothScroll.scrollRequest > 0;
  smoothScroll.target.style.transform =
    'translate3d(0, ' + -smoothScroll.y + 'px, 0)';
  smoothScroll.requestId =
    scrolled ? requestAnimationFrame(setSmoothScroll) : null;
};

const onSmoothScroll = () => {
  smoothScroll.scrollRequest++;
  if (!smoothScroll.requestId) {
    smoothScroll.requestId =
      requestAnimationFrame(setSmoothScroll);
  }
};

const onSmoothResize = () => {
  smoothScroll.resizeRequest++;
  if (!smoothScroll.requestId) {
    smoothScroll.requestId =
      requestAnimationFrame(setSmoothScroll);
  }
};

export {
  smoothScroll,
  setSmoothScroll,
  onSmoothScroll,
  onSmoothResize,
};
