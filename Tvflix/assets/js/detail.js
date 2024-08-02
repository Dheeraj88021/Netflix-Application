import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const movieId = window.localStorage.getItem("movieId");
const pageContent = document.querySelector("[page-Content]");

sidebar();

const getGenres = function (genreList) {
  const newGenreList = [];
  for (const { name } of genreList) {
    newGenreList.push(name);
  }
  return newGenreList.join(", ");
};

const getCaste = function (castList) {
  const newCasteList = [];
  for (let i = 0, len = castList.length; i < len && i < 10; i++) {
    const { name } = castList[i];
    newCasteList.push(name);
  }
  return newCasteList.join(", ");
};

const getDirecter = function (crewList) {
  const directed = crewList.filter(({ job }) => job === "Director");
  const directerList = [];
  for (const { name } of directed) {
    directerList.push(name);
  }
  return directerList.join(", ");
};

const filterVideos = function (videoList) {
  return videoList.filter(
    ({ type, site }) =>
      (type === "Trailer" || type === "Teaser") && site === "YouTube"
  );
};

fetchDataFromServer(
  `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases`,
  function (movie) {
    const {
      backdrop_path,
      poster_path,
      title,
      release_date,
      runtime,
      vote_average,
      releases: {
        countries: [{ certification }],
      },
      genres,
      overview,
      casts: { cast, crew },
      videos: { results: videos },
    } = movie;

    document.title = `${title} - Tvflix`;
    const movieDetails = document.createElement("div");
    movieDetails.classList.add("movie-details");
    movieDetails.innerHTML = `
      <div class="backdrop-image"
        style="background-image: url('${imageBaseURL}${"w1280" || "original"} ${
      backdrop_path || poster_path
    }');"
      >
      </div>
      <figure class="poster-box movie-poster">
        <img
          src="${imageBaseURL}w342${poster_path}"
          alt="${title}"
          class="img-cover"
        />
      </figure>

      <div class="details-box">
        <div class="detail-content">
          <h1 class="heading">${title}</h1>
          <div class="meta-list">
            <div class="meta-item">
              <img
                src="./assets/images/star.png"
                alt="rating"
                width="20"
                height="20"
              />
              <span class="span">${vote_average.toFixed(1)}</span>
            </div>
            <div class="separter"></div>
            <div class="meta-item">${runtime}m</div>
            <div class="separter"></div>
            <div class="meta-item">${release_date.split("-")[0]}</div>

            <div class="meta-item card-badge">${certification}</div>
          </div>
          <p class="genre">${getGenres(genres)}</p>
          <p class="overview">
            ${overview}
          </p>
          <ul class="detail-list">
            <div class="list-item">
              <p class="list-name">Starring</p>
              <p>
                ${getCaste(cast)}
              </p>
            </div>

            <div class="list-item">
              <p class="list-name">Directed By</p>
              <p>${getDirecter(crew)}</p>
            </div>
          </ul>
        </div>

        <div class="title-wrapper">
          <h3 class="title-large">Trailers and Clips</h3>
          <div class="slider-list">
            <div class="slider-inner"></div>
          </div>
        </div>
      </div>
    `;

    for (const { key, name } of filterVideos(videos)) {
      const videoCard = document.createElement("div");
      videoCard.classList.add("video-card");
      videoCard.innerHTML = `
        <iframe
          width="500"
          height="294"
          src="https://www.youtube.com/embed/${key}?&theme=dark&color=white&rel=0"
          frameborder="0"
          allowfullscreen="1"
          title="${name}"
          class="img-cover"
          loading="lazy"
        ></iframe>
      `;
      movieDetails.querySelector(".slider-inner").appendChild(videoCard);
    }
    pageContent.appendChild(movieDetails);

    fetchDataFromServer(
      `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}&page=1`,
      addSuggestMovie
    );
  }
);

const addSuggestMovie = function ({ results: movieList }, title) {
  const movieListEle = document.createElement("section");
  movieListEle.classList.add("movie-list");
  movieListEle.ariaLabel = "You May Also Like";

  movieListEle.innerHTML = `
    <div class="title-wrapper">
      <h3 class="title-large">You May Also Like</h3>
    </div>
    <div class="slider-list">
      <div class="slider-inner"></div>
    </div>
  `;

  for (const movie of movieList) {
    const movieCard = createMovieCard(movie);
    movieListEle.querySelector(".slider-inner").appendChild(movieCard);
  }
  pageContent.appendChild(movieListEle);
};

search();
