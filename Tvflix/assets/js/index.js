import { sidebar } from "./sidebar.js";
import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const pageContent = document.querySelector("[page-Content]");

sidebar();

const HomePageSection = [
  {
    title: "Upcoming Movie",
    path: "/movie/upcoming",
  },
  {
    title: "Weekly's Trending Movies",
    path: "/trending/movie/week",
  },
  {
    title: "Top Rated Movies",
    path: "/movie/top_rated",
  },
];

const genreList = {
  asString(genreIdList) {
    let newGenreList = [];
    for (const genreId of genreIdList) {
      this[genreId] && newGenreList.push(this[genreId]);
    }
    return newGenreList.join(", ");
  },
};
fetchDataFromServer(
  `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`,
  function ({ genres }) {
    for (const { id, name } of genres) {
      genreList[id] = name;
    }

    fetchDataFromServer(
      `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`,
      heroBanner
    );
  }
);

const heroBanner = function ({ results: movieList }) {
  const banner = document.createElement("section");
  banner.classList.add("banner");
  banner.ariaLabel = "Popular Movies";
  banner.innerHTML = `
    <div class="banner-sidebar"></div>

    <div class="slider-control">
      <div class="control-inner">
      </div>
    </div>
  `;

  let controlItemIndex = 0;
  for (const [index, movie] of movieList.entries()) {
    const {
      backdrop_path,
      title,
      release_date,
      genre_ids,
      overview,
      poster_path,
      vote_average,
      id,
    } = movie;
    const sliderItems = document.createElement("div");
    sliderItems.classList.add("slider-item");
    sliderItems.setAttribute("slider-item", "");
    sliderItems.innerHTML = `
      <img
        src="${imageBaseURL}w1280${backdrop_path}"
        alt="${title}"
        class="img-cover"
        loading=${index === 0 ? "eager" : "lazy"}
      />
      <div class="banner-content">
        <h2 class="heading">${title}</h2>
        <div class="meta-list">
          <div class="meta-item">${release_date.split("-")[0]}</div>
          <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
        </div>
        <p class="genre">${genreList.asString(genre_ids)}</p>
        <p class="banner-text">
          ${overview}
        </p>
        <a href="./detail.html" class="btn"  onclick="getMovieDetails(${id})">
          <img
            src="./assets/images/play_circle.png"
            width="24"
            height="24"
            aria-hidden="true"
            alt="play circle"
          />
          <span class="span">Watch Now</span>
        </a>
      </div>
    `;
    banner.querySelector(".banner-sidebar").appendChild(sliderItems);

    const controlItem = document.createElement("button");
    controlItem.classList.add("poster-box", "slider-item");
    controlItem.setAttribute("slider-control", `${controlItemIndex}`);

    controlItemIndex++;

    controlItem.innerHTML = `
      <img
        src="${imageBaseURL}w154${poster_path}"
        alt="Slide to ${title}"
        loading="lazy"
        draggable="false"
        class="img-cover"
      />
    `;
    banner.querySelector(".control-inner").appendChild(controlItem);
  }

  pageContent.appendChild(banner);
  addHeroSlide();
  for (const { title, path } of HomePageSection) {
    fetchDataFromServer(
      `https://api.themoviedb.org/3${path}?api_key=${api_key}&page=1`,
      createMovieList,
      title
    );
  }
};

const addHeroSlide = function () {
  const sliderItems = document.querySelectorAll("[slider-item]");
  const slideControl = document.querySelectorAll("[slider-control]");
  let lastSiderItem = sliderItems[0];
  let lastSiderControl = slideControl[0];

  lastSiderItem.classList.add("active");
  lastSiderControl.classList.add("active");

  const sliderStart = function () {
    lastSiderItem.classList.remove("active");
    lastSiderControl.classList.remove("active");
    sliderItems[Number(this.getAttribute("slider-control"))].classList.add(
      "active"
    );
    this.classList.add("active");

    lastSiderItem = sliderItems[Number(this.getAttribute("slider-control"))];
    lastSiderControl = this;
  };

  addEventOnElements(slideControl, "click", sliderStart);
};

const createMovieList = function ({ results: movieList }, title) {
  const movieListEle = document.createElement("section");
  movieListEle.classList.add("movie-list");
  movieListEle.ariaLabel = `${title}`;

  movieListEle.innerHTML = `
    <div class="title-wrapper">
      <h3 class="title-large">${title}</h3>
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
