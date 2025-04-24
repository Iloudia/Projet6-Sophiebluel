const buttons = document.querySelectorAll('.filter-button');
const gallery = document.querySelectorAll('.gallery');

document.addEventListener('DOMContentLoaded', () => {
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


const getWorks = async () => {
    const reponse = await fetch ('http://localhost:5678/api/works');
    works = await reponse.json();
    displayWorks();
}

const displayWorks = () => {
    works.forEach(work => {
        const figure = document.createElement('figure');
        figure.setAttribute('data-category', work.category.id);

        figure.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}">
        <figcaption>${work.title}</figcaption>
        `;

        gallery.appendChild(figure);
    })
}

getWorks();

document.addEventListener('DOMContentLoaded', () => {
    const editButtons = document.getElementById('.edit-button');
    const filters = document.getElementById('filters');
    const token = localStorage.getItem('token');

    if (!token) {
        if (editButton) editButton.style.display = 'none';
    } else {
        if (filters) filters.style.display = 'none';
    }
});


