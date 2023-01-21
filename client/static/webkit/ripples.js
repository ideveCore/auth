let rippleTimeout;
let rippleEnd = false;

let elementData = {
  size: 0,
  color: '',
  transition: 200,
  halfWidth: 0,
  halfHeight: 0,
  touchData: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
}

document.body.addEventListener("pointerdown", (event) => {
  if (event.target.classList.contains('ripple')) {
    start(event);
  }
})
document.body.addEventListener("mouseleave", (event) => {
  if (event.target.classList.contains('ripple')) {
    end(event.target);
  }
});
document.body.addEventListener("mouseup", (event) => {
  if (event.target.classList.contains('ripple')) {
    end(event.target);
  }
});
document.body.addEventListener("touchleave", (event) => {
  if (event.target.classList.contains('ripple')) {
    end(event.target);
  }
});
document.body.addEventListener("touchend", (event) => {
  if (event.target.classList.contains('ripple')) {
    end(event.target);
  }
})
const start = (event) => {
    setElementSize(event.target);
    setColorAndTransition(event.target);
    elementData.halfWidth = event.target.offsetWidth / 2;
    elementData.halfHeight = event.target.offsetHeight / 2;
    rippleTimeout = setTimeout(() => {
      rippleEnd = true;
    }, elementData.transition);
    create(event);
  }
;

const setElementSize = (element) => {
    const width = Number(window
      .getComputedStyle(element)
      .getPropertyValue("width")
      .replace(/px/gi, ""));
    const height = Number(window
      .getComputedStyle(element)
      .getPropertyValue("height")
      .replace(/px/gi, ""));
    elementData.size =
      Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 4;
  }
;

const setColorAndTransition = (element) => {
    elementData.color = window.getComputedStyle(element).getPropertyValue('--rp-color');
    elementData.transition = Number(window.getComputedStyle(element).getPropertyValue('--rp-transition'));
  }
;

const create = (event) => {
    const span = document.createElement("span");
    span.classList.add("ripple");
    event.target.appendChild(span);
    setTouchData(event);
    span.style.top = `${elementData.touchData.top - elementData.size / 2}px`;
    span.style.left = `${elementData.touchData.left - elementData.size / 2}px`;
    span.style.willChange = "transform border-radius width height top left";
    span.style.background = elementData.color;
    span.style.transform = `scale(${getScaleRipple() / (elementData.size / 2)})`;
    span.style.width = `${elementData.size}px`;
    span.style.height = `${elementData.size}px`;
    span.style.borderRadius = "100%";
    span.style.position = "absolute";
    span.style.pointerEvents = "none";
    span.style.opacity = "1";
    span.style.transition = `opacity linear ${elementData.transition}ms, transform linear ${elementData.transition}ms`;
  }
;

const setTouchData = (event) => {
  elementData.touchData.left = Number(Math.abs(event.target.getBoundingClientRect().left - event.clientX));
  elementData.touchData.top = Number(Math.abs(event.target.getBoundingClientRect().top - event.clientY));
  elementData.touchData.right = Number(Math.abs(event.target.getBoundingClientRect().right - event.clientX));
  elementData.touchData.bottom = Number(Math.abs(event.target.getBoundingClientRect().bottom - event.clientY));
}

const getFormula = () => {
    return {
      a: Math.sqrt(elementData.touchData.bottom ** 2 +
        elementData.touchData.right ** 2),
      b: Math.sqrt(elementData.touchData.bottom ** 2 +
        elementData.touchData.left ** 2),
      c: Math.sqrt(elementData.touchData.top ** 2 +
        elementData.touchData.right ** 2),
      d: Math.sqrt(elementData.touchData.top ** 2 +
        elementData.touchData.left ** 2)
    };
  }
;

const getScaleRipple = () => {
  return elementData.touchData.top <= elementData.halfHeight &&
  elementData.touchData.left <= elementData.halfWidth
    ? getFormula().a
    : elementData.touchData.top < elementData.halfHeight &&
    elementData.touchData.left > elementData.halfWidth
      ? getFormula().b
      : elementData.touchData.top > elementData.halfHeight &&
      elementData.touchData.left < elementData.halfWidth
        ? getFormula().c
        : elementData.touchData.top > elementData.halfHeight &&
        elementData.touchData.left > elementData.halfWidth
          ? getFormula().d
          : getFormula().d;
}

const end = (element) => {
  const span = element.querySelectorAll(".ripple");
  span.forEach((ripple) => {
    if (rippleEnd) {
      ripple.style.opacity = "0";
      ripple.style.transition = `opacity linear ${elementData.transition}ms`;
      ripple.addEventListener("transitionend", () => {
        ripple.remove();
      });
    } else {
      setTimeout(() => {
        ripple.style.opacity = "0";
        ripple.style.transition = `opacity linear ${elementData.transition}ms`;
        ripple.addEventListener("transitionend", () => {
          ripple.remove();
        });
      }, elementData.transition);
    }
    clearTimeout(rippleTimeout);
    rippleEnd = false;
  });
}