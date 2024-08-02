import { api_key, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";

export function search() {
  const searchWrapper = document.querySelector("[search-wrapper]");
  const searchField = document.querySelector("[search-field]");
  const searchresult = document.createElement("div");
  searchresult.classList.add("search-modal");
  document.querySelector("main").appendChild(searchresult);

  let searTimeOut;
  searchField.addEventListener("input", function () {
    if (!searchField.value.trim()) {
      searchresult.classList.remove("active");
      searchWrapper.classList.remove("searching");
      clearTimeout(searTimeOut);
      return;
    }
    searchWrapper.classList.add("searching");
    clearTimeout(searTimeOut);
    searTimeOut = setTimeout(function () {
      fetchDataFromServer(
        `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${searchField.value}&page=1&include_adult=false`,
        function ({ results: movieList }) {
          searchWrapper.classList.remove("searching");
          searchresult.classList.add("active");
          searchresult.innerHTML = "";
          searchresult.innerHTML = `
            <p class="label">Results for</p>
            <h1 class="heading">${searchField.value}</h1>
            <div class="movie-list">
              <div class="grid-list"></div>
            </div>
          `;
          for (const movie of movieList) {
            const movieCard = createMovieCard(movie);
            searchresult.querySelector(".grid-list").appendChild(movieCard);
          }
        }
      );
    }, 500);
  });
}
