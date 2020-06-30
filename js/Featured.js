const state = {
  featured: document.querySelector('.featured'),
};

const apiKey = '79657becac9840e5b0e39ce3299702c2';

const getHtmlRecept = (url, image, title, dots, minutes) => {
  return `<a target="_blank" href="${url}" class="recept">
  <img class="recept__img" src="https://spoonacular.com/recipeImages/${image}" alt="" />
  <h1 class="recept__heading--primary">${title}${dots}</h1>
  <p class="recept__minutes">${minutes} minut</p>
  </a>`;
};

const getResult = async (type) => {
  try {
    const res = await fetch(
      `https://api.spoonacular.com/recipes/search?apiKey=${apiKey}&number=${defNum}&query=${state.formSearch.value}&type=${type}`
    );
    const data = await res.json();
    data.results.map((recept) => {
      getHtmlRecept(
        recept.sourceUrl,
        recept.image,
        getTitle(recept.title.split(' '), 5),
        getDots(recept.title.split(' '), 5),
        recept.readyInMinutes
      );
    });
  } catch (error) {
    console.log(error);
  }
};
