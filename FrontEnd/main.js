let works = [];
const buttons = document.querySelectorAll('.filter-button');
const gallery = document.querySelector('.gallery');
const editButton = document.getElementById('edit-button');
const filters = document.querySelector('.filters');
const token = sessionStorage.getItem('token');
let categories = [];

// Récupération des catégories depuis l'API 
const getCategories = async () => {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        categories = await response.json();
        generateFiltersButtons();

        const photoCategoryInput = document.getElementById('photo-category');
        if (photoCategoryInput) {
            categoryDropdown(categories);
        }
        
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
    }
};

// Génération des boutons filtres 

const generateFiltersButtons = () => {
    filters.innerHTML = '';

    const allCategory = { id: 0, name: "Tous" };
    categories.unshift(allCategory); 

    categories.forEach(category => {
        const button = document.createElement('button');
        button.classList.add('filter-button');
        button.setAttribute('data-category', category.id);
        button.textContent = category.name;

        
        if (category.id === 0) {
            button.classList.add('active');
        }

        filters.appendChild(button);
    });

    setupFilters();
};

// Affichage des travaux dans la galerie 

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

// Gestion des filtres 

const setupFilters = () => {
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
};

// Récuperation des travaux depuis l'API 

const getWorks = async () => {
    try {
        const response = await fetch ('http://localhost:5678/api/works');
        works = await response.json();
        displayWorks();
        setupFilters();
    } catch (error) {
        console.error('Erreur', error);
    }
};

// Création des otpions du menu déroulant pour les catégories

const categoryDropdown = (categories)  =>  {
    const photoCategoryInput = document.getElementById('photo-category');
    photoCategoryInput.innerHTML = `<option value="" selected hidden> </option>`;

    categories.forEach(category => {
        if (category.id !== 0) {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            photoCategoryInput.appendChild(option);
        }
    });
};

// Gestion du login/logout

document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.getElementById('login-link');

    if (token) {
        editButton.style.display = 'inline-flex';
        filters.style.display = 'none';
        loginLink.textContent = 'logout';
    } else {
        editButton.style.display = 'none';
        filters.style.display = 'flex';
        loginLink.textContent = 'login';
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
    generateFiltersButtons();
    getWorks();
    getCategories();
});

// gestion du popup
const popup = document.getElementById('popup');
const closePopup = document.querySelector('.close-popup');
popup.addEventListener('click', (e) => {
    if (e.target === popup) {
        popup.classList.add('hidden');
    }
});
const popupGallery = document.getElementById('popup-gallery');
editButton.addEventListener('click', () => {
    popup.classList.remove('hidden');
    populatePopupGallery();
});

closePopup.addEventListener('click', () => {
    popup.classList.add('hidden');
});

// remplissage de la galerie dans le popup
function populatePopupGallery() {
    popupGallery.innerHTML = '';

    works.forEach((work) => {
        const item = document.createElement('div');
        const img = document.createElement('img');
        img.src  = work.imageUrl;
        img.alt  = work.title;
        item.classList.add('popup-item');
        item.appendChild(img);

        const suppBtn = document.createElement('span');
        suppBtn.className = 'supp-btn';
        suppBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        suppBtn.addEventListener('click', async () => {
            const confirmation = confirm("Etes-vous sûr de vouloir supprimer cette photo ?");
            if (!confirmation) return;

            try {
                const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
                    method:  'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    await getWorks();
                    populatePopupGallery();
                } else {
                    alert("Erreur lors de la suppression de la photo");
                }

            } catch (error) {
                console.error("Erreur : ", error);
                alerte("Une erreur s'est produite");
            }
           
        });
        item.appendChild(suppBtn);

        popupGallery.appendChild(item);
    });
}

// Gestion de l'ajout de photo dans le popup

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
    returnArrow.style.display = 'none';
});

const photoUploadInput = document.getElementById('photo-upload');
const photoPreview = document.getElementById('photo-preview');
const addPhotoForm = document.getElementById('add-photo-form');
const photoTitleInput = document.getElementById('photo-title');
const photoCategoryInput = document.getElementById('photo-category');
const submitButton = document.getElementById('submit-button');
const uploadLabel = document.querySelector('.upload-label');

// Gestion de la prévisualisation de l'image
photoUploadInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    console.log('File selected:', file);

    if (file) {
        if (!file.type.startsWith('image/')) {
            alert('Veuillez sélectionner une image valide (jpg, png).');
            photoUploadInput.value = '';
            return;
        }

        if (file.size > 4 * 1024 * 1024) {
            alert('L’image est trop lourde (4 Mo max).');
            photoUploadInput.value = '';
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        console.log('Preview URL:', previewUrl);
        photoPreview.src = previewUrl;
        photoPreview.classList.add('visible');
        photoPreview.classList.remove('hidden');
        uploadLabel.style.display = 'none';
    } else {
        console.log('No file selected');
        photoPreview.src = '';
        photoPreview.classList.add('hidden');
        photoPreview.classList.remove('visible');
        uploadLabel.style.display = 'flex';
    }
    checkform();
});

photoPreview.addEventListener('click', function() {
        photoUploadInput.value = '';
        photoUploadInput.click();
});

function checkform() {
    const title = photoTitleInput.value.trim();
    const category = photoCategoryInput.value;
    const file = photoUploadInput.files[0];

    if (title && category && file) {
        submitButton.classList.add('active');
        submitButton.disabled = false;
    } else {
        submitButton.classList.remove('active');
        submitButton.disabled = true;
    }
}

[photoTitleInput, photoCategoryInput, photoUploadInput].forEach(input => {
    input.addEventListener('input', checkform);
});

// Soumission du formulaire d'ajout de photo
addPhotoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = photoUploadInput.files[0];
    const title = photoTitleInput.value.trim();
    const category = photoCategoryInput.value;


    if (!title || !category || !file) {
        alert('Tous les champs sont nécessaires');
        return;
    }
    if (file.size > 4 * 1024 * 1024) {
        alert('Image trop lourde (4 Mo max)');
        return;
    }

   
    const formData = new FormData();
    formData.append('image',    file);
    formData.append('title',    title);
    formData.append('category', Number(category));
    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method:  'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body:    formData
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
            throw new Error(`${response.status} – ${err.message || response.statusText}`);
        }

        returnArrow.style.display = 'none';
        photoPreview.classList.remove('visible');
        photoPreview.classList.add('hidden');
        await getWorks();
        populatePopupGallery();

        popupAddPhotoPage.classList.add('hidden');
        popupGalleryPage.classList.remove('hidden');
        addPhotoForm.reset();
        photoPreview.src = '';
        document.querySelector('.upload-label').style.display = 'flex';


    } catch (err) {
        console.error(err);
        alert("Erreur dans l'ajout de la photo");
    }
});
