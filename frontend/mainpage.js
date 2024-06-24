async function searchMovies() {
    const query = document.getElementById('search-bar').value;
    if (query.length < 3) {
        document.getElementById('search-results').style.display = 'none';
        return;
    }

    const response = await fetch(`http://localhost:5000/search_movies?query=${query}`);
    const movies = await response.json();
    console.log(movies);

    const searchResultsCard = document.getElementById('search-results-card');
    searchResultsCard.innerHTML = '';

    if (movies.length === 0) {
        searchResultsCard.innerHTML = '<p>No movies found</p>';
    } else {
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            movieCard.innerHTML = `
                <img src="${movie.poster_url}" alt="${movie.title}">
                <div class="movie-details">
                        <h2>${movie.title}</h2>
                        <p>Director: ${movie.director}</p>
                        <p>Genre: ${movie.genre}</p>
                        <p>Language: ${movie.language}</p>
                        <button onclick="redirectToBooking('${movie.title}')">Book Now</button>
                    </div>
            `;
            searchResultsCard.appendChild(movieCard);
        });
    }

    document.getElementById('search-results').style.display = 'block';
}

function redirectToBooking(movieTitle) {
    localStorage.setItem('selectedMovie', movieTitle);
    window.location.href = 'booking.html';
}