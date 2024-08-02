const addEventOnElements = function (elements, eventType, callback) {
  for (const elem of elements) {
    elem.addEventListener(eventType, callback);
  }
};

const searchBox = document.querySelector("[search-box]");
const searchTog = document.querySelectorAll("[search-toggler]");
addEventOnElements(searchTog, "click", function () {
  searchBox.classList.toggle("active");
});

const getMovieDetails = function (movieId) {
  window.localStorage.setItem("movieId", String(movieId));
};

const getMovieList = function (urlParams, genreName) {
  window.localStorage.setItem("urlParams", urlParams);
  window.localStorage.setItem("genreName", genreName);
};
