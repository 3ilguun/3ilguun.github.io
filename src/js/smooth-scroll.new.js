'use strict';

export default class SmoothScroll {
  constructor(options) {
    this.html = document.documentElement;
    this.body = document.body;
    this.target = options.target;
    this.ease = 0.1;
    this.y = 0;
    this.endY = 0;
    this.scrollRequest = 0;
    this.resizeRequest = 1;
    this.resized = this.resizeRequest > 0;
    this.requestId = null;

    this.setHeight();
    window.addEventListener('resize', this.onResize);
    window.addEventListener('scroll', this.onScroll);
    this.update();
  }

  setHeight() {
    this.body.style.height = this.target.clientHeight + 'px';
    this.resizeRequest = 0;
  }

  onResize() {
    this.resizeRequest++;
    if (!this.requestId) {
      this.requestId = requestAnimationFrame(this.update);
    }
  }

  onScroll() {
    this.scrollRequest++;
    if (!this.requestId) {
      this.requestId = requestAnimationFrame(() => {
        this.update();
      });
    }
  }

  update() {
    if (this.resized) {
      this.setHeight;
    }

    let scrollY = window.pageYOffset ||
      this.html.scrollTop ||
      this.body.scrollTop || 0;
    this.endY = scrollY;
    this.y += (scrollY - this.y) * this.ease;

    if (
      Math.abs(scrollY - this.y) < 0.05 ||
      this.resized
    ) {
      this.y = scrollY;
      this.scrollRequest = 0;
    }

    console.log(this.y);

    this.target.style.transform =
      'translate3d(0, ' + -this.y + 'px, 0)';

    this.requestId = this.scrollRequest > 0 ?
      requestAnimationFrame(this.update) : null;
  }
}
