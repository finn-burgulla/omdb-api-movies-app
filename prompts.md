## Design Prompt
Build a dark-themed, responsive movie search page with a header (including an icon and title), a centered search bar, and two sections for results and a watchlist. Use a grid of cards for displaying movie information (poster, title, and year) with buttons to add/remove movies. Add subtle hover effects and a simple footer.

## Prompt 1
WORK THROUGH THESE COMMANDS IN ORDER, STARTING THE LATTER ONLY AFTER FINISHING THE EARLIER.

1) Fetch movies from the OMDb API when the user searches, and display each movie's poster, title, and release year inside the movie results grid.

API KEY: ec015c87

2) Modify the JavaScript so that clicking an 'Add to Watchlist' button adds the movie to the watchlist section. The watchlist should not contain duplicates.


## Prompt 3
1) I want all the movies in my watchlist to stay there even after refreshing the page.

If the watchlist is empty, display the text "Your watchlist is empty. Search for movies to add!".


2) Provide a way to delete movies from the watch list.

Modify the fetch requests to check the response status and catch any errors. Log the details and display a user-friendly error message if something goes wrong.

Rewrite this fetch request using .then() and .catch() instead of async/await.

Add a 'Details' button on the left side of a movie card in the Search Results and Watchlist.

 Style it to look different from the 'Add to Watchlist' button. Clicking the button should open a modal window displaying the full movie details: poster, title, year, rating, genre, director, cast, and plot.



