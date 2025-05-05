let works = [];
const buttons = document.querySelectorAll('.filter-button');
const gallery = document.querySelector('.gallery');
const editButton = document.getElementById('edit-button');
const filters = document.querySelector('.filters');
const token = sessionStorage.getItem('token');

document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.getElementById('login-link');

    if (token) {
        editButton.style.display = 'inline-flex';
        filters.style.display = 'none';
        loginLink.textContent = 'Logout';
    } else {
        editButton.style.display = 'none';
        filters.style.display = 'flex';
        loginLink.textContent = 'Login';
    }
    
    loginLink.addEventListener('click', (event) => {
        event.preventDefault();

        if (!token) {
            window.location.href = 'login.html';
        } else {
            sessionStorage.removeItem('token');
            window.location.href = 'index.html';
        }
    });
    getWorks();
});

const getWorks = async () => {
    const response = await fetch ('http://localhost:5678/api/works');
    works = await response.json();
    displayWorks();
    populatePopupGallery();
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
    
        works.forEach((work) => {
            const img = document.createElement('img');
            img.src = work.imageUrl;
            img.alt = work.title;
            popupGallery.appendChild(img);

            const suppBtn = document.createElement('span');
            suppBtn.className = 'supp-btn';
            suppBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
            suppBtn.addEventListener('click', async () => {

                const response = await fetch (`http://localhost:5678/api/works/${work.id}`, {
                    method: 'Delete',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    getWorks();
                    populatePopupGallery();
                }
            });

            popupGallery.appendChild(suppBtn);
        });
    }


const addPhotoButton = document.getElementById('add-photo-button');
const popupGalleryPage = document.getElementById('popup-gallery-page');
const popupAddPhotoPage = document.getElementById('popup-add-photo-page');
const returnArrow = document.getElementById('arrow-return');

addPhotoButton.addEventListener('click', function() {
    popupAddPhotoPage.classList.remove('hidden');
    popupGalleryPage.classList.add('hidden');
    returnArrow.style.display = 'inline';
});

returnArrow.addEventListener('click', function(){
    popupGalleryPage.classList.remove('hidden');
    popupAddPhotoPage.classList.add('hidden');
});