const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c';

const API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&with_original_language=hi&region=IN`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`; // language=hi-IN removed for better results

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const showFavBtn = document.getElementById('show-favorites');
const themeBtn = document.getElementById('theme-toggle');

// 🔃 Load saved theme on load
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
  }

  getMovies(API_URL); // load movies after theme
});

// 🎨 Theme Toggle Button
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

// 🔍 Search form
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchTerm = search.value.trim();
  if (searchTerm) {
    getMovies(SEARCH_API + searchTerm);
    search.value = '';
  } else {
    window.location.reload();
  }
});

// 📥 Fetch Movies
async function getMovies(url) {
  const res = await fetch(url);
  const data = await res.json();
  showMovies(data.results);
}

// 🧾 Show Movies
function showMovies(movies) {
  main.innerHTML = '';

  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview } = movie;

    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');

    movieEl.innerHTML = `
      <img src="${poster_path ? IMG_PATH + poster_path : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${title}">
      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getClassByRate(vote_average)}">${vote_average || 'N/A'}</span>
      </div>
      <div class="overview">
        <h3>Overview</h3>
        ${overview || 'No description available.'}
        <button class="fav-btn">❤️ Add to Favorites</button>
      </div>
    `;

    movieEl.querySelector('.fav-btn').addEventListener('click', () => {
      addToFavorites(title);
    });

    main.appendChild(movieEl);
  });
}

// 🎨 Vote rating color
function getClassByRate(vote) {
  if (vote >= 8) return 'green';
  if (vote >= 5) return 'orange';
  return 'red';
}

// ❤️ Add to local favorites
function addToFavorites(movieTitle) {
  let favs = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favs.includes(movieTitle)) {
    favs.push(movieTitle);
    localStorage.setItem('favorites', JSON.stringify(favs));
    alert(`${movieTitle} added to Favorites!`);
  } else {
    alert(`${movieTitle} is already in Favorites!`);
  }
}

// 🗂 Show Favorites
if (showFavBtn) {
  showFavBtn.addEventListener('click', () => {
    const favs = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favs.length === 0) {
      main.innerHTML = `<h2 style="text-align:center;">No favorite movies added!</h2>`;
      return;
    }

    fetchFavorites(favs);
  });
}

// 🔁 Load favorite movies
async function fetchFavorites(favTitles) {
  main.innerHTML = '';

  for (const title of favTitles) {
    const res = await fetch(SEARCH_API + title);
    const data = await res.json();
    const movie = data.results.find(m => m.title === title);

    if (movie) {
      const { title, poster_path, vote_average, overview } = movie;

      const movieEl = document.createElement('div');
      movieEl.classList.add('movie');

      movieEl.innerHTML = `
        <img src="${poster_path ? IMG_PATH + poster_path : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${title}">
        <div class="movie-info">
          <h3>${title}</h3>
          <span class="${getClassByRate(vote_average)}">${vote_average || 'N/A'}</span>
        </div>
        <div class="overview">
          <h3>Overview</h3>
          ${overview || 'No description available.'}
          <button class="fav-btn">❤️ Already Favorite</button>
        </div>
      `;

      main.appendChild(movieEl);
    }
  }
}
