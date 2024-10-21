/* Header - menu-mobile - открытие закрытие  */

document.addEventListener('DOMContentLoaded', () => {
  // Получаем элементы кнопок и блока меню
  const menuMobile = document.querySelector('.header-menu-mobile');
  const menuBtn = document.querySelector('.header-mobile__btn');
  const menuCloseBtn = document.querySelector('.header-menu-mobile__content-top__close');
  const body = document.body; // Получаем body

  // Обработчик для открытия меню
  menuBtn.addEventListener('click', () => {
    menuMobile.classList.add('active');
    body.style.overflow = 'hidden'; // Блокируем скролл
  });

  // Обработчик для закрытия меню
  menuCloseBtn.addEventListener('click', () => {
    menuMobile.classList.remove('active');
    body.style.overflow = ''; // Возвращаем скролл
  });
});

/* Header - открытие блока сравнение  */

document.addEventListener('DOMContentLoaded', function() {
  const comparisonBlock = document.querySelector('.header-comparison');
  const comparisonBtn = document.getElementById('header-comparison-btn');
  const comparisonBlockContent = document.querySelector('.header-comparison__content');
  let isActive = false; // Флаг для отслеживания активного состояния блока

  // Добавляем класс active при клике на кнопку
  comparisonBtn.addEventListener('click', function() {
    comparisonBlock.classList.add('active');
    isActive = true;
  });

  // Убираем класс active при уходе мыши из блока comparisonBlockContent
  comparisonBlockContent.addEventListener('mouseleave', function() {
    if (isActive) {
      comparisonBlock.classList.remove('active');
      isActive = false;
    }
  });

  // Убираем класс active при клике вне блока comparisonBlockContent
  document.addEventListener('mousedown', function(event) {
    if (isActive && !comparisonBlockContent.contains(event.target)) {
      comparisonBlock.classList.remove('active');
      isActive = false;
    }
  });
});

/**/

/* Index-hero - листание блока*/

document.addEventListener('DOMContentLoaded', () => {
  const productList = document.querySelector('.index-hero__content-bottom__list');
  const productCards = document.querySelectorAll('.index-hero__content-bottom__list .product-card');
  const prevButton = document.getElementById('index-hero__btn-prev');
  const nextButton = document.getElementById('index-hero__btn-next');

  // Функция для получения ширины блока
  function getCardWidth() {
      return productCards[0].offsetWidth + parseInt(getComputedStyle(productCards[0]).marginRight);
  }

  // Функция плавной прокрутки
  function smoothScroll(targetScrollLeft) {
      const startScrollLeft = productList.scrollLeft;
      const distanceToScroll = targetScrollLeft - startScrollLeft;
      const duration = 500; // Длительность анимации в мс
      let startTime = null;

      function animationStep(currentTime) {
          if (!startTime) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1); // Прогресс от 0 до 1
          productList.scrollLeft = startScrollLeft + distanceToScroll * easeInOutQuad(progress);

          if (timeElapsed < duration) {
              requestAnimationFrame(animationStep);
          }
      }

      requestAnimationFrame(animationStep);
  }

  // Функция плавного ускорения и замедления
  function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  // Обработчик события для прокрутки влево
  function scrollToPrev() {
      const cardWidth = getCardWidth();
      const targetScrollLeft = productList.scrollLeft - cardWidth;
      smoothScroll(Math.max(targetScrollLeft, 0)); // Не позволяем прокрутить за пределы
  }

  // Обработчик события для прокрутки вправо
  function scrollToNext() {
      const cardWidth = getCardWidth();
      const targetScrollLeft = productList.scrollLeft + cardWidth;
      smoothScroll(Math.min(targetScrollLeft, productList.scrollWidth - productList.offsetWidth)); // Не позволяем прокрутить за пределы
  }

  // Добавление обработчиков событий для кнопок
  prevButton.addEventListener('click', scrollToPrev);
  nextButton.addEventListener('click', scrollToNext);

  // Добавление обработчиков свайпа
  let startX, endX;

  productList.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX; // Запоминаем начальную позицию касания
  });

  productList.addEventListener('touchmove', (e) => {
      endX = e.touches[0].clientX; // Запоминаем позицию при движении
  });

  productList.addEventListener('touchend', () => {
      const diffX = startX - endX; // Находим разницу между начальной и конечной позициями

      if (diffX > 50) { // Свайп влево
          scrollToNext();
      } else if (diffX < -50) { // Свайп вправо
          scrollToPrev();
      }
  });
});

/* index-categories */

document.addEventListener('DOMContentLoaded', () => {
  const cardsContainer = document.querySelector('.index-categories__content-scroll__cards');
  const cards = document.querySelectorAll('.index-categories__content-scroll__cards-card');
  const indicators = document.querySelectorAll('.index-categories__content-position span');

  let currentIndex = 0;
  let startX = 0;
  let isSwiping = false;

  // Получаем ширину и отступ блока
  function getCardWidthWithMargin() {
    const cardStyle = getComputedStyle(cards[0]);
    const cardWidth = cards[0].offsetWidth;
    const cardMarginRight = parseInt(cardStyle.marginRight);
    return cardWidth + cardMarginRight;
  }

  // Обновляем активный индикатор
  function updateActiveIndicator(index) {
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === index);
    });
  }

  // Функция свайпа вправо
  function swipeNext() {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      cardsContainer.style.transform = `translateX(-${getCardWidthWithMargin() * currentIndex}px)`;
      updateActiveIndicator(currentIndex);
    }
  }

  // Функция свайпа влево
  function swipePrev() {
    if (currentIndex > 0) {
      currentIndex--;
      cardsContainer.style.transform = `translateX(-${getCardWidthWithMargin() * currentIndex}px)`;
      updateActiveIndicator(currentIndex);
    }
  }

  // Добавляем слушатели для мыши и сенсорных устройств
  function addSwipeListeners() {
    // События для мыши
    cardsContainer.addEventListener('mousedown', startSwipe);
    cardsContainer.addEventListener('mousemove', handleSwipe);
    cardsContainer.addEventListener('mouseup', endSwipe);
    cardsContainer.addEventListener('mouseleave', endSwipe);

    // События для сенсорных устройств
    cardsContainer.addEventListener('touchstart', startSwipe);
    cardsContainer.addEventListener('touchmove', handleSwipe);
    cardsContainer.addEventListener('touchend', endSwipe);
  }

  // Начало свайпа
  function startSwipe(e) {
    startX = e.clientX || e.touches[0].clientX;
    isSwiping = true;
    // Отключаем стандартное поведение drag (перетаскивание)
    e.preventDefault();
  }

  // Обработка свайпа
  function handleSwipe(e) {
    if (!isSwiping) return;
    const currentX = e.clientX || e.touches[0].clientX;
    const diff = currentX - startX;

    if (diff > 50) {
      swipePrev();
      isSwiping = false;
    } else if (diff < -50) {
      swipeNext();
      isSwiping = false;
    }
  }

  // Завершение свайпа
  function endSwipe() {
    isSwiping = false;
  }

  // Сбрасываем позицию для десктопа
  function resetPosition() {
    cardsContainer.style.transform = '';
  }

  // Инициализация событий
  function initialize() {
    addSwipeListeners();
    resetPosition();
  }

  // Запуск при загрузке
  initialize();
  window.addEventListener('resize', resetPosition);
});

/* index-recommendations */

document.addEventListener('DOMContentLoaded', () => {
  const cardsContainer = document.querySelector('.index-recommendations__content-scroll__cards');
  const cards = document.querySelectorAll('.index-recommendations__content-scroll__cards .product-card');
  const indicators = document.querySelectorAll('.index-recommendations__content-position span');

  let currentIndex = 0;

  // Проверяем ширину экрана
  function isMobileScreen() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  // Получаем ширину и отступ блока
  function getCardWidthWithMargin() {
    const cardStyle = getComputedStyle(cards[0]);
    const cardWidth = cards[0].offsetWidth;
    const cardMarginRight = parseInt(cardStyle.marginRight);
    return cardWidth + cardMarginRight;
  }

  // Обновляем активный индикатор
  function updateActiveIndicator(index) {
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === index);
    });
  }

  // Функция свайпа вправо
  function swipeNext() {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      cardsContainer.style.transform = `translateX(-${getCardWidthWithMargin() * currentIndex}px)`;
      updateActiveIndicator(currentIndex);
    }
  }

  // Функция свайпа влево
  function swipePrev() {
    if (currentIndex > 0) {
      currentIndex--;
      cardsContainer.style.transform = `translateX(-${getCardWidthWithMargin() * currentIndex}px)`;
      updateActiveIndicator(currentIndex);
    }
  }

  // Добавим слушатели событий свайпа
  let startX = 0;
  let isSwiping = false;

  function addSwipeListeners() {
    if (!isMobileScreen()) return;

    cardsContainer.addEventListener('mousedown', startSwipe);
    cardsContainer.addEventListener('touchstart', startSwipe);

    cardsContainer.addEventListener('mousemove', handleSwipe);
    cardsContainer.addEventListener('touchmove', handleSwipe);

    cardsContainer.addEventListener('mouseup', endSwipe);
    cardsContainer.addEventListener('touchend', endSwipe);

    cardsContainer.addEventListener('mouseleave', endSwipe);
  }

  function removeSwipeListeners() {
    cardsContainer.removeEventListener('mousedown', startSwipe);
    cardsContainer.removeEventListener('touchstart', startSwipe);

    cardsContainer.removeEventListener('mousemove', handleSwipe);
    cardsContainer.removeEventListener('touchmove', handleSwipe);

    cardsContainer.removeEventListener('mouseup', endSwipe);
    cardsContainer.removeEventListener('touchend', endSwipe);

    cardsContainer.removeEventListener('mouseleave', endSwipe);
  }

  function startSwipe(e) {
    startX = e.clientX || e.touches[0].clientX;
    isSwiping = true;
  }

  function handleSwipe(e) {
    if (!isSwiping) return;
    const diff = (e.clientX || e.touches[0].clientX) - startX;
    if (diff > 50) {
      swipePrev();
      isSwiping = false;
    } else if (diff < -50) {
      swipeNext();
      isSwiping = false;
    }
  }

  function endSwipe() {
    isSwiping = false;
  }

  // Проверяем изменение ширины экрана
  function checkScreenSize() {
    if (isMobileScreen()) {
      addSwipeListeners();
    } else {
      removeSwipeListeners();
      cardsContainer.style.transform = ''; // Сбросим позицию на больших экранах
    }
  }

  // Запускаем проверку при загрузке и изменении размера окна
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});

/* Index-offers - листание блока*/

document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.querySelector('.index-offers__content-scroll');
  const blocks = document.querySelectorAll('.index-offers__content-scroll__block');
  const prevBtn = document.getElementById('index-offers-btn-prev');
  const nextBtn = document.getElementById('index-offers-btn-next');

  let blockWidth = blocks[0].offsetWidth + parseFloat(getComputedStyle(blocks[0]).marginRight);
  let currentIndex = 0;

  // Функция для плавной прокрутки
  const smoothScrollToBlock = (targetScrollLeft) => {
      const startScrollLeft = scrollContainer.scrollLeft;
      const distanceToScroll = targetScrollLeft - startScrollLeft;
      const duration = 500; // Длительность анимации в миллисекундах
      let startTime = null;

      const animationStep = (currentTime) => {
          if (!startTime) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1); // Прогресс от 0 до 1
          scrollContainer.scrollLeft = startScrollLeft + distanceToScroll * easeInOutQuad(progress);

          if (timeElapsed < duration) {
              requestAnimationFrame(animationStep);
          }
      };

      requestAnimationFrame(animationStep);
  };

  // Функция для плавного ускорения и замедления
  const easeInOutQuad = (t) => {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  };

  // Функция для скролла к блоку
  const scrollToBlock = (index) => {
      const targetScrollLeft = blockWidth * index;
      smoothScrollToBlock(targetScrollLeft);
  };

  // Обновление ширины блока при изменении размера окна
  const updateBlockWidth = () => {
      blockWidth = blocks[0].offsetWidth + parseFloat(getComputedStyle(blocks[0]).marginRight);
  };

  window.addEventListener('resize', updateBlockWidth);

  // Листание по кнопкам
  prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
          currentIndex--;
          scrollToBlock(currentIndex);
      }
  });

  nextBtn.addEventListener('click', () => {
      if (currentIndex < blocks.length - 1) {
          currentIndex++;
          scrollToBlock(currentIndex);
      }
  });

  // Свайп листание
  let startX;
  let isDragging = false;

  scrollContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
  });

  scrollContainer.addEventListener('touchmove', (e) => {
      if (!isDragging) return;

      const currentX = e.touches[0].clientX;
      const diffX = startX - currentX;

      if (diffX > 50) {
          // Свайп влево
          if (currentIndex < blocks.length - 1) {
              currentIndex++;
              scrollToBlock(currentIndex);
          }
          isDragging = false;
      } else if (diffX < -50) {
          // Свайп вправо
          if (currentIndex > 0) {
              currentIndex--;
              scrollToBlock(currentIndex);
          }
          isDragging = false;
      }
  });

  scrollContainer.addEventListener('touchend', () => {
      isDragging = false;
  });
});


/* index-top - top */

document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.querySelector('.index-top__content-top__scroll');
  const cards = document.querySelectorAll('.index-top__content-top__scroll .product-card');
  const nextBtn = document.getElementById('index-top-btn-next');
  const prevBtn = document.getElementById('index-top-btn-prev');
  const progressIndicator = document.querySelector('.index-top__content-top__indicator-progress');

  let cardWidth = cards[0].offsetWidth;  // Ширина одного блока
  let cardMarginRight = parseFloat(getComputedStyle(cards[0]).marginRight);  // Правый отступ
  let scrollAmount = cardWidth + cardMarginRight;  // Общая длина прокрутки одного блока
  let totalScrollWidth = scrollContainer.scrollWidth - scrollContainer.offsetWidth;  // Максимальная прокрутка

  // Функция для обновления ширины индикатора прогресса
  function updateProgress() {
    let scrollLeft = scrollContainer.scrollLeft;
    let scrollPercentage = (scrollLeft / totalScrollWidth) * 100;
    progressIndicator.style.width = `${scrollPercentage}%`;
  }

  // Функция плавной прокрутки
  function smoothScroll(targetScrollLeft) {
    const startScrollLeft = scrollContainer.scrollLeft;
    const distanceToScroll = targetScrollLeft - startScrollLeft;
    const duration = 300; // Продолжительность анимации в мс
    let startTime = null;

    function animationStep(currentTime) {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1); // Прогресс от 0 до 1
      scrollContainer.scrollLeft = startScrollLeft + distanceToScroll * easeInOutQuad(progress);

      if (timeElapsed < duration) {
        requestAnimationFrame(animationStep);
      } else {
        updateProgress();  // Обновляем индикатор прогресса после завершения анимации
      }
    }

    requestAnimationFrame(animationStep);
  }

  // Функция плавного ускорения и замедления
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  // Листание по кнопкам
  nextBtn.addEventListener('click', () => {
    let targetScrollLeft = scrollContainer.scrollLeft + scrollAmount;
    smoothScroll(Math.min(targetScrollLeft, totalScrollWidth));  // Не позволяем прокрутить за пределы контейнера
  });

  prevBtn.addEventListener('click', () => {
    let targetScrollLeft = scrollContainer.scrollLeft - scrollAmount;
    smoothScroll(Math.max(targetScrollLeft, 0));  // Не позволяем прокрутить в отрицательную сторону
  });

  // Обновление индикатора при скролле
  scrollContainer.addEventListener('scroll', updateProgress);

  // Поддержка свайпа
  let startX;
  let scrollStart;

  scrollContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
    scrollStart = scrollContainer.scrollLeft;
  });

  scrollContainer.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const moveX = touch.pageX - startX;
    scrollContainer.scrollLeft = scrollStart - moveX;
    updateProgress();  // Обновляем прогресс при свайпе
  });

  // Обновление размеров при изменении окна
  window.addEventListener('resize', () => {
    cardWidth = cards[0].offsetWidth;
    cardMarginRight = parseFloat(getComputedStyle(cards[0]).marginRight);
    scrollAmount = cardWidth + cardMarginRight;
    totalScrollWidth = scrollContainer.scrollWidth - scrollContainer.offsetWidth;
    updateProgress();  // Обновляем прогресс после изменения размеров
  });
});


/* index-top - bottom */

document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById('index-top__content-bottom__btn');
  const contentInfo = document.getElementById('index-top__content-bottom');

  // Получаем начальную высоту из CSS
  const computedStyle = getComputedStyle(contentInfo);
  const initialHeight = parseInt(computedStyle.height); // Преобразуем в число

  button.addEventListener('click', function() {
    // Актуальная полная высота содержимого на момент клика
    const fullHeight = contentInfo.scrollHeight;

    // Проверка, развернут ли блок
    const isExpanded = contentInfo.style.height === `${fullHeight}px` || contentInfo.classList.contains('off');

    if (isExpanded) {
      contentInfo.style.height = `${initialHeight}px`; // Сжимаем блок обратно к начальной высоте
      button.textContent = 'Показать все'; // Изменить текст кнопки
      contentInfo.classList.remove('off'); // Убираем класс off
    } else {
      contentInfo.style.height = `${fullHeight}px`; // Устанавливаем высоту на основе контента
      button.textContent = 'Скрыть'; // Изменить текст кнопки
      contentInfo.classList.add('off'); // Добавляем класс off
    }
  });
});

/* index-blog */

document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.querySelector('.index-blog__content-bottom__blocks');
  const cards = document.querySelectorAll('.index-blog__content-bottom__blocks-block');
  const progressIndicator = document.querySelector('.index-blog__content-bottom__indicator-progress');

  let cardWidth = cards[0].offsetWidth;  // Ширина одного блока
  let cardMarginRight = parseFloat(getComputedStyle(cards[0]).marginRight);  // Правый отступ
  let scrollAmount = cardWidth + cardMarginRight;  // Общая длина прокрутки одного блока
  let totalScrollWidth = scrollContainer.scrollWidth - scrollContainer.offsetWidth;  // Максимальная прокрутка

  // Функция для обновления ширины индикатора прогресса
  function updateProgress() {
    let scrollLeft = scrollContainer.scrollLeft;
    let scrollPercentage = (scrollLeft / totalScrollWidth) * 100;
    progressIndicator.style.width = `${scrollPercentage}%`;
  }

  // Обновление индикатора при скролле
  scrollContainer.addEventListener('scroll', updateProgress);

  // Поддержка свайпа
  let startX;
  let scrollStart;

  scrollContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
    scrollStart = scrollContainer.scrollLeft;
  });

  scrollContainer.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const moveX = touch.pageX - startX;
    scrollContainer.scrollLeft = scrollStart - moveX;
  });

  // Обновление размеров при изменении окна
  window.addEventListener('resize', () => {
    cardWidth = cards[0].offsetWidth;
    cardMarginRight = parseFloat(getComputedStyle(cards[0]).marginRight);
    scrollAmount = cardWidth + cardMarginRight;
    totalScrollWidth = scrollContainer.scrollWidth - scrollContainer.offsetWidth;
    updateProgress();  // Обновляем прогресс после изменения размеров
  });
});

/**/

/* tvAndElectronics-popular */

document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.querySelector('.tvAndElectronics-popular__content-scroll');
  const cards = document.querySelectorAll('.tvAndElectronics-popular__content-scroll__cards .product-card');
  const progressIndicator = document.querySelector('.tvAndElectronics-popular__content-indicator__progress');

  let cardWidth = cards[0].offsetWidth;  // Ширина одного блока
  let cardMarginRight = parseFloat(getComputedStyle(cards[0]).marginRight);  // Правый отступ
  let scrollAmount = cardWidth + cardMarginRight;  // Общая длина прокрутки одного блока
  let totalScrollWidth = scrollContainer.scrollWidth - scrollContainer.offsetWidth;  // Максимальная прокрутка

  // Функция для обновления ширины индикатора прогресса
  function updateProgress() {
    let scrollLeft = scrollContainer.scrollLeft;
    let scrollPercentage = (scrollLeft / totalScrollWidth) * 100;
    progressIndicator.style.width = `${scrollPercentage}%`;
  }

  // Функция плавной прокрутки
  function smoothScroll(targetScrollLeft) {
    const startScrollLeft = scrollContainer.scrollLeft;
    const distanceToScroll = targetScrollLeft - startScrollLeft;
    const duration = 300; // Продолжительность анимации в мс
    let startTime = null;

    function animationStep(currentTime) {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1); // Прогресс от 0 до 1
      scrollContainer.scrollLeft = startScrollLeft + distanceToScroll * easeInOutQuad(progress);

      if (timeElapsed < duration) {
        requestAnimationFrame(animationStep);
      } else {
        updateProgress();  // Обновляем индикатор прогресса после завершения анимации
      }
    }

    requestAnimationFrame(animationStep);
  }

  // Функция плавного ускорения и замедления
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  // Обновление индикатора при скролле
  scrollContainer.addEventListener('scroll', updateProgress);

  // Поддержка свайпа
  let startX;
  let scrollStart;

  scrollContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
    scrollStart = scrollContainer.scrollLeft;
  });

  scrollContainer.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const moveX = touch.pageX - startX;
    scrollContainer.scrollLeft = scrollStart - moveX;
    updateProgress();  // Обновляем прогресс при свайпе
  });

  // Обновление размеров при изменении окна
  window.addEventListener('resize', () => {
    cardWidth = cards[0].offsetWidth;
    cardMarginRight = parseFloat(getComputedStyle(cards[0]).marginRight);
    scrollAmount = cardWidth + cardMarginRight;
    totalScrollWidth = scrollContainer.scrollWidth - scrollContainer.offsetWidth;
    updateProgress();  // Обновляем прогресс после изменения размеров
  });
});

/**/

/* Каталог - изменение цены */

document.addEventListener('DOMContentLoaded', function () {
  const minSlider = document.getElementById('minPriceSlider');
  const maxSlider = document.getElementById('maxPriceSlider');
  const minPriceInput = document.getElementById('minPriceInput');
  const maxPriceInput = document.getElementById('maxPriceInput');
  const sliderTrack = document.querySelector('.price-slider-track');
  const minGap = 10000; // Минимальный разрыв между значениями
  const minPrice = 50000; // Минимальная цена
  const maxPrice = 250000; // Максимальная цена

  // Функция обновления ползунков и полей ввода
  function updateSlider() {
      let minValue = parseInt(minSlider.value);
      let maxValue = parseInt(maxSlider.value);

      if (maxValue - minValue <= minGap) {
          if (this.id === "minPriceSlider") {
              minSlider.value = maxValue - minGap;
          } else {
              maxSlider.value = minValue + minGap;
          }
      }

      minPriceInput.value = minSlider.value;
      maxPriceInput.value = maxSlider.value;
      updateTrackFill();
  }

  // Функция обновления трека (заполненной части слайдера)
  function updateTrackFill() {
      const percentMin = ((minSlider.value - minPrice) / (maxPrice - minPrice)) * 100;
      const percentMax = ((maxSlider.value - minPrice) / (maxPrice - minPrice)) * 100;
      sliderTrack.style.left = percentMin + '%';
      sliderTrack.style.right = (100 - percentMax) + '%';
  }

  // Функция обновления слайдера при изменении значения в поле ввода
  function updateFromInput() {
      let minValue = parseInt(minPriceInput.value);
      let maxValue = parseInt(maxPriceInput.value);

      // Проверка и исправление значения минимальной цены
      if (minValue < minPrice) {
          minValue = minPrice;
      } else if (minValue > maxSlider.value - minGap) {
          minValue = maxSlider.value - minGap;
      }

      // Проверка и исправление значения максимальной цены
      if (maxValue > maxPrice) {
          maxValue = maxPrice;
      } else if (maxValue < minSlider.value + minGap) {
          maxValue = minSlider.value + minGap;
      }

      // Обновляем ползунки в зависимости от новых значений
      minSlider.value = minValue;
      maxSlider.value = maxValue;

      updateTrackFill(); // Обновляем визуальное отображение трека
  }

  // Обработка событий на ползунках
  minSlider.addEventListener('input', updateSlider);
  maxSlider.addEventListener('input', updateSlider);

  // Обработка событий на полях ввода
  minPriceInput.addEventListener('change', updateFromInput);
  maxPriceInput.addEventListener('change', updateFromInput);

  // Инициализация трека слайдера при загрузке
  updateTrackFill();
});

/* Каталог - фильтр */

document.addEventListener("DOMContentLoaded", function() {
  // Находим все нужные элементы
  const filterBlocks = document.querySelectorAll('.catalog-content__products-bottom__filter-block');

  filterBlocks.forEach(filterBlock => {
    const topBlock = filterBlock.querySelector('.catalog-content__products-bottom__filter-block__top');
    const checkboxGroup = filterBlock.querySelector('.catalog-content__products-bottom__filter-block__ui-checkbox-group');
    const toggleButton = filterBlock.querySelector('.catalog-content__products-bottom__filter-block button');
    const toggleButtonText = filterBlock.querySelector('.catalog-content__products-bottom__filter-block button span');
    const checkboxes = checkboxGroup.getElementsByTagName('label');

    // Изначально устанавливаем высоту блока как высота topBlock
    filterBlock.style.height = `${topBlock.offsetHeight}px`;

    let isExpanded = false;
    let isFilterActive = false;
    let initialHeight = 0;

    // Функция для вычисления высоты первых N элементов
    function calculateHeightForFirstNItems(n) {
      let totalHeight = 0;
      for (let i = 0; i < n && i < checkboxes.length; i++) {
        totalHeight += checkboxes[i].offsetHeight;
      }
      return totalHeight;
    }

    // Функция для переключения высоты checkboxGroup
    function toggleCheckboxGroupHeight() {
      if (isExpanded) {
        // Свернуть до начальной высоты (первые 5 элементов)
        checkboxGroup.style.height = `${initialHeight}px`;
        toggleButtonText.textContent = 'Ещё';
      } else {
        // Развернуть до полной высоты всех элементов
        checkboxGroup.style.height = 'auto';
        toggleButtonText.textContent = 'Меньше';
      }
      isExpanded = !isExpanded;
      adjustFilterBlockHeight();
    }

    // Функция для изменения высоты всего filterBlock при изменении checkboxGroup
    function adjustFilterBlockHeight() {
      const totalHeight = topBlock.offsetHeight + checkboxGroup.offsetHeight + toggleButton.offsetHeight;
      filterBlock.style.height = `${totalHeight}px`;
    }

    // Изначально вычисляем высоту для первых 5 элементов и устанавливаем её
    initialHeight = calculateHeightForFirstNItems(6);
    checkboxGroup.style.height = `${initialHeight}px`;
    checkboxGroup.style.overflow = 'hidden';

    // Добавляем обработчик события клика на кнопку toggleButton
    toggleButton.addEventListener('click', toggleCheckboxGroupHeight);

    // Добавляем обработчик события клика на topBlock для раскрытия/скрытия блока
    topBlock.addEventListener('click', function() {
      if (!isFilterActive) {
        // Если блок не активен, увеличиваем его высоту
        adjustFilterBlockHeight();
        filterBlock.classList.add('active');
      } else {
        // Если блок уже активен, сворачиваем его до высоты topBlock
        filterBlock.style.height = `${topBlock.offsetHeight}px`;
        filterBlock.classList.remove('active');
      }
      isFilterActive = !isFilterActive;
    });
  });
});

/* Каталог - открытие окна с вариантами сортировки */

document.addEventListener('DOMContentLoaded', () => {
  const sortingElement = document.querySelector('.catalog-content__products-bottom__cards-top__sorting');
  const sortingButton = document.querySelector('.catalog-content__products-bottom__cards-top__sorting-btn');
  const sortingLinks = document.querySelectorAll('.catalog-content__products-bottom__cards-top__sorting-block a');

  // Добавляем обработчик на кнопку
  sortingButton.addEventListener('click', () => {
    sortingElement.classList.toggle('active'); // Добавляем или убираем класс active при клике
  });

  // Добавляем обработчик на ссылки
  sortingLinks.forEach(link => {
    link.addEventListener('click', () => {
      sortingElement.classList.remove('active'); // Убираем класс active при клике на любую ссылку
    });
  });
});

/* Каталог - открытие фильтра в мобильной версии */

document.addEventListener("DOMContentLoaded", function () {
  // Получаем элементы кнопок и блока
  const filterButton = document.getElementById('catalog-products-mobile-filter');
  const closeButton = document.getElementById('catalog-filter-closed');
  const filterBlock = document.querySelector('.catalog-content__products-bottom__filter');
  const body = document.body; // Получаем body для управления скроллом

  // Обработчик нажатия на кнопку "Фильтр"
  filterButton.addEventListener('click', () => {
    filterBlock.classList.add('active');
    body.style.overflow = 'hidden'; // Блокируем скролл
  });

  // Обработчик нажатия на кнопку "Закрыть"
  closeButton.addEventListener('click', () => {
    filterBlock.classList.remove('active');
    body.style.overflow = ''; // Восстанавливаем скролл
  });
});

/* Каталог - открытие окна с вариантами сортировки - mobile */

document.addEventListener('DOMContentLoaded', () => {
  const sortingElement = document.querySelector('.catalog-content__products-mobile__filter-sorting');
  const sortingButton = document.querySelector('.catalog-content__products-mobile__filter-sorting__btn');
  const sortingLinks = document.querySelectorAll('.catalog-content__products-mobile__filter-sorting__block a');

  // Добавляем обработчик на кнопку
  sortingButton.addEventListener('click', () => {
    sortingElement.classList.toggle('active'); // Добавляем или убираем класс active при клике
  });

  // Добавляем обработчик на ссылки
  sortingLinks.forEach(link => {
    link.addEventListener('click', () => {
      sortingElement.classList.remove('active'); // Убираем класс active при клике на любую ссылку
    });
  });
});

/**/

/* Катрочка товара - смена фотографий */

document.addEventListener("DOMContentLoaded", function () {
  const prevButton = document.querySelector('.productCard-hero__content-images__container .prev');
  const nextButton = document.querySelector('.productCard-hero__content-images__container .next');
  const scrollContainer = document.querySelector('.productCard-hero__content-images__container-scroll');
  const imageButtons = document.querySelectorAll('.productCard-hero__content-images__container-scroll button');
  const mainImageContainer = document.querySelector('.productCard-hero__content-images__img-container img');

  let scrollAmount = 0;
  const scrollStep = 100; // количество пикселей для скролла

  // Установка первого изображения как активного при загрузке страницы
  const firstImageSrc = imageButtons[0].querySelector('img').src;
  mainImageContainer.src = firstImageSrc;
  imageButtons[0].classList.add('active');

  // Определение вертикального или горизонтального скролла
  function isHorizontalScroll() {
    return window.innerWidth < 1440;
  }

  // Автоматическое определение высоты и отступа кнопок
  function setButtonStyles() {
    const totalButtons = imageButtons.length;

    if (isHorizontalScroll()) {
      const containerWidth = scrollContainer.offsetWidth;
      const buttonWidth = Math.floor(containerWidth / totalButtons) - 10; // Ширина кнопки
      const marginRight = 10; // Отступ между кнопками

      imageButtons.forEach(button => {
        button.style.width = `${buttonWidth}px`;
        button.style.marginRight = `${marginRight}px`;
        button.style.height = 'auto'; // Для горизонтальной ориентации высота может быть авто
        button.style.marginBottom = '0'; // Убираем вертикальные отступы
      });
      scrollContainer.style.display = 'flex'; // Устанавливаем flex-контейнер для горизонтального скролла
      scrollContainer.style.overflowX = 'scroll'; // Горизонтальный скролл
      scrollContainer.style.overflowY = 'hidden'; // Убираем вертикальный скролл
    } else {
      const containerHeight = scrollContainer.offsetHeight;
      const buttonHeight = Math.floor(containerHeight / totalButtons) - 10; // Высота кнопки
      const marginBottom = 10; // Отступ между кнопками

      imageButtons.forEach(button => {
        button.style.height = `${buttonHeight}px`;
        button.style.marginBottom = `${marginBottom}px`;
        button.style.width = 'auto'; // Возвращаем стандартную ширину для вертикального скролла
        button.style.marginRight = '0'; // Убираем горизонтальные отступы
      });
      scrollContainer.style.display = 'block'; // Вертикальная ориентация
      scrollContainer.style.overflowY = 'scroll'; // Вертикальный скролл
      scrollContainer.style.overflowX = 'hidden'; // Убираем горизонтальный скролл
    }
  }

  // Вызов функции установки высоты и отступов при загрузке страницы
  setButtonStyles();

  // Функция скроллинга
  function scrollContent(direction) {
    if (isHorizontalScroll()) {
      if (direction === 'next') {
        scrollAmount += scrollStep;
      } else {
        scrollAmount -= scrollStep;
      }
      scrollContainer.scroll({
        left: scrollAmount, // Для горизонтального скролла используем "left"
        behavior: 'smooth'
      });
    } else {
      if (direction === 'next') {
        scrollAmount += scrollStep;
      } else {
        scrollAmount -= scrollStep;
      }
      scrollContainer.scroll({
        top: scrollAmount, // Для вертикального скролла используем "top"
        behavior: 'smooth'
      });
    }
  }

  // Привязка кнопок для скролла
  nextButton.addEventListener('click', () => scrollContent('next'));
  prevButton.addEventListener('click', () => scrollContent('prev'));

  // Обновление главного изображения и активация кнопки
  imageButtons.forEach(button => {
    button.addEventListener('click', function () {
      // Убираем класс active у всех кнопок
      imageButtons.forEach(btn => btn.classList.remove('active'));

      // Устанавливаем выбранное изображение как основное
      const newSrc = this.querySelector('img').src;
      mainImageContainer.src = newSrc;

      // Добавляем класс active к нажатой кнопке
      this.classList.add('active');
    });
  });

  // Функция для отслеживания свайпов
  let isDown = false;
  let startY;
  let startX; // Добавляем для горизонтального скролла
  let scrollTop;
  let scrollLeft; // Добавляем для горизонтального скролла

  // Обработка начала свайпа
  scrollContainer.addEventListener('touchstart', (e) => {
    isDown = true;
    startY = e.touches[0].pageY - scrollContainer.offsetTop;
    startX = e.touches[0].pageX - scrollContainer.offsetLeft; // Для горизонтального скролла
    scrollTop = scrollContainer.scrollTop;
    scrollLeft = scrollContainer.scrollLeft; // Для горизонтального скролла
  });

  // Обработка окончания свайпа
  scrollContainer.addEventListener('touchend', () => {
    isDown = false;
  });

  // Обработка движения пальца
  scrollContainer.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    if (isHorizontalScroll()) {
      const x = e.touches[0].pageX - scrollContainer.offsetLeft;
      const walkX = (x - startX) * 2; // Ускорение горизонтального скролла
      scrollContainer.scrollLeft = scrollLeft - walkX;
    } else {
      const y = e.touches[0].pageY - scrollContainer.offsetTop;
      const walkY = (y - startY) * 2; // Ускорение вертикального скролла
      scrollContainer.scrollTop = scrollTop - walkY;
    }
  });

  // Пересчет размеров кнопок при изменении размера окна
  window.addEventListener('resize', setButtonStyles);
});

/* Катрочка товара - появвление текста при наведении на на блок "Нашли дешевле" */

document.addEventListener('DOMContentLoaded', () => {
  // Находим элементы
  const hoverBlock = document.getElementById('lower-link');
  const tooltip = document.getElementById('lower-descr');

  // Функция для обновления позиции всплывающего текста
  function updateTooltipPosition(event) {
      const x = event.pageX + 10; // Смещение от курсора
      const y = event.pageY + 10;
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
  }

  // Показать текст при наведении
  hoverBlock.addEventListener('mouseenter', () => {
      tooltip.style.visibility = 'visible';
  });

  // Скрыть текст при выходе курсора
  hoverBlock.addEventListener('mouseleave', () => {
      tooltip.style.visibility = 'hidden';
  });

  // Обновляем позицию текста при движении курсора
  hoverBlock.addEventListener('mousemove', updateTooltipPosition);

});

/* Катрочка товара - Выбор из списка "Выберите срок сервиса" */

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("dropdownButton").addEventListener("click", function(event) {
      event.stopPropagation();
      const dropdown = document.querySelector('.productCard-hero__content-purchase__bottom-choice__selection-dropdown');
      const button = document.getElementById("dropdownButton");

      dropdown.classList.toggle('active');
      button.classList.toggle('active');
  });

  window.onclick = function(event) {
      const dropdown = document.querySelector('.productCard-hero__content-purchase__bottom-choice__selection-dropdown');
      const button = document.getElementById("dropdownButton");

      // Закрываем выпадающий блок, если клик был вне dropdown
      if (!dropdown.contains(event.target) && event.target !== button) {
          dropdown.classList.remove('active');
          button.classList.remove('active');
      }
  }

  // Функция выбора варианта
  window.selectOption = function(element, option) {
      // Обновляем текст кнопки
      document.getElementById("dropdownButtonText").innerHTML = option;

      // Закрываем выпадающий список и снимаем класс active с кнопки
      const dropdown = document.querySelector('.productCard-hero__content-purchase__bottom-choice__selection-dropdown');
      const button = document.getElementById("dropdownButton");
      dropdown.classList.remove('active');
      button.classList.remove('active');
  }
});

/* Катрочка товара - Вместе с этим товаром покупают */

document.addEventListener('DOMContentLoaded', () => {
  const productList = document.querySelector('.productCard-offers__content-scroll');
  const productCards = document.querySelectorAll('.productCard-offers__content-scroll .product-card');
  const prevButton = document.getElementById('productCard-offers-btn-prev');
  const nextButton = document.getElementById('productCard-offers-btn-next');

  // Функция для получения ширины блока
  function getCardWidth() {
      return productCards[0].offsetWidth + parseInt(getComputedStyle(productCards[0]).marginRight);
  }

  // Функция плавной прокрутки
  function smoothScroll(targetScrollLeft) {
      const startScrollLeft = productList.scrollLeft;
      const distanceToScroll = targetScrollLeft - startScrollLeft;
      const duration = 300; // Длительность анимации в мс
      let startTime = null;

      function animationStep(currentTime) {
          if (!startTime) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1); // Прогресс от 0 до 1
          productList.scrollLeft = startScrollLeft + distanceToScroll * easeInOutQuad(progress);

          if (timeElapsed < duration) {
              requestAnimationFrame(animationStep);
          }
      }

      requestAnimationFrame(animationStep);
  }

  // Функция плавного ускорения и замедления
  function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  // Обработчик события для прокрутки влево
  function scrollToPrev() {
      const cardWidth = getCardWidth();
      const targetScrollLeft = productList.scrollLeft - cardWidth;
      smoothScroll(Math.max(targetScrollLeft, 0)); // Не позволяем прокрутить за пределы
  }

  // Обработчик события для прокрутки вправо
  function scrollToNext() {
      const cardWidth = getCardWidth();
      const targetScrollLeft = productList.scrollLeft + cardWidth;
      smoothScroll(Math.min(targetScrollLeft, productList.scrollWidth - productList.offsetWidth)); // Не позволяем прокрутить за пределы
  }

  // Добавление обработчиков событий для кнопок
  prevButton.addEventListener('click', scrollToPrev);
  nextButton.addEventListener('click', scrollToNext);

  // Добавление обработчиков свайпа
  let startX, endX;

  productList.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX; // Запоминаем начальную позицию касания
  });

  productList.addEventListener('touchmove', (e) => {
      endX = e.touches[0].clientX; // Запоминаем позицию при движении
  });

  productList.addEventListener('touchend', () => {
      const diffX = startX - endX; // Находим разницу между начальной и конечной позициями

      if (diffX > 50) { // Свайп вправо
          scrollToNext();
      } else if (diffX < -50) { // Свайп влево
          scrollToPrev();
      }
  });
});

/* Катрочка товара - появление блока для отзыва по нажатии на кнопку */

document.addEventListener('DOMContentLoaded', () => {
  // Получаем элементы кнопок и блока меню
  const menuMobile = document.querySelector('.addReview');
  const menuBtn = document.getElementById('reviews-btn');
  const menuCloseBtn = document.querySelector('.addReview__content-close');
  const body = document.body; // Получаем body

  // Обработчик для открытия меню
  menuBtn.addEventListener('click', () => {
    menuMobile.classList.add('active');
    body.style.overflow = 'hidden'; // Блокируем скролл
  });

  // Обработчик для закрытия меню
  menuCloseBtn.addEventListener('click', () => {
    menuMobile.classList.remove('active');
    body.style.overflow = ''; // Возвращаем скролл
  });
});

/* Катрочка товара - переключение блоков */

document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('.productCard-info__content-nav button');
  const contentBottom = document.querySelector('.productCard-info__content-bottom');
  const contentSections = document.querySelectorAll('.productCard-info__content-bottom > div');

  // Функция для смены активного блока и кнопки
  function setActive(button, target) {
      // Удаляем класс active у всех кнопок и секций контента
      buttons.forEach(btn => btn.classList.remove('active'));
      contentSections.forEach(section => section.classList.remove('active'));

      // Добавляем класс active выбранной кнопке и соответствующему блоку
      button.classList.add('active');
      const activeSection = document.querySelector(`.productCard-info__content-bottom__${target}`);
      activeSection.classList.add('active');

      // Изменяем высоту контейнера под активный блок
      contentBottom.style.height = `${activeSection.scrollHeight}px`;
  }

  // Назначаем обработчики событий для каждой кнопки
  buttons.forEach(button => {
      button.addEventListener('click', function () {
          const target = this.classList[0].split('-').pop(); // Получаем часть класса после productCard-info-
          setActive(this, target);
      });
  });

  // Устанавливаем начальный активный блок и кнопку
  const initialButton = document.querySelector('.productCard-info-description');
  setActive(initialButton, 'description');
});

/* Катрочка товара - Рекомендуем также */

document.addEventListener('DOMContentLoaded', () => {
  const productList = document.querySelector('.productCard-recommendations__content-blocks');
  const productCards = document.querySelectorAll('.productCard-recommendations__content-blocks .product-card');
  const prevButton = document.getElementById('productCard-recommendations-btn-prev');
  const nextButton = document.getElementById('productCard-recommendations-btn-next');
  const progressBar = document.querySelector('.productCard-recommendations__content-indicator__progress');

  // Функция для получения ширины одного карточного блока
  function getCardWidth() {
      return productCards[0].offsetWidth + parseInt(getComputedStyle(productCards[0]).marginRight);
  }

  // Функция для получения общего количества карточек и их ширины
  function getTotalWidth() {
      return productCards.length * getCardWidth();
  }

  // Функция для обновления прогресс-бара
  function updateProgressBar() {
      const scrollLeft = productList.scrollLeft;
      const totalScrollWidth = getTotalWidth() - productList.offsetWidth;
      const scrollPercentage = (scrollLeft / totalScrollWidth) * 100;
      progressBar.style.width = `${scrollPercentage}%`;
  }

  // Функция плавной прокрутки
  function smoothScroll(targetScrollLeft) {
      const startScrollLeft = productList.scrollLeft;
      const distanceToScroll = targetScrollLeft - startScrollLeft;
      const duration = 300; // Длительность анимации в мс
      let startTime = null;

      function animationStep(currentTime) {
          if (!startTime) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1); // Прогресс от 0 до 1
          productList.scrollLeft = startScrollLeft + distanceToScroll * easeInOutQuad(progress);

          if (timeElapsed < duration) {
              requestAnimationFrame(animationStep);
          }
      }

      requestAnimationFrame(animationStep);
  }

  // Функция плавного ускорения и замедления
  function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  // Обработчик события для прокрутки влево
  function scrollToPrev() {
      const cardWidth = getCardWidth();
      const targetScrollLeft = Math.max(productList.scrollLeft - cardWidth, 0);
      smoothScroll(targetScrollLeft);
  }

  // Обработчик события для прокрутки вправо
  function scrollToNext() {
      const cardWidth = getCardWidth();
      const targetScrollLeft = Math.min(productList.scrollLeft + cardWidth, getTotalWidth() - productList.offsetWidth);
      smoothScroll(targetScrollLeft);
  }

  // Добавление событий для кнопок
  prevButton.addEventListener('click', () => {
      scrollToPrev();
      setTimeout(updateProgressBar, 300); // Обновляем прогресс с задержкой для плавности
  });

  nextButton.addEventListener('click', () => {
      scrollToNext();
      setTimeout(updateProgressBar, 300); // Обновляем прогресс с задержкой для плавности
  });

  // Добавление обработчиков для свайпа
  let startX, endX;

  productList.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
  });

  productList.addEventListener('touchmove', (e) => {
      endX = e.touches[0].clientX;
  });

  productList.addEventListener('touchend', () => {
      const diffX = startX - endX;

      if (diffX > 50) {
          scrollToNext();
      } else if (diffX < -50) {
          scrollToPrev();
      }
      setTimeout(updateProgressBar, 300); // Обновляем прогресс
  });

  // Обновление прогресс-бара при скролле
  productList.addEventListener('scroll', updateProgressBar);

  // Устанавливаем начальный прогресс
  updateProgressBar();
});

/* Катрочка товара - Мобильная версия переключения */

document.addEventListener('click', function (event) {
  const mobileButton = document.getElementById('productCard-info__content-nav-mobile');
  const mobileDescr = document.getElementById('productCard-info__content-nav-mobile-descr');
  const navBlock = document.querySelector('.productCard-info__content-nav');

  // Проверяем, существуют ли необходимые элементы на странице
  if (!mobileButton || !mobileDescr || !navBlock) {
    return; // Прерываем выполнение, если элементов нет
  }

  // Клик по кнопке мобильного меню
  if (event.target.closest('#productCard-info__content-nav-mobile')) {
    navBlock.classList.toggle('active');
    mobileButton.classList.toggle('active');
    return; // Прерываем выполнение, чтобы не закрыть меню сразу
  }

  // Клик по кнопкам внутри nav-блока
  if (event.target.closest('.productCard-info__content-nav button')) {
    const clickedButton = event.target.closest('button');

    // Обновляем текст мобильной кнопки
    mobileDescr.textContent = clickedButton.textContent.trim();

    // Закрываем блок и убираем класс active у обеих элементов
    navBlock.classList.remove('active');
    mobileButton.classList.remove('active');
    return;
  }

  // Проверяем, активен ли блок перед обработкой клика вне его
  if (navBlock.classList.contains('active') || mobileButton.classList.contains('active')) {
    // Клик вне меню и кнопки мобильного меню
    if (!navBlock.contains(event.target) && !mobileButton.contains(event.target)) {
      navBlock.classList.remove('active');
      mobileButton.classList.remove('active');
    }
  }
});


/* Катрочка товара - Форма для отзыва */

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".addReview__content-info__form");
  const nameInput = document.getElementById("addReview-name");
  const emailInput = document.getElementById("addReview-email");
  const telInput = document.getElementById("addReview-tel");

  if (nameInput && emailInput && telInput && form) {

    // Маска для телефона: +7 и слитные цифры
    telInput.addEventListener("input", function (e) {
      let value = telInput.value.replace(/\D/g, ""); // Удаляем все нецифровые символы

      if (value.startsWith("7")) {
        value = value.slice(1); // Убираем первый символ, если это 7
      }

      // Формируем маску +7XXXXXXXXXX
      telInput.value = "+7" + value.slice(0, 10);
    });

    // Ограничение ввода только букв для имени
    nameInput.addEventListener("input", function () {
      nameInput.value = nameInput.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, ""); // Разрешаем только буквы и пробелы
    });

    // Функция для окрашивания бордера в красный при ошибке
    function setError(input) {
      input.style.border = "2px solid red";
    }

    // Функция для сброса стиля бордера
    function clearError(input) {
      input.style.border = "";
    }

    // Валидация формы
    form.addEventListener("submit", function (e) {
      let isValid = true;

      // Проверка на имя (обязательное поле)
      if (nameInput.value.trim() === "") {
        setError(nameInput);
        isValid = false;
      } else {
        clearError(nameInput);
      }

      // Проверка на email (обязательное поле)
      if (emailInput.value.trim() === "") {
        setError(emailInput);
        isValid = false;
      } else {
        clearError(emailInput);
      }

      // Проверка на телефон (должно быть ровно 10 цифр после +7)
      let telValue = telInput.value.replace(/\D/g, ""); // Убираем все символы, кроме цифр
      if (telValue.length !== 11) {
        setError(telInput);
        isValid = false;
      } else {
        clearError(telInput);
      }

      // Если форма не валидна, предотвращаем отправку
      if (!isValid) {
        e.preventDefault();
      }
    });
  } else {
    console.error("Не удалось найти необходимые элементы на странице");
  }
});


/**/

/* Магазина и контакты - map */

document.addEventListener("DOMContentLoaded", function () {
  ymaps.ready(init);

  // Инициализация карты
  let myMap;

  function init() {
      myMap = new ymaps.Map("map", {
          center: [48.015884, 37.802850],
          zoom: 11,
          controls: ['zoomControl'] // Управление масштабом
      });

    // Добавление маркеров для мест на карте
    const places = document.querySelectorAll('#placesList li'); places.forEach(place => {
      const lat = place.getAttribute('data-lat');
      const lng = place.getAttribute('data-lng');
      addPlacemark(lat, lng, place.textContent); // Добавляем маркер на карту

      // Добавление обработчика клика на элемент списка
      place.addEventListener('click', () => {
          moveToLocation(lat, lng, place.textContent);
      });
    });

    // Обработчик для строки поиска
    document.getElementById('shops-search').addEventListener('input', filterPlaces);
  }

 // Функция для добавления маркера на карту
 function addPlacemark(lat, lng, name) {
    const placemark = new ymaps.Placemark([lat, lng], {
        balloonContent: name
    });

    // Добавление маркера на карту
    myMap.geoObjects.add(placemark);

    // Добавление обработчика клика на маркер
    placemark.events.add('click', () => {
        moveToLocation(lat, lng, name);
    });
  }

 // Функция для перемещения карты
 function moveToLocation(lat, lng, name) {
    myMap.setCenter([lat, lng], 16); // Увеличение масштаба при перемещении
    const placemark = new ymaps.Placemark([lat, lng], {
        balloonContent: name
    });

    // Удаляем предыдущие маркеры
    myMap.geoObjects.removeAll();
    // Добавляем новый маркер
    myMap.geoObjects.add(placemark);
    placemark.balloon.open(); // Открытие балуна с информацией
  }

  // Функция для фильтрации мест
  function filterPlaces() {
    const query = this.value.toLowerCase();
    const places = document.querySelectorAll('#placesList li');

    places.forEach(place => {
        const placeName = place.textContent.toLowerCase();
        if (placeName.includes(query)) {
            place.style.display = ''; // Показываем элемент
        } else {
            place.style.display = 'none'; // Скрываем элемент
        }
    });
  }
});

/* Гарантия - вопросы */

document.addEventListener('DOMContentLoaded', function() {
  // Получаем все элементы заголовков FAQ
  const faqHeaders = document.querySelectorAll('.warranty-questions__content-faq__item-header');

  faqHeaders.forEach(header => {
    // Добавляем обработчик события клика на каждый заголовок
    header.addEventListener('click', function() {
      // Получаем родительский элемент FAQ item
      const faqItem = header.parentElement;
      // Получаем блок с ответом
      const answer = faqItem.querySelector('.warranty-questions__content-faq__item-answer');

      // Если блок уже открыт (класс active), то сворачиваем его
      if (faqItem.classList.contains('active')) {
        faqItem.style.height = `${header.offsetHeight}px`; // Ставим высоту только заголовка
        faqItem.classList.remove('active');
      } else {
        // Закрываем все остальные блоки, если нужно сделать аккордеон
        document.querySelectorAll('.warranty-questions__content-faq__item.active').forEach(activeItem => {
          activeItem.style.height = `${activeItem.querySelector('.warranty-questions__content-faq__item-header').offsetHeight}px`;
          activeItem.classList.remove('active');
        });

        // Получаем полную высоту: высота заголовка + высота ответа
        const fullHeight = header.offsetHeight + answer.scrollHeight;
        // Задаем новую высоту блоку FAQ item
        faqItem.style.height = `${fullHeight}px`;
        // Добавляем класс active
        faqItem.classList.add('active');
      }
    });
  });

  // Устанавливаем начальную высоту для всех блоков FAQ item
  document.querySelectorAll('.warranty-questions__content-faq__item').forEach(item => {
    const header = item.querySelector('.warranty-questions__content-faq__item-header');
    item.style.height = `${header.offsetHeight}px`;
  });
});

/* Блог - переключение блоков */

document.addEventListener('DOMContentLoaded', function() {

  // Получаем все кнопки фильтрации
  const buttons = document.querySelectorAll('.blog-hero__content-btns button');
  // Получаем все блоки
  const blocks = document.querySelectorAll('.blog-hero__content-blocks__block');

  // Функция для фильтрации блоков
  function filterBlocks(keyword) {
      blocks.forEach(block => {
          const keywords = block.getAttribute('data-keywords').split(' ');

          // Показать блок, если ключевое слово совпадает, или показывать все блоки при выборе "all"
          if (keyword === 'all' || keywords.includes(keyword)) {
              block.style.display = 'block';
          } else {
              block.style.display = 'none';
          }
      });
  }

  // Функция для активации кнопки
  function activateButton(button) {
      // Удаляем класс active у всех кнопок
      buttons.forEach(btn => btn.classList.remove('active'));
      // Добавляем класс active к нажатой кнопке
      button.classList.add('active');
  }

  // Добавляем обработчик событий на каждую кнопку
  buttons.forEach(button => {
      button.addEventListener('click', () => {
          const filter = button.getAttribute('data-filter');
          filterBlocks(filter);
          activateButton(button);
      });
  });

  // Проходим по каждому блоку
  blocks.forEach(block => {
  // Получаем значение из атрибута 'data-keywords'
  const keyword = block.getAttribute('data-keywords');

  // Ищем <span> элемент внутри текущего блока
  const span = block.querySelector('span');

  // Проверяем, что <span> существует
  if (span) {
    // Присваиваем значение 'data-keywords' как класс для элемента <span>
    span.className = keyword;

    // Меняем текст внутри <span> в зависимости от значения 'data-keywords'
    switch (keyword) {
      case 'new':
        span.textContent = 'Новинки';
        break;
      case 'recommendations':
        span.textContent = 'Советы специалистов';
        break;
      case 'best':
        span.textContent = 'Лучшее для вас';
        break;
      case 'useful':
        span.textContent = 'Полезное';
        break;
      default:
        span.textContent = 'Другие'; // Текст по умолчанию, если значение не совпадает
        break;
    }
  }
  });
  // Показываем все блоки по умолчанию при загрузке страницы
  filterBlocks('all');

});

/**/

/* Страница Блога - форма */

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.blogPage-hero__content-review__form');
  const nameInput = document.getElementById('blogPage-name');
  const emailInput = document.getElementById('blogPage-email');
  const telInput = document.getElementById('blogPage-tel');
  const textArea = document.getElementById('blogPage-text');

  // Функция для проверки email
  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Ограничение поля "Имя" только буквами
  nameInput.addEventListener('input', function () {
    nameInput.value = nameInput.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '');
  });

  // Маска для поля "Телефон" (только цифры, без пробелов)
  telInput.addEventListener('input', function () {
    let value = telInput.value.replace(/\D/g, ''); // Убираем все нецифровые символы
    if (!value.startsWith('7')) {
      value = '7' + value; // Добавляем код +7, если его нет
    }
    if (value.length > 11) { // Ограничиваем ввод 10 цифрами после +7
      value = value.substring(0, 11);
    }
    telInput.value = '+7' + value.substring(1); // Отображаем номер слитно после +7
  });

  // Функция для выделения некорректных полей
  function setError(element, isError) {
    if (isError) {
      element.classList.add('error-border');
    } else {
      element.classList.remove('error-border');
    }
  }

  // Проверка полей при отправке формы
  form.addEventListener('submit', function (e) {
    let valid = true;

    // Проверка поля "Имя"
    if (nameInput.value.trim() === '') {
      setError(nameInput, true);
      valid = false;
    } else {
      setError(nameInput, false);
    }

    // Проверка поля "Email"
    if (!validateEmail(emailInput.value)) {
      setError(emailInput, true);
      valid = false;
    } else {
      setError(emailInput, false);
    }

    // Проверка поля "Телефон"
    if (telInput.value.length !== 12) { // +7XXXXXXXXXX = 12 символов
      setError(telInput, true);
      valid = false;
    } else {
      setError(telInput, false);
    }

    // Если форма заполнена неправильно, предотвратить отправку
    if (!valid) {
      e.preventDefault();
    }
  });
});

/* Страница Блога - похожие статьи */

document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.querySelector('.blogPage-articles__content-bottom__blocks');
  const cards = document.querySelectorAll('.blogPage-articles__content-bottom__blocks-block');
  const progressIndicator = document.querySelector('.blogPage-articles__content-bottom__indicator-progress');

  let cardWidth = cards[0].offsetWidth;  // Ширина одного блока
  let cardMarginRight = parseFloat(getComputedStyle(cards[0]).marginRight);  // Правый отступ
  let scrollAmount = cardWidth + cardMarginRight;  // Общая длина прокрутки одного блока
  let totalScrollWidth = scrollContainer.scrollWidth - scrollContainer.offsetWidth;  // Максимальная прокрутка

  // Функция для обновления ширины индикатора прогресса
  function updateProgress() {
    let scrollLeft = scrollContainer.scrollLeft;
    let scrollPercentage = (scrollLeft / totalScrollWidth) * 100;
    progressIndicator.style.width = `${scrollPercentage}%`;
  }

  // Обновление индикатора при скролле
  scrollContainer.addEventListener('scroll', updateProgress);

  // Поддержка свайпа
  let startX;
  let scrollStart;

  scrollContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
    scrollStart = scrollContainer.scrollLeft;
  });

  scrollContainer.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const moveX = touch.pageX - startX;
    scrollContainer.scrollLeft = scrollStart - moveX;
  });

  // Обновление размеров при изменении окна
  window.addEventListener('resize', () => {
    cardWidth = cards[0].offsetWidth;
    cardMarginRight = parseFloat(getComputedStyle(cards[0]).marginRight);
    scrollAmount = cardWidth + cardMarginRight;
    totalScrollWidth = scrollContainer.scrollWidth - scrollContainer.offsetWidth;
    updateProgress();  // Обновляем прогресс после изменения размеров
  });
});

/**/

/* Корзина - изменение значения в поле */

document.addEventListener("DOMContentLoaded", function () {
  // Функция для изменения значения
  function updateValue(element, delta) {
    // Найти <p> с числовым значением
    const valueElement = element.querySelector('.basket-hero__content-products__list-item__article-volume__value');
    let currentValue = parseInt(valueElement.textContent);

    // Обновить значение (минимум 0)
    currentValue = Math.max(0, currentValue + delta);

    // Установить обновленное значение
    valueElement.textContent = currentValue;
  }

  // Добавить обработчики событий для всех элементов
  document.querySelectorAll('.basket-hero__content-products__list-item__article-volume').forEach(function(item) {
    // Кнопка уменьшения
    item.querySelector('.decrease').addEventListener('click', function() {
      updateValue(item, -1);
    });

    // Кнопка увеличения
    item.querySelector('.increase').addEventListener('click', function() {
      updateValue(item, +1);
    });
  });
});

/**/

/* Оплата и доставка - форма */

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.payment-hero__content-peyment__form');
  const inputs = form.querySelectorAll('input[required]');
  const telInput = document.getElementById('payment-tel');
  const emailInput = document.getElementById('payment-email');
  const nameInput = document.getElementById('payment-firstName');
  const secondNameInput = document.getElementById('payment-secondName');

  // Ограничение на ввод только букв в поле "Имя"
  nameInput.addEventListener('input', function (e) {
    this.value = this.value.replace(/[^а-яА-ЯёЁa-zA-Z]/g, '');
  });

  // Ограничение на ввод только букв в поле "Фамилия"
  secondNameInput.addEventListener('input', function (e) {
    this.value = this.value.replace(/[^а-яА-ЯёЁa-zA-Z]/g, '');
  });

  // Маска для телефона без пробелов
  telInput.addEventListener('input', function (e) {
    let val = this.value.replace(/\D/g, ''); // Удаление всех нечисловых символов
    if (val.length > 1) {
      this.value = '+7' + val.substring(1, 11); // Форматируем номер без пробелов
    } else {
      this.value = '+7'; // Когда поле очищено, оставляем только +7
    }
  });

  // Ограничение на ввод только цифр в поле "Телефон"
  telInput.addEventListener('keydown', function (e) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/\d/.test(e.key) && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  });

  // Функция для проверки правильности формата телефона
  function validatePhone(phone) {
    const phoneRegex = /^\+7\d{10}$/; // Регулярное выражение для проверки номера без пробелов
    return phoneRegex.test(phone);
  }

  // Функция для проверки правильности формата email
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Проверка формы при отправке
  form.addEventListener('submit', function (e) {
    let isValid = true;

    // Проверка всех обязательных полей
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = 'red'; // Окрашиваем бордер в красный, если поле пустое
        isValid = false;
      } else {
        input.style.borderColor = ''; // Возвращаем стандартный бордер
      }
    });

    // Проверка телефона
    if (!validatePhone(telInput.value)) {
      telInput.style.borderColor = 'red';
      isValid = false;
    } else {
      telInput.style.borderColor = '';
    }

    // Проверка email
    if (!validateEmail(emailInput.value)) {
      emailInput.style.borderColor = 'red';
      isValid = false;
    } else {
      emailInput.style.borderColor = '';
    }

    if (!isValid) {
      e.preventDefault(); // Предотвращаем отправку формы, если есть ошибки
    }
  });
});


/* Сравнение товаров - управление скролллом */

document.addEventListener('DOMContentLoaded', function() {
  // Получаем элементы
  const scrollContainerCards = document.querySelector('.productComparison-hero__content-cards');
  const scrollContainerList = document.querySelector('.productComparison-hero__content-info__item-bottom');

  // Функция для плавной горизонтальной прокрутки
  function smoothScroll(scrollContainer, delta) {
    let start = scrollContainer.scrollLeft;
    let end = start + delta;
    let startTime = null;

    // Продолжительность анимации (в миллисекундах)
    const duration = 300;

    // Функция анимации
    function animateScroll(time) {
      if (startTime === null) {
        startTime = time;
      }
      const timeElapsed = time - startTime;
      const progress = Math.min(timeElapsed / duration, 1); // Ограничиваем прогресс от 0 до 1
      const ease = progress * (2 - progress); // Функция плавного ускорения/замедления (easing)

      // Вычисляем текущее положение прокрутки
      scrollContainer.scrollLeft = start + (end - start) * ease;

      // Если анимация не завершена, продолжаем её
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    }

    requestAnimationFrame(animateScroll);
  }

  // Функция для активации горизонтальной прокрутки, если содержимое переполняет контейнер
  function addHorizontalScrollIfOverflow(scrollContainer) {
    if (scrollContainer) {
      if (scrollContainer.scrollWidth > scrollContainer.clientWidth) {
        scrollContainer.addEventListener('wheel', function(event) {
          event.preventDefault();
          smoothScroll(scrollContainer, event.deltaY);
        });
      } else {
        // Удаляем обработчик, если контент не переполняет контейнер
        scrollContainer.removeEventListener('wheel', function(event) {
          event.preventDefault();
          smoothScroll(scrollContainer, event.deltaY);
        });
      }
    }
  }

  // Проверяем и добавляем горизонтальную прокрутку для обоих элементов
  addHorizontalScrollIfOverflow(scrollContainerCards);
  addHorizontalScrollIfOverflow(scrollContainerList);

  // Следим за изменением размера окна и пересчитываем
  window.addEventListener('resize', function() {
    addHorizontalScrollIfOverflow(scrollContainerCards);
    addHorizontalScrollIfOverflow(scrollContainerList);
  });
});



/* Сравнение товаров - открытие блоков */

document.addEventListener('DOMContentLoaded', function() {
  // Получаем все элементы заголовков FAQ
  const faqHeaders = document.querySelectorAll('.productComparison-hero__content-info__item-header');

  faqHeaders.forEach(header => {
    // Добавляем обработчик события клика на каждый заголовок
    header.addEventListener('click', function() {
      // Получаем родительский элемент FAQ item
      const faqItem = header.parentElement;
      // Получаем блок с ответом
      const answer = faqItem.querySelector('.productComparison-hero__content-info__item-bottom');

      // Если блок уже открыт (класс active), то сворачиваем его
      if (faqItem.classList.contains('active')) {
        faqItem.style.height = `${header.offsetHeight}px`; // Ставим высоту только заголовка
        faqItem.classList.remove('active');
      } else {
        // Получаем полную высоту: высота заголовка + высота ответа
        const fullHeight = header.offsetHeight + answer.scrollHeight;
        // Задаем новую высоту блоку FAQ item
        faqItem.style.height = `${fullHeight}px`;
        // Добавляем класс active
        faqItem.classList.add('active');
      }
    });
  });

  // Устанавливаем начальную высоту для всех блоков FAQ item
  document.querySelectorAll('.productComparison-hero__content-info__item').forEach(item => {
    const header = item.querySelector('.productComparison-hero__content-info__item-header');
    item.style.height = `${header.offsetHeight}px`;
  });
});

/* Личный кабинет - открытие меню в мобильной версии */

document.addEventListener('DOMContentLoaded', function() {
  const personalAccountBlock = document.querySelector('.personalAccount-hero__content-btns');
  const personalAccountBtn = document.getElementById('personalAccount-btns-mobile');
  let isActive = false; // Флаг для отслеживания активного состояния

  // Функция для переключения классов active
  function toggleActive() {
    personalAccountBlock.classList.toggle('active');
    personalAccountBtn.classList.toggle('active');
    isActive = !isActive;
  }

  // Добавляем/убираем класс active при клике на кнопку
  personalAccountBtn.addEventListener('click', toggleActive);

  // Убираем класс active при уходе мыши из блока
  personalAccountBlock.addEventListener('mouseleave', function() {
    if (isActive) {
      personalAccountBlock.classList.remove('active');
      personalAccountBtn.classList.remove('active');
      isActive = false;
    }
  });

  // Убираем класс active при клике вне блока, если он активен
  document.addEventListener('mousedown', function(event) {
    if (isActive && !personalAccountBlock.contains(event.target) && !personalAccountBtn.contains(event.target)) {
      personalAccountBlock.classList.remove('active');
      personalAccountBtn.classList.remove('active');
      isActive = false;
    }
  });
});


/* Личный кабинет - мои заказы */

document.addEventListener('DOMContentLoaded', () => {
  // Функция для инициализации обработки всех элементов
  function setupItems() {
    // Находим все элементы с классом personalAccount-hero__content-bloks__orders-list__item
    const items = document.querySelectorAll('.personalAccount-hero__content-bloks__orders-list__item');

    // Проходим по каждому элементу и устанавливаем обработчики
    items.forEach(item => {
      // Проверяем, был ли уже обработан этот элемент, чтобы избежать дублирования событий
      if (!item.dataset.initialized) {
        // Отмечаем элемент как инициализированный
        item.dataset.initialized = 'true';

        // Находим свернутую и развернутую части блока
        const collapsedBlock = item.querySelector('.personalAccount-hero__content-bloks__orders-list__item-collapsed');
        const expandedBlock = item.querySelector('.personalAccount-hero__content-bloks__orders-list__item-expanded');
        const rollButton = item.querySelector('.personalAccount__orders-block-roll');

        // Установка высоты при загрузке страницы
        const calculateHeight = () => {
          if (expandedBlock.classList.contains('active')) {
            item.style.height = expandedBlock.scrollHeight + 'px';
          } else {
            item.style.height = collapsedBlock.scrollHeight + 'px';
          }
        };

        // Вызываем функцию для расчета высоты при загрузке
        calculateHeight();

        // Обработка клика на свернутый блок для его открытия
        collapsedBlock.addEventListener('click', () => {
          if (!expandedBlock.classList.contains('active')) {
            // Удаляем активные классы у всех элементов, чтобы только один блок был развернут
            items.forEach(otherItem => {
              const otherCollapsedBlock = otherItem.querySelector('.personalAccount-hero__content-bloks__orders-list__item-collapsed');
              const otherExpandedBlock = otherItem.querySelector('.personalAccount-hero__content-bloks__orders-list__item-expanded');

              otherCollapsedBlock.classList.add('active');
              otherExpandedBlock.classList.remove('active');
              otherItem.classList.remove('change');

              // Возвращаем высоту свернутого блока для всех остальных
              otherItem.style.height = otherCollapsedBlock.scrollHeight + 'px';
            });

            // Активируем текущий блок: убираем класс active у свернутого и добавляем к развернутому
            collapsedBlock.classList.remove('active');
            expandedBlock.classList.add('active');
            item.classList.add('change');

            // Устанавливаем высоту для развернутого блока
            item.style.height = expandedBlock.scrollHeight + 'px';
          }
        });

        // Обработка клика на кнопку "свернуть" внутри развернутого блока
        rollButton.addEventListener('click', (event) => {
          event.stopPropagation();

          // Возвращаем активный класс к свернутому блоку и убираем с развернутого
          collapsedBlock.classList.add('active');
          expandedBlock.classList.remove('active');
          item.classList.remove('change');

          // Устанавливаем высоту свернутого блока
          item.style.height = collapsedBlock.scrollHeight + 'px';
        });

        // Перерасчет высоты блока при изменении содержимого или динамическом добавлении
        window.addEventListener('resize', calculateHeight);
      }
    });
  }

  // Инициализация всех элементов при загрузке страницы
  setupItems();

  // Пример динамического добавления элементов, чтобы они тоже работали
  // Эту функцию можно вызывать каждый раз, когда добавляются новые элементы
  function addNewItem(newItemHtml) {
    // Добавляем новый элемент в список заказов (например, в конец списка)
    const ordersList = document.querySelector('.personalAccount-hero__content-bloks__orders-list');
    ordersList.insertAdjacentHTML('beforeend', newItemHtml);

    // Переинициализируем все элементы, включая новые
    setupItems();
  }
});


/* Личный кабинет - валидации формы Date */

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.personalAccount-hero__content-bloks__data-form');
  const inputs = form.querySelectorAll('input[required]');

  // Ограничение для ввода только букв в поле "Имя"
  const firstNameInput = document.getElementById('personalAccount-firstName');
  firstNameInput.addEventListener('input', function (e) {
    this.value = this.value.replace(/[^a-zA-Zа-яА-ЯёЁ]/g, '');
    validateField(firstNameInput); // Проверяем поле при вводе
  });

  // Ограничение для ввода только букв в поле "Фамилия"
  const secondNameInput = document.getElementById('personalAccount-secondName');
  secondNameInput.addEventListener('input', function (e) {
    this.value = this.value.replace(/[^a-zA-Zа-яА-ЯёЁ]/g, '');
    validateField(secondNameInput); // Проверяем поле при вводе
  });

  // Функция для проверки полей и окрашивания бордера
  function validateField(input) {
    if (!input.validity.valid || input.value.trim() === '') {
      input.style.borderColor = 'red';
    } else {
      input.style.borderColor = '';
    }
  }

  // Проверка всех полей при отправке формы
  form.addEventListener('submit', function (e) {
    let isValid = true;
    inputs.forEach(function (input) {
      validateField(input);
      if (!input.validity.valid || input.value.trim() === '') {
        isValid = false;
      }
    });

    // Останавливаем отправку формы, если есть ошибки
    if (!isValid) {
      e.preventDefault();
    }
  });

  // Проверка поля при вводе данных
  inputs.forEach(function (input) {
    input.addEventListener('input', function () {
      validateField(input); // Проверка поля при каждом изменении
    });
  });
});

/* Личный кабинет - валидации формы adress */

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.personalAccount-hero__content-bloks__adress-form');
  const inputs = form.querySelectorAll('input[required]');

  // Ограничение для ввода только букв в поле "Имя"
  const firstNameInput = document.getElementById('personalAccount-adress-firstName');
  firstNameInput.addEventListener('input', function () {
    this.value = this.value.replace(/[^a-zA-Zа-яА-ЯёЁ]/g, '');
    validateField(firstNameInput);
  });

  // Ограничение для ввода только букв в поле "Фамилия"
  const secondNameInput = document.getElementById('personalAccount-adress-secondName');
  secondNameInput.addEventListener('input', function () {
    this.value = this.value.replace(/[^a-zA-Zа-яА-ЯёЁ]/g, '');
    validateField(secondNameInput);
  });

  // Маска для телефона
  const phoneInput = document.getElementById('personalAccount-adress-tel');
  phoneInput.addEventListener('input', function () {
    let value = phoneInput.value.replace(/\D/g, ''); // Удаляем все символы, кроме цифр
    if (value.startsWith('7')) {
      value = value.substring(1); // Убираем лишнюю семёрку, если пользователь ввел вручную
    }
    phoneInput.value = '+7 ' + value.substring(0, 10); // Ограничиваем длину ввода
    validateField(phoneInput);
  });

  // Функция для валидации полей
  function validateField(input) {
    if (input === phoneInput) {
      // Валидация телефона: проверяем, что в номере ровно 10 цифр после +7
      const digits = input.value.replace(/\D/g, '');
      if (digits.length !== 11 || !digits.startsWith('7')) {
        input.style.borderColor = 'red';
      } else {
        input.style.borderColor = '';
      }
    } else if (!input.validity.valid || input.value.trim() === '') {
      input.style.borderColor = 'red';
    } else {
      input.style.borderColor = '';
    }
  }

  // Проверка всех полей при отправке формы
  form.addEventListener('submit', function (e) {
    let isValid = true;
    inputs.forEach(function (input) {
      validateField(input);
      if (!input.validity.valid || input.value.trim() === '' || (input === phoneInput && input.value.replace(/\D/g, '').length !== 11)) {
        isValid = false;
      }
    });

    // Останавливаем отправку формы, если есть ошибки
    if (!isValid) {
      e.preventDefault();
    }
  });

  // Проверка поля при вводе данных
  inputs.forEach(function (input) {
    input.addEventListener('input', function () {
      validateField(input);
    });
  });
});

