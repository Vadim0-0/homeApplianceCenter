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

/* Header - menu-mobile - открытие карточек  */

document.addEventListener('DOMContentLoaded', () => {
  // Получаем все элементы меню
  const menuItems = document.querySelectorAll('.header-menu-mobile__content-menu__list-item');

  // Функция для установки начальной высоты элементов (высота кнопки)
  menuItems.forEach(item => {
    const button = item.querySelector('button');
    item.style.height = `${button.offsetHeight}px`;
  });

  // Функция для обработки кликов на кнопки
  menuItems.forEach(item => {
    const button = item.querySelector('button');

    button.addEventListener('click', () => {
      // Проверяем, активен ли элемент уже
      const isActive = item.classList.contains('active');

      // Убираем активный класс у всех элементов и сбрасываем их высоту
      menuItems.forEach(i => {
        i.classList.remove('active');
        const btn = i.querySelector('button');
        i.style.height = `${btn.offsetHeight}px`;
      });

      // Если текущий элемент не был активен, активируем его
      if (!isActive) {
        item.classList.add('active');

        // Получаем высоту кнопки и вложенного списка
        const itemList = item.querySelector('.header-menu-mobile__content-menu__list-item__list');
        const totalHeight = button.offsetHeight + (itemList ? itemList.offsetHeight : 0);

        // Устанавливаем новую высоту для активного элемента
        item.style.height = `${totalHeight}px`;
      }
    });
  });
});

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

  // Обработчик события для прокрутки влево
  function scrollToPrev() {
      const cardWidth = getCardWidth();
      productList.scrollBy({
          top: 0,
          left: -cardWidth,
          behavior: 'smooth' // Плавная прокрутка
      });
  }

  // Обработчик события для прокрутки вправо
  function scrollToNext() {
      const cardWidth = getCardWidth();
      productList.scrollBy({
          top: 0,
          left: cardWidth,
          behavior: 'smooth' // Плавная прокрутка
      });
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

/* index-categories */

document.addEventListener('DOMContentLoaded', () => {
  const cardsContainer = document.querySelector('.index-categories__content-scroll__cards');
  const cards = document.querySelectorAll('.index-categories__content-scroll__cards-card');
  const indicators = document.querySelectorAll('.index-categories__content-position span');

  let currentIndex = 0;

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
    cardsContainer.addEventListener('mousedown', startSwipe);
    cardsContainer.addEventListener('touchstart', startSwipe);

    cardsContainer.addEventListener('mousemove', handleSwipe);
    cardsContainer.addEventListener('touchmove', handleSwipe);

    cardsContainer.addEventListener('mouseup', endSwipe);
    cardsContainer.addEventListener('touchend', endSwipe);

    cardsContainer.addEventListener('mouseleave', endSwipe);
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

  // Функция для скролла к блоку
  const scrollToBlock = (index) => {
    scrollContainer.scrollTo({
      left: blockWidth * index,
      behavior: 'smooth'
    });
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

  // Листание по кнопкам
  nextBtn.addEventListener('click', () => {
    scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  prevBtn.addEventListener('click', () => {
    scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
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
