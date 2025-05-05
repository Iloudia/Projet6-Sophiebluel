document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.login-form');
    const errorMsg = document.querySelector('.login-error');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            showError("Veuillez remplir tous les champs.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                sessionStorage.setItem('token', data.token);
                window.location.href = 'index.html';
            } else {
                showError("Erreur dans l’identifiant ou le mot de passe");
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            showError("Une erreur est survenue. Veuillez réessayer.");
        }
    });

    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
    }
});