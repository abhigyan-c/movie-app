document.addEventListener('DOMContentLoaded', function() {
    const bookingTitle = document.getElementById('booking-title');
    const selectedMovie = localStorage.getItem('selectedMovie');
    const userId = localStorage.getItem('user_id');

    if (!selectedMovie || !userId) {
        alert('User or movie information is missing.');
        return;
    }

    bookingTitle.textContent = `Booking for ${selectedMovie}`;

    // Fetch food options
    fetch('http://localhost:5000/get_food_options')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const foodSelect = document.getElementById('food');
            foodSelect.innerHTML = ''; // Clear existing options
            data.forEach(food => {
                const option = document.createElement('option');
                option.value = food.food_id;
                option.textContent = `${food.name}`;
                foodSelect.appendChild(option);
            });
            if (data.length === 0) {
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'No food options available';
                foodSelect.appendChild(option);
            }
        })
        .catch(error => {
            console.error('Error fetching food options:', error);
            alert('Error fetching food options. Please try again.');
        });

    // Fetch user label to determine seat level
    fetch(`http://localhost:5000/get_user_label?user_id=${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const userLabel = data.label;
            localStorage.setItem('user_label', userLabel);
        })
        .catch(error => {
            console.error('Error fetching user label:', error);
            alert('Error fetching user label. Please try again.');
        });
});

function bookMovie() {
    const userId = localStorage.getItem('user_id');
    const movieTitle = localStorage.getItem('selectedMovie');
    const foodId = document.getElementById('food').value;
    const showTime = document.getElementById('show-time').value;
    const seats = document.getElementById('seats').value;
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    const userLabel = localStorage.getItem('user_label');

    if (!showTime || !seats || !paymentMethod) {
        alert('Please fill all required fields.');
        return;
    }

    // Fetch seat and food prices
    fetch(`http://localhost:5000/get_prices?seat_level=${userLabel}&food_id=${foodId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(prices => {
            const totalPrice = (prices.seat_price * seats) + prices.food_price;

            // Fetch movie_id using movie title
            fetch(`http://localhost:5000/get_movie_id?title=${movieTitle}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    const movieId = data.movie_id;

                    // Make API call to book movie
                    fetch('http://localhost:5000/book_movie', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            user_id: userId,
                            movie_id: movieId,
                            show_time: showTime,
                            seats: seats,
                            total_price: totalPrice,
                            payment_method: paymentMethod,
                            label: userLabel
                        })
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Booking success:', data);
                        alert('Booking successful!');

                        // Get booking_id from response and book food
                        const bookingId = data.booking_id;
                        bookFood(bookingId, foodId, prices.food_price);
                    })
                    .catch(error => {
                        console.error('Error booking movie:', error);
                        alert('Error booking movie. Please try again.');
                    });
                })
                .catch(error => {
                    console.error('Error fetching movie ID:', error);
                    alert('Error fetching movie ID. Please try again.');
                });
        })
        .catch(error => {
            console.error('Error fetching prices:', error);
            alert('Error fetching prices. Please try again.');
        });
}

function bookFood(bookingId, foodId, foodPrice) {
    fetch('http://localhost:5000/book_food', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            booking_id: bookingId,
            food_id: foodId,
            total_price: foodPrice
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Food booking success:', data);
        alert('Food booking successful!');
    })
    .catch(error => {
        console.error('Error booking food:', error);
        alert('Error booking food. Please try again.');
    });
}
