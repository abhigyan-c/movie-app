document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const firstName = document.getElementById('signup-first-name').value;
    const lastName = document.getElementById('signup-last-name').value;
    const dob = document.getElementById('signup-dob').value;
    const phoneNumber = document.getElementById('signup-phone-number').value;
    const label = document.getElementById('signup-label').value;

    const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            email,
            password,
            first_name: firstName,
            last_name: lastName,
            dob,
            phone_number: phoneNumber,
            label,
        }),
    });

    const result = await response.json();

    if (response.ok) {
        localStorage.setItem('username', username);
        document.getElementById('signup-form').reset();
        window.location.href = 'show.html';
    } else {
        alert(result.message);
    }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    const result = await response.json();

    if (response.ok) {
        localStorage.setItem('username', email);
        document.getElementById('login-form').reset();
        window.location.href = 'show.html';
    } else {
        alert(result.message);
    }
});
