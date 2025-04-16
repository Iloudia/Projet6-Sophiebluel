document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.filter-button');
    const figures = document.querySelectorAll('.gallery figure');

    buttons.forEach(button => {
        button.addEventListener('click', () => {

            const category = button.getAttribute('data-category');
            figures.forEach(fig => {
            const figCat = fig.getAttribute('data-category');
            if (category === '0' || figCat === category) {
                fig.style.display = '';
            } else {
                fig.style.display = 'none';
            }
        });
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});
});