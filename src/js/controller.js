import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import icons from 'url:../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (model.hot) {
  model.hot.accept();
}

const controlRecipies = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    // load spinner
    recipeView.renderSpinner();

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // load recipe
    await model.loadRecipe(id);

    // Rendering markups
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError(error.message);
  }
};

const controlSearchResults = async function () {
  try {
    // Render spinner
    resultsView.renderSpinner();

    // GET search query
    const query = searchView.getQuery();

    // Prevent api calls if query is empty
    if (!query) return;

    // Render the resuls
    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultsPage(2));

    // initiate pagination
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error.message);
  }
};

const controlPagination = function (page) {
  // render paginated results
  resultsView.render(model.getSearchResultsPage(page));

  // render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update the recipe servings
  model.updateServings(newServings);

  // update the view
  recipeView.update(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipies);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
