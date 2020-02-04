const getSupportedTransform = () => {
  let prefixes =
    'transform WebkitTransform MozTransform OTransform msTransform'.split(' ');
  let el = document.createElement('div');
  for (let i = 0; i < prefixes.length; i++) {
    if (el && el.style[prefixes[i]] !== undefined) {
      return true;
    }
  }
  return false;
};

const getSupportedFlexbox = () => {
  const f = 'flex';
  const fw = `-webkit-${f}`;
  const el = document.createElement('b');

  try {
    el.style.display = fw;
    el.style.display = f;
    return !!(el.style.display === f || el.style.display === fw);
  } catch (err) {
    return false;
  }
};

const isIE = () => {
  const ua = window.navigator.userAgent;
  const ie = /MSIE|Trident/.test(ua);
  return ie;
};

export {
  getSupportedTransform,
  getSupportedFlexbox,
  isIE,
};
