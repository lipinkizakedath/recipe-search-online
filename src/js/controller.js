import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

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
    bookmarksView.update(model.state.bookmarks);

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

const controlAddBookMark = function () {
  // Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // upload recipe
    await model.uploadRecipe(newRecipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change id in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close the modal
    addRecipeView.toggleWindow();
  } catch (error) {
    console.log(error);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipies);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookMark(controlAddBookMark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};

init();
