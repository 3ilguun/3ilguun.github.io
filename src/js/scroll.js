import { mobileCheck, getSupportedTransform, IEversion } from './modules';
import imagesLoaded from 'imagesloaded';

const math = {
  lerp: (a, b, n) => {
    return (1 - n) * a + n * b;
  },
  norm: (value, min, max) => {
    return (value - min) / (max - min);
  }
};

const config = {
  height: window.innerHeight,
  width: window.innerWidth
};

class Scroll {
  constructor() {
    this.bind();
    this.wrapper = document.querySelector('.wrapper');
    this.content = document.querySelector('.container');
    this.scrollbar = document.querySelector('.scroll-bar');
    this.works = document.querySelector('.works');

    this.dom = {
      wrapper: this.wrapper,
      content: this.content,
      works: [[...this.content.querySelectorAll('.work')]],
      scrollbar: this.scrollbar
    };

    this.data = {
      total: this.dom.works[0].length - 1,
      current: 0,
      last: {
        one: 0,
        two: 0
      },
      off: 0,
      on: 0
    };

    this.bounds = {
      elem: 0,
      content: 0,
      height: 0,
      max: 0,
      min: 0
    };

    this.raf = null;

    this.init();
  }

  bind() {
    ['scroll', 'run', 'resize']
    .forEach( fn => this[fn] = this[fn].bind(this) );
  }

  setBounds(elems) {
    let h = 0;
    elems.forEach((el, index) => {
      const bounds = el.getBoundingClientRect();
      h = h + bounds.height;
      const height = this.dom.content.offsetHeight;
      this.bounds.height = height;
      this.bounds.max = this.bounds.height - config.height;
      document.body.style.height = `${height}px`;
    });
  }

  resize() {
    this.setBounds(this.dom.works[0]);
    this.scroll();
  }

  preload() {
    imagesLoaded(this.works, instance => {
      this.setBounds(this.dom.works[0]);
    });
  }

  scroll() {
    this.data.current = window.scrollY;
  }

  run() {
    this.data.last.one = math.lerp(this.data.last.one, this.data.current, 0.085);
    this.data.last.one = Math.floor(this.data.last.one * 100) / 100;
    this.data.last.two = math.lerp(this.data.last.two, this.data.current, 0.08);
    this.data.last.two = Math.floor(this.data.last.two * 100) / 100;
    // const diff = this.data.current - this.data.last.one;
    // const acc = diff / config.width;
    // const velo = +acc;
    // const skew = velo * 7.5;
    // skewY(${skew}deg)
    this.dom.content.style.transform = `translate3d(0, -${this.data.last.one.toFixed(2)}px, 0)`;
    const scale = math.norm(this.data.last.two, 0, this.bounds.max);
    this.dom.scrollbar.style.transform = `scaleX(${scale})`;
    this.requestAnimationFrame();
  }

  on() {
    document.body.classList.add('smooth-scroll');
    this.setBounds(this.dom.works[0]);
    this.addEvents();
    this.requestAnimationFrame();
  }

  requestAnimationFrame() {
    this.raf = requestAnimationFrame(this.run);
  }

  addEvents() {
    window.addEventListener('scroll', this.scroll, { passive: true });
    this.dom.wrapper.addEventListener('mousedown', e => {
      this.data.on = e.clientX;
    });

    window.addEventListener('mouseup', () => {
      window.scrollTo(0, this.data.current);
    });
  }

  init() {
    history.scrollRestoration = 'manual';
    this.preload();
    this.on();
  }
}

if (!mobileCheck() && getSupportedTransform() && !IEversion()) {
  new Scroll();
}