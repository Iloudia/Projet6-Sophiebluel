document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.login-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password})
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = 'index.html';
            } else {
                showError("Erreur dans l’identifiant ou le mot de passe");
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            showError("Une erreur est survenue. Veuillez réessayer.");
        }
    });

    function showError (message) {
        let errorMsg = document.querySelector('.login-error');
        if (!errorMsg) {
            errorMsg = document.createElement('p');
            errorMsg.classList.add('login-error');
            form.appendChild(errorMsg);
            
        }
        errorMsg.textContent = message;
        errorMsg.classList.add('visible');
    }
});


