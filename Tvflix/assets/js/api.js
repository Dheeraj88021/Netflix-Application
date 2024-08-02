const api_key = "1f4882b6663f9d086f9d579abded4a98";
const imageBaseURL = "http://image.tmdb.org/t/p/";

const fetchDataFromServer = function (url, callback, optionalParams) {
  fetch(url)
    .then((respose) => respose.json())
    .then((data) => callback(data, optionalParams));
};

export { imageBaseURL, api_key, fetchDataFromServer };
