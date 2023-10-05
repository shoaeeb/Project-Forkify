import * as model from './model.js';
import recipeView from './views/recipeView.js';
// import icons from '../img/icons.svg'; //parcel v1
import 'core-js/stable'; //to polyfill all the es6 features
import 'regenerator-runtime/runtime'; //to polyfill async functions
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView';
import addRecipeView from './views/addRecipeView.js';

import { MODAl_CLOSE_SEC } from './config.js';
// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);
    if (!id) return;
    recipeView.renderSpinner();
    //0)Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    //1) Loading Recipe
    await model.loadRecipe(id);
    //rendering recipe
    recipeView.render(model.state.recipe);
    bookmarkView.update(model.state.bookmarks);
    console.log(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
    console.log(error);
  }
};
const controlSearchResults = async function () {
  try {
    //get search query
    const query = searchView.getQuery();
    if (!query) return;
    //render spinner
    resultsView.renderSpinner();
    // load search results
    await model.loadSearchResults(query);

    //render search result
    // console.log(model.getSearchResultsPage(1));
    resultsView.render(model.getSearchResultsPage());

    //render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};
const controlPagination = function (goToPage) {
  console.log('page controller');
  console.log(goToPage);
  //render new result
  resultsView.render(model.getSearchResultsPage(goToPage));

  //render new pagination buttons
  paginationView.render(model.state.search);
};

controlSearchResults();

//update the servings
const controlServings = function (newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings);
  //update the recipe view
  //recipeView.render(model.state.recipe);
  //only the servings and ingredients part
  recipeView.update(model.state.recipe);
};

const controlAddBookMark = function () {
  //add/remove bookmark
  if (!model.state.recipe.bookmark) model.addBookMark(model.state.recipe);
  else model.deleteBookMarkup(model.state.recipe.id);
  //2 update recipe view
  recipeView.update(model.state.recipe);
  //3 render the bookmark
  bookmarkView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  //console.log(newRecipe);
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    ///render recipe
    recipeView.render(model.state.recipe);
    //success the message

    addRecipeView.renderMessage();
    //render the bookmark view
    bookmarkView.render(model.state.bookmarks);
    //update the id in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //close the form
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAl_CLOSE_SEC * 1000);
  } catch (error) {
    console.log('💥💥💥', error);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookMarkup(controlAddBookMark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHanlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);

  // model.state.bookmarks =
  //   JSON.parse(localStorage.getItem('bookmarks')) || [];
  // console.log(model.state.bookmarks);
};
init();
console.log('Running ');
