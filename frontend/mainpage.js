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
                <h3>${movie.title}</h3>
                <p>Genre: ${movie.genre}</p>
                <p>Director: ${movie.director}</p>
                <p>Release Date: ${movie.release_date}</p>
            `;
            searchResultsCard.appendChild(movieCard);
        });
    }

    document.getElementById('search-results').style.display = 'block';
}
