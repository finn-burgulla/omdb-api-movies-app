// Wait for the DOM to be fully loaded before running the code
window.addEventListener('DOMContentLoaded', function() {
  // Get references to DOM elements
  const searchForm = document.getElementById('search-form');
  const movieResults = document.getElementById('movie-results');
  const watchlist = document.getElementById('watchlist');

  // This array will store the movies added to the watchlist
  let watchlistArray = [];

  // Load watchlist from localStorage if it exists
  const savedWatchlist = localStorage.getItem('watchlist');
  if (savedWatchlist) {
    watchlistArray = JSON.parse(savedWatchlist);
  }

  // Function to save watchlist to localStorage
  function saveWatchlist() {
    localStorage.setItem('watchlist', JSON.stringify(watchlistArray));
  }

  // Function to display a user-friendly error message
  function displayError(message) {
    movieResults.innerHTML = `<div class='error-message'>${message}</div>`;
  }

  // Function to fetch movies from OMDb API using .then() and .catch()
  function fetchMovies(searchTerm) {
    const url = `https://www.omdbapi.com/?apikey=ec015c87&s=${searchTerm}`;
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.Response === 'False') {
          throw new Error(data.Error || 'No movies found.');
        }
        return data.Search || [];
      })
      .catch(error => {
        console.error('Fetch error:', error);
        displayError('Sorry, something went wrong. Please try again.');
        return [];
      });
  }

  // Function to display movies in the results grid
  function displayMovies(movies) {
    // Clear previous results
    movieResults.innerHTML = '';
    if (movies.length === 0) return;
    // Loop through each movie and create a card
    movies.forEach(movie => {
      // Create a card for each movie
      const card = document.createElement('div');
      card.className = 'movie-card';
      // Use a default image if poster is not available
      const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150x220?text=No+Image';
      // Set the card's HTML using template literals
      card.innerHTML = `
        <div class="card-actions">
          <button class="details-btn" data-id="${movie.imdbID}">Details</button>
        </div>
        <img src="${poster}" alt="${movie.Title} poster">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
        <button class="add-watchlist" data-id="${movie.imdbID}">Add to Watchlist</button>
      `;
      // Add the card to the results grid
      movieResults.appendChild(card);
    });
  }

  // Function to display the watchlist
  function displayWatchlist() {
    // Clear previous watchlist
    watchlist.innerHTML = '';
    // If watchlist is empty, show a message
    if (watchlistArray.length === 0) {
      watchlist.textContent = 'Your watchlist is empty. Search for movies to add!';
      return;
    }
    // Loop through each movie in the watchlist
    watchlistArray.forEach(movie => {
      const card = document.createElement('div');
      card.className = 'movie-card';
      const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150x220?text=No+Image';
      card.innerHTML = `
        <div class="card-actions">
          <button class="details-btn" data-id="${movie.imdbID}">Details</button>
        </div>
        <img src="${poster}" alt="${movie.Title} poster">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
        <button class="remove-watchlist" data-id="${movie.imdbID}">Remove</button>
      `;
      watchlist.appendChild(card);
    });
  }

  // Listen for the search form submission
  searchForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the page from reloading
    // Get the search term from the input
    const searchTerm = document.getElementById('movie-search').value.trim();
    if (searchTerm) {
      // Fetch movies and display them
      fetchMovies(searchTerm).then(displayMovies);
    }
  });

  // Listen for clicks on the results grid to add movies to the watchlist
  movieResults.addEventListener('click', function(event) {
    if (event.target.classList.contains('add-watchlist')) {
      // Find the movie card that was clicked
      const card = event.target.closest('.movie-card');
      // Get movie details from the card
      const imdbID = event.target.getAttribute('data-id');
      const title = card.querySelector('h3').textContent;
      const year = card.querySelector('p').textContent;
      const poster = card.querySelector('img').getAttribute('src');
      // Check if the movie is already in the watchlist
      const exists = watchlistArray.some(movie => movie.imdbID === imdbID);
      if (!exists) {
        // Add the movie to the watchlist array
        watchlistArray.push({ imdbID, Title: title, Year: year, Poster: poster });
        // Save the updated watchlist
        saveWatchlist();
        // Update the watchlist display
        displayWatchlist();
      }
    }
  });

  // Listen for clicks on the watchlist to remove movies
  watchlist.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-watchlist')) {
      const imdbID = event.target.getAttribute('data-id');
      // Remove the movie from the watchlist array
      watchlistArray = watchlistArray.filter(movie => movie.imdbID !== imdbID);
      // Save the updated watchlist
      saveWatchlist();
      // Update the watchlist display
      displayWatchlist();
    }
  });

  // Listen for clicks on the details button to show modal
  function fetchMovieDetails(imdbID) {
    const url = `https://www.omdbapi.com/?apikey=ec015c87&i=${imdbID}`;
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .catch(error => {
        console.error('Details fetch error:', error);
        return null;
      });
  }

  function showModal(movie) {
    const modal = document.getElementById('movie-modal');
    const modalBody = document.getElementById('modal-body');
    if (!movie) {
      modalBody.innerHTML = '<p>Sorry, details not available.</p>';
    } else {
      modalBody.innerHTML = `
        <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150x220?text=No+Image'}" alt="${movie.Title} poster">
        <h2>${movie.Title}</h2>
        <p><strong>Year:</strong> ${movie.Year}</p>
        <p><strong>Rated:</strong> ${movie.Rated}</p>
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>Director:</strong> ${movie.Director}</p>
        <p><strong>Cast:</strong> ${movie.Actors}</p>
        <p><strong>Plot:</strong> ${movie.Plot}</p>
      `;
    }
    modal.style.display = 'flex';
  }

  // Close modal when clicking X
  document.getElementById('close-modal').onclick = function() {
    document.getElementById('movie-modal').style.display = 'none';
  };

  // Close modal when clicking outside modal content
  document.getElementById('movie-modal').onclick = function(event) {
    if (event.target === this) {
      this.style.display = 'none';
    }
  };

  // Listen for details button clicks in both grids
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('details-btn')) {
      const imdbID = event.target.getAttribute('data-id');
      fetchMovieDetails(imdbID).then(showModal);
    }
  });

  // Display the watchlist on page load
  displayWatchlist();
});
