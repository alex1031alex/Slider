// Selectors
const VIEWPORT_SELECTOR = `.slider__wrap`;
const SLIDE_LIST_SELECTOR = `.slider__list`;
const SLIDE_SELECTOR = `.slider__slide`;
const PREV_BTN_SELECTOR = `.slider__control--prev`;
const NEXT_BTN_SELECTOR = `.slider__control--next`;
const INDICATORS_CONTAINER_SELECTOR = `.slider__indicators`;
const INDICATOR_CLASSNAME = `slider__indicator`;
const ACTIVE_INDICATOR_CLASSNAME = `slider__indicator--active`;

const Direction = {
  PREV: `prev`,
  NEXT: `next`
};

// Initialize sliders
document.addEventListener(`DOMContentLoaded`, () => {
  const sliders = document.querySelectorAll(`.slider`);

  sliders.forEach(($slider) => {
    const slider = new Slider($slider);
    slider.init();
  });
});

// Slider
class Slider {
  constructor($root) {
    this._$root = $root;
    this._$viewport = null;
    this._$slideList = null;
    this._$prevBtn = null;
    this._$nextBtn = null;
    this._$indicatorsContainer = null;
    this._direction = Direction.NEXT;
    this._indicators = [];
    this._activeSlideIndex = 0;
    this._activeIndicator = null;
    this._transform = 0;
  }

  init() {
    this._$viewport = this._$root.querySelector(VIEWPORT_SELECTOR);
    this._$slideList = this._$root.querySelector(SLIDE_LIST_SELECTOR);
    this._$prevBtn = this._$root.querySelector(PREV_BTN_SELECTOR);
    this._$nextBtn = this._$root.querySelector(NEXT_BTN_SELECTOR);
    this._$indicatorsContainer = this._$root
      .querySelector(INDICATORS_CONTAINER_SELECTOR);

    this._slides = Array.from(this._$root.querySelectorAll(SLIDE_SELECTOR));
    this._$slideList.style.transform = `translateX(0%)`;

    this._createIndicators();
    this._setDisabled();
    this._addListeners();
  }

  _addListeners() {
    this._$prevBtn.addEventListener(`click`, () => {
      this._direction = Direction.PREV;
      this._moveSlide();
    });

    this._$nextBtn.addEventListener(`click`, () => {
      this._direction = Direction.NEXT;
      this._moveSlide();
    });

    this._$indicatorsContainer.addEventListener(`click`, (evt) => {
      const target = evt.target;
      if (!target.classList.contains(INDICATOR_CLASSNAME) || target.classList.contains(ACTIVE_INDICATOR_CLASSNAME)) {
        return;
      }

      const index = Number(target.dataset.index);
      this._moveToSlide(index);
    });
  }

  _setIndexAttribute(elem, value) {
    elem.dataset.index = value;
  }

  _createIndicator() {
    const indicator = document.createElement(`button`);
    indicator.classList.add(INDICATOR_CLASSNAME);
    return indicator;
  }

  _createIndicators() {
    this._slides.forEach((slide, index) => {
      this._setIndexAttribute(slide, index);

      const indicator = this._createIndicator();
      this._setIndexAttribute(indicator, index);

      if (index === this._activeSlideIndex) {
        indicator.classList.add(ACTIVE_INDICATOR_CLASSNAME);
        this._activeIndicator = indicator;
      }

      this._indicators.push(indicator);
      this._$indicatorsContainer.append(indicator);
    });
  }

  _setDisabled() {
    const index = this._activeSlideIndex;
    this._$prevBtn.disabled = index === 0;
    this._$nextBtn.disabled = index === this._slides.length - 1;
  }

  _moveSlide() {
    if (this._direction === Direction.PREV) {
      if (this._activeSlideIndex === 0) {
        return;
      }
      this._activeSlideIndex--;
    }
    
    if (this._direction === Direction.NEXT) {
      if (this._activeSlideIndex === this._slides.length - 1) {
        return;
      }
      this._activeSlideIndex++;
    }

    this._$slideList.style.transform = 
      `translateX(-${this._activeSlideIndex}00%)`;
    this._setDisabled();
    this._setActiveIndicator(this._activeSlideIndex);
  }

  _moveToSlide(index) {
    if (index < this._activeSlideIndex) {
      this._direction = Direction.PREV;
    } 
    
    if (index > this._activeSlideIndex) {
      this._direction = Direction.NEXT;
    }

    while(index !== this._activeSlideIndex) {
      this._moveSlide();
    }
  }

  _setActiveIndicator(index) {
    const newActiveIndicator = this._indicators.find((indicator) => {
      return index === Number(indicator.dataset.index);
    });
    this._activeIndicator.classList.remove(ACTIVE_INDICATOR_CLASSNAME);
    newActiveIndicator.classList.add(ACTIVE_INDICATOR_CLASSNAME);
    this._activeIndicator = newActiveIndicator;
  }
}
