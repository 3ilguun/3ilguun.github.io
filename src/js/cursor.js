'use strict';

import gsap from 'gsap';

const cursor = {
  ball: document.querySelector('.cursor__ball'),
  ballBig: document.querySelector('.cursor__ball--big'),
  ballBigIcon: document.querySelector('.cursor__ball--big-icon'),
  ballWork: document.querySelector('.cursor__ball--work'),
  works: document.querySelectorAll('.work--grow'),
  isHover: document.querySelectorAll('.is--hover'),
  isFollow: document.querySelectorAll('.is--follow'),
  isActive: 'is--active',
};

const onMouseMove = (event) => {
  gsap.to(cursor.ballBig, {
    duration: 0.3,
    x: event.clientX - 30,
    y: event.clientY - 30,
  });

  gsap.to(cursor.ballWork, {
    duration: 0.35,
    x: event.clientX - 40,
    y: event.clientY - 45,
  });
};

const onMouseHighlight = () => {
  gsap.to(cursor.ballBig, {
    duration: 0.3,
    scale: 2,
  });
  cursor.ball.style.mixBlendMode = 'difference';
  cursor.ballBigIcon.style.fill = '#FFF';
};

const onMouseHighlightOut = () => {
  gsap.to(cursor.ballBig, {
    duration: 0.3,
    scale: 1,
  });
  cursor.ball.style.mixBlendMode = 'normal';
  cursor.ballBigIcon.style.fill = 'rgba(0, 0, 0, .5)';
};

const onMouseHoverWork = (event) => {
  gsap.to(cursor.ballBig, {
    duration: 0.3,
    scale: 2,
  });

  gsap.to(cursor.ballWork, {
    duration: 0.35,
    scale: 1,
  });

  gsap.to(event.target.children[0], {
    duration: 1,
    scale: 1.2,
    // ease: Power4.easeOut,
  });

  // cursor.ball.style.mixBlendMode = 'difference';
  cursor.ballBigIcon.style.fill = '#000';
};

const onMouseHoverWorkOut = (event) => {
  gsap.to(cursor.ballBig, {
    duration: 0.3,
    scale: 1,
  });

  gsap.to(cursor.ballWork, {
    duration: 0.35,
    scale: 0,
  });

  gsap.to(event.target.children[0], {
    duration: 1,
    scale: 1.1,
    // ease: Power4.easeOut,
  });

  // cursor.ball.style.mixBlendMode = 'normal';
  cursor.ballBigIcon.style.fill = 'rgba(0, 0, 0, .5)';
};

const mouseHoverHandle = () => {
  for (let i = 0; i < cursor.isHover.length; i++) {
    cursor.isHover[i].addEventListener('mouseenter', onMouseHighlight);
    cursor.isHover[i].addEventListener('mouseleave', onMouseHighlightOut);
  }
};

const mouseHoverWorkHandle = () => {
  for (let i = 0; i < cursor.works.length; i++) {
    cursor.works[i]
      .addEventListener('mouseenter', onMouseHoverWork);
    cursor.works[i]
      .addEventListener('mouseleave', onMouseHoverWorkOut);
  }
};

const calculateDistance = (element, mouseX, mouseY) => {
  return Math.floor(
    Math.sqrt(
      Math.pow(
        mouseX - (element.offsetLeft + element.offsetWidth / 2), 2
      ) +
      Math.pow(
        mouseY - (element.offsetTop + element.offsetHeight / 2), 2
      )
    )
  );
};

const mouseLinkFollow = (element, event, className) => {
  const mouseX = event.pageX;
  const mouseY = event.pageY;
  const item = element;
  const customDistance = item.dataset.dist * 20 || 50;
  const centerX = item.offsetLeft + (item.offsetWidth / 2);
  const centerY = item.offsetTop + (item.offsetHeight / 2);
  const deltaX = Math.floor((centerX - mouseX)) * -0.45;
  const deltaY = Math.floor((centerY - mouseY)) * -0.45;
  const distance = calculateDistance(item, mouseX, mouseY);

  if (distance < customDistance) {
    gsap.to(item, {
      duration: 0.5,
      x: deltaX,
      y: deltaY,
    });

    if (item.classList) {
      item.classList.add(className);
    } else {
      item.classList += `${ className }`;
    }
  } else {
    gsap.to(item, {
      duration: 0.6,
      x: 0,
      y: 0,
    });

    if (item.classList) {
      if (item.classList.contains(className)) {
        item.classList.remove(className);
      } else {
        // eslint-disable-next-line max-depth
        if (item.classList.contains(className)) {
          item.classList = item.className.replace(
            new RegExp(`(^|\\b)${className.split(' ').join('|')}(\\b|$)`, 'gi'),
            ' '
          );
        }
      }
    }
  }
};

const mouseLinkFollowHandle = () => {
  document.body.addEventListener('mousemove', (event) => {
    for (let i = 0; i < cursor.isHover.length; i++) {
      mouseLinkFollow(cursor.isHover[i], event, cursor.isActive);

      if (cursor.isHover[i].classList.contains(cursor.isHover)) {
        gsap.to(cursor.ballBig, {
          duration: 0.3,
          scale: 3,
        });
      }
    }
  });
};

export {
  onMouseMove,
  mouseHoverHandle,
  mouseHoverWorkHandle,
};
