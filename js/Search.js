(() => {
  const state = {
    form: document.querySelector('.form'),
    formSearch: document.querySelector('.form__search'),
    formSelection: document.querySelector('.form__selection'),
    formBtn: document.querySelector('.form__btn'),
    searchWord: document.querySelector('.search__word'),
    searchRecepts: document.querySelector('.search__recepts'),
    featured: document.querySelector('.featured .recepts'),
    navItem: [...document.querySelectorAll('.navigation__item__link')],
    mobileMenu: document.querySelector('.mobile-menu'),
    mobileBtn: document.querySelector('.mobileBtn'),
    mobileClose: document.querySelector('.mobile-menu .close'),
    mobileItems: [...document.querySelectorAll('.mobile-menu .menu__item__link')],
  };

  let type = '';
  let defNum = 4;
  let clickOfMore = 1;

  const apiKey = '79657becac9840e5b0e39ce3299702c2';

  const getHtmlRecept = (url, image, title, dots, minutes) => {
    return `<a target="_blank" href="${url}" class="recept">
    <img class="recept__img" src="https://spoonacular.com/recipeImages/${image}" alt="" />
    <h1 class="recept__heading--primary">${title}${dots}</h1>
    <p class="recept__minutes">${minutes} minut</p>
    </a>`;
  };

  const getDots = (spArr, maxLength) => (spArr.length > maxLength ? '...' : '');
  const getTitle = (spArr, maxLength) => spArr.slice(0, maxLength).join(' ');

  const newSearch = (selectionValue, searchValue) => {
    state.searchRecepts.innerHTML = '';
    clickOfMore = 1;
    selectionValue === 'def' ? (type = '') : (type = selectionValue);
    state.searchWord.innerHTML = `<p>Hledané slovo: <span>"${searchValue}"</span></p>`;
    document.querySelector('.search__more') ? document.querySelector('.search__more').remove() : null;
  };

  state.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    newSearch(state.formSelection.value, state.formSearch.value);
    state.searchRecepts.insertAdjacentHTML('beforeend', '<div class="loader"></div>');
    const loader = document.querySelector('.search .loader');
    loader.style.display = 'block';
    state.searchRecepts.style.height = '32rem';

    try {
      const res = await fetch(
        `https://api.spoonacular.com/recipes/search?apiKey=${apiKey}&number=${defNum}&query=${state.formSearch.value}&type=${type}`
      );
      const data = await res.json();
      console.log(data);

      if (data.results.length > 0) {
        data.results.map((recept) => {
          state.searchRecepts.style.height = 'auto';
          state.searchRecepts.insertAdjacentHTML(
            'beforeend',
            getHtmlRecept(
              recept.sourceUrl,
              recept.image,
              getTitle(recept.title.split(' '), 5),
              getDots(recept.title.split(' '), 5),
              recept.readyInMinutes
            )
          );
        });
        const htmlMore = `<button class="search__more">Zobrazit více</button>`;
        loader.style.display = 'none';
        state.searchRecepts.insertAdjacentHTML('afterend', htmlMore);
        document.querySelector('.search__more').addEventListener('click', showMore);
      } else {
        loader.style.display = 'none';
        state.searchRecepts.insertAdjacentHTML('beforeend', '<p class="nothing">Nic jsme nenašli :(</p>');
      }
    } catch (error) {
      console.log(error);
    }
  });

  const showMore = async (e) => {
    e.preventDefault();
    clickOfMore += 1;
    const res = await fetch(
      `https://api.spoonacular.com/recipes/search?apiKey=${apiKey}&number=${defNum * clickOfMore}&query=${
        state.formSearch.value
      }&type=${type}`
    );
    const data = await res.json();

    if (data.totalResults >= clickOfMore * defNum) {
      const newArr = data.results.slice(data.results.length - 4, data.results.length);
      newArr.map((recept) => {
        state.searchRecepts.insertAdjacentHTML(
          'beforeend',
          getHtmlRecept(
            recept.sourceUrl,
            recept.image,
            getTitle(recept.title.split(' '), 5),
            getDots(recept.title.split(' '), 5),
            recept.readyInMinutes
          )
        );
      });
    } else {
      alert('To je vše co jsme našli :(');
    }

    try {
    } catch (error) {
      console.log(error);
    }
  };

  const getResult = async (type) => {
    try {
      state.featured.style.height = '30rem';
      state.featured.insertAdjacentHTML('beforeend', '<div class="loader"></div>');
      const loader = document.querySelector('.loader');
      loader.style.display = 'block';

      const res = await fetch(`https://api.spoonacular.com/recipes/search?apiKey=${apiKey}&number=6&type=${type}`);
      const data = await res.json();
      data.results.map((recept) => {
        state.featured.insertAdjacentHTML(
          'beforeend',
          getHtmlRecept(
            recept.sourceUrl,
            recept.image,
            getTitle(recept.title.split(' '), 5),
            getDots(recept.title.split(' '), 5),
            recept.readyInMinutes
          )
        );
      });
      state.featured.style.height = 'auto';
      loader.style.display = 'none';
    } catch (error) {
      console.log(error);
    }
  };

  const removeSelected = () => {
    state.navItem.map((item) => {
      item.parentElement.className = 'navigation__item';
    });
  };

  state.navItem.map((item) => {
    item.addEventListener('click', () => {
      state.featured.innerHTML = '';
      removeSelected();
      item.parentElement.className = 'navigation__item navigation__item--selected';
      getResult(item.id);
    });
  });

  getResult('salad');

  state.mobileBtn.addEventListener('click', () => {
    state.mobileMenu.style.display = 'block';
  });
  state.mobileClose.addEventListener('click', () => {
    state.mobileMenu.style.display = 'none';
  });

  state.mobileItems.map((item) => {
    item.addEventListener('click', () => (state.mobileMenu.style.display = 'none'));
  });
})();
