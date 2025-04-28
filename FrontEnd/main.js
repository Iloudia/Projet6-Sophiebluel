let works = [];
const buttons = document.querySelectorAll('.filter-button');
const gallery = document.querySelector('.gallery');
const editButton = document.getElementById('edit-button');
const filters = document.querySelector('.filters');

document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('token');
    if (token) {
        editButton.style.display = 'inline-flex';
        filters.style.display = 'none';
    } else {
        editButton.style.display = 'none';
        filters.style.display = 'flex';
    }
    getWorks();
});

const getWorks = async () => {
    const response = await fetch ('http://localhost:5678/api/works');
    works = await response.json();
    displayWorks();
};


const displayWorks = () => {
    gallery.innerHTML = '';
    works.forEach(work => {
        const figure = document.createElement('figure');
        figure.setAttribute('data-category', work.category.id);

        figure.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}"></img>
        <figcaption>${work.title}</figcaption>
        `;
        gallery.appendChild(figure);
    });
    setupFilters();
};


const setupFilters = () => {
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
};

const popup = document.getElementById('popup');
const closePopup = document.querySelector('.close-popup');
const popupGallery = document.getElementById('popup-gallery');
editButton.addEventListener('click', () => {
    popup.classList.remove('hidden');
    populatePopupGallery();
});

closePopup.addEventListener('click', () => {
    popup.classList.add('hidden');
});

function populatePopupGallery() {
    popupGallery.innerHTML = '';
    if (typeof works !== 'undefined') {
        works.forEach(work => {
            const img = document.createElement('img');
            img.src = work.imageUrl;
            img.alt = work.title;
            popupGallery.appendChild(img);
        });
    }
}


const addPhotoButton = document.getElementById('add-photo-button');
const popupGalleryPage = document.getElementById('popup-gallery-page');
const popupAddPhotopage = document.getElementById('popup-add-photo-page');

addPhotoButton.addEventListener('click', function() {
    popupGalleryPage.classList.add('hidden');
    popupAddPhotopage.classList.remove('hidden');
});



