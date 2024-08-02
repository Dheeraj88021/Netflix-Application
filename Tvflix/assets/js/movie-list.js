import { api_key, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";
import { sidebar } from "./sidebar.js";

const genreName = window.localStorage.getItem("genreName");
const urlParams = window.localStorage.getItem("urlParams");
const pageContent = document.querySelector("[page-Content]");

sidebar();

let currentPage = 1;
let total_pages = 0;

fetchDataFromServer(
  `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&page=${currentPage}&${urlParams}`,
  function ({ results: movieList, total_pages }) {
    total_pages = total_pages;
    document.title = `${genreName} Movies - Tvflix`;
    const movieListEle = document.createElement("section");
    movieListEle.classList.add("movie-list", "genre-list");
    movieListEle.ariaLabel = `${genreName} Movies`;
    movieListEle.innerHTML = `
      <div class="title-wrapper">
        <h1 class="heading">All ${genreName} Movies</h1>
      </div>
      <div class="grid-list"></div>
      <button class="btn load-more" load-more>Load More</button>
    `;

    for (const movie of movieList) {
      const movieCard = createMovieCard(movie);
      movieListEle.querySelector(".grid-list").appendChild(movieCard);
    }
    pageContent.appendChild(movieListEle);

    document
      .querySelector("[load-more]")
      .addEventListener("click", function () {
        if (currentPage >= total_pages) {
          this.style.display = "none";
          return;
        }
        currentPage++;
        this.classList.add("loading");
        fetchDataFromServer(
          `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&page=${currentPage}&${urlParams}`,
          ({ results: movieList }) => {
            this.classList.remove("loading");
            for (const movie of movieList) {
              const movieCard = createMovieCard(movie);
              movieListEle.querySelector(".grid-list").appendChild(movieCard);
            }
          }
        );
      });
  }
);

search();
