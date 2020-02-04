/* eslint-disable max-statements */
'use strict';

class SmoothScroll {
  constructor(options) {
    this.endTreshold = 0.05;
    this.requestId = null;
    this.maxDepth = 10;
    this.viewHeight = 0;
    this.viewWidth = 0;
    this.halfViewHeight = 0;
    this.halfViewWidth = 0;
    this.maxDistance = 0;
    this.maxDistanceWidth = 0;
    this.scrollHeight = 0;
    this.endScroll = 0;
    this.returnCurrentScroll = 0;
    this.currentScroll = 0;
    this.scrollTransform = 0;
    this.horizontalScroll = 0;
    this.resizeRequest = 1;
    this.scrollRequest = 0;
    this.scrollItems = [];
    this.lastTime = -1;
    this.maxElapsedMS = 100;
    this.targetFPMS = 0.06;
    this.target = options.target;

    this.scrollEase = options.scrollEase != null ? options.scrollEase : 0.1;
    this.maxOffset = options.maxOffset != null ? options.maxOffset : 500;

    this.horizontalScrollWrapper = options.horizontalScrollWrapper;
    this.horizontalScrollTarget = options.horizontalScrollTarget;

    this._horizontalSetHeight();

    this.rectHorizontalStart = this.horizontalScrollWrapper.getBoundingClientRect();

    this.horizontalItemStart = {
      top: this.rectHorizontalStart.top,
      bottom: this.rectHorizontalStart.bottom,
      height: this.rectHorizontalStart.height,
    };

    window.addEventListener('resize', this._onResize);
    window.addEventListener('scroll', this._onScroll);

    this._update();
  }

  _horizontalScrollRect() {
    const horizontalRect = this.horizontalScrollTarget.getBoundingClientRect();
    return horizontalRect;
  }

  _lastScrollRect() {
    const lastScrollRect = this.horizontalScrollTarget.lastElementChild.getBoundingClientRect();
    return lastScrollRect;
  }

  _horizontalSetHeight() {
    let horizontalScrollHeight = 0;
    if (
      this.horizontalScrollTarget !== null &&
      this.horizontalScrollWrapper !== null
    ) {
      const lastScrollRect = this._lastScrollRect();
      horizontalScrollHeight = this.horizontalScrollTarget.scrollWidth - lastScrollRect.width + this._horizontalScrollRect().height;
      this.horizontalScrollWrapper.style.height = horizontalScrollHeight + 'px';
    }
  }

  _onResize() {
    this.resizeRequest++;
    if (!this.requestId) {
      this.lastTime = performance.now();
      this.requestId = requestAnimationFrame(this._update);
    }
  }

  _onScroll() {
    this.scrollRequest++;
    if (!this.requestId) {
      this.lastTime = performance.now();
      this.requestId = requestAnimationFrame(this._update);
    }
  }

  _horizontalScroll(scrollY) {
    if (this.horizontalScrollWrapper !== null) {
      const rectHorizontal = this.horizontalScrollWrapper.getBoundingClientRect();
      const lastScrollRect = this._lastScrollRect();

      const itemHorizontal = {
        top: rectHorizontal.top,
        bottom: rectHorizontal.bottom + scrollY,
        topScroll: rectHorizontal.top + scrollY,
        target: this.horizontalScrollTarget,
        targetRect: this._horizontalScrollRect(),
        horizontalMove: 0,
      };

      itemHorizontal.horizontalMove += this.currentScroll - this.horizontalItemStart.top;

      if (
        scrollY >= this.horizontalItemStart.top &&
        scrollY <= this.horizontalItemStart.bottom -
        itemHorizontal.targetRect.height
      ) {
        itemHorizontal.target.style.transform = `translate3d(-${ itemHorizontal.horizontalMove }px, 0, 0)`;

        if (
          lastScrollRect.x <= (lastScrollRect.width / 2)
        ) {
          this.scrollTransform = this.horizontalItemStart.bottom - itemHorizontal.targetRect.height;
          itemHorizontal.target.style.top = this.horizontalItemStart.bottom - itemHorizontal.targetRect.height + 'px';
        } else {
          this.scrollTransform = this.horizontalItemStart.top;
          itemHorizontal.target.style.top = this.horizontalItemStart.top + 'px';
        }
      }
    }
  }

  _update(currentTime = performance.now()) {
    let elapsedMS = currentTime - this.lastTime;

    if (elapsedMS > this.maxElapsedMS) {
      elapsedMS = this.maxElapsedMS;
    }

    console.log('scroll');

    const deltaTime = elapsedMS * this.targetFPMS;
    const dt = 1 - Math.pow(1 - this.scrollEase, deltaTime);
    const resized = this.resizeRequest > 0;
    const scrollY = window.pageYOffset;

    if (resized) {
      this._horizontalSetHeight();
      const height = this.target.clientHeight;
      document.body.style.height = height + 'px';
      this.scrollHeight = height;
      this.viewHeight = window.innerHeight;
      this.halfViewHeight = this.viewHeight / 2;
      this.maxDistance = this.viewHeight * 2;
      this.resizeRequest = 0;
      this.viewWidth = window.innerWidth;
      this.halfViewWidth = this.viewWidth / 2;
      this.maxDistanceWidth = this.viewWidth * 2;
    }

    this.endScroll = scrollY;
    this.scrollTransform += (scrollY - this.scrollTransform) * dt;
    this.currentScroll += (scrollY - this.currentScroll) * dt;

    if (
      Math.abs(scrollY - this.currentScroll) <
      this.endTreshold || resized
    ) {
      this.currentScroll = scrollY;
      this.scrollRequest = 0;
    }

    if (
      Math.abs(scrollY - this.scrollTransform) <
      this.endTreshold || resized
    ) {
      this.scrollTransform = scrollY;
      this.scrollRequest = 0;
    }

    const scrollOrigin = this.currentScroll + this.viewHeight;
    this.target.style.transform = `translate3d(0, -${
      this.scrollTransform
    }px, 0)`;

    for (let i = 0; i < this.scrollItems.length; i++) {
      const item = this.scrollItems[i];
      const distance = scrollOrigin - item.top;
      const offsetRatio = distance / this.maxDistance;

      item.endOffset = Math.round(
        this.maxOffset * item.depthRation * offsetRatio
      );

      if (
        Math.abs(item.endOffset - item.currentOffset < this.endTreshold)
      ) {
        item.currentOffset = item.endOffset;
      } else {
        item.currentOffset += (item.endOffset - item.currentOffset) * dt;
      }

      if (item.direction === 'y') {
        item.target.style.transform = `translate3d(0, ${
          item.currentOffset
        }px, 0)`;
      } else if (item.direction === 'x') {
        item.target.style.transform = `translate3d(${
          item.currentOffset
        }px, 0, 0)`;
      }
    }

    this.lastTime = currentTime;
    this.requestId = this.scrollRequest > 0 ? requestAnimationFrame(this._update) : null;
  }

  currentScrollReturn() {
    return this.currentScroll;
  }
}

const target = document.querySelector('.container');
const scrollTarget = document.querySelector('.work__inner');
const scrollWrapper = document.querySelector('.work__images--grid');

new SmoothScroll({
  target: target,
  scrollEase: 0.05,
  horizontalScrollTarget: scrollTarget,
  horizontalScrollWrapper: scrollWrapper,
});
