const API = 'https://api-rest-bsale.herokuapp.com/api/products/';
let products = [];
let categories = [];
let totalPages = 0;
let currentPage = 1;
const fetchDataInit = async () => {
    try {
        const response = await fetch(API);
        const data = await response.json();
        products = data.data;
        categories = data.categories;
        totalPages = data.last_page;
    } catch (error) {
        throw new SyntaxError(error);
    }
};
const fetchDataSearch = async (search) => { 
    try {
        const response = await fetch(`${API}?search=${search}`);
        const data = await response.json();
        products = data.data;
        totalPages = data.last_page;
    } catch (error) {
        throw new SyntaxError(error);
    }
};
const fetchDataPage = async (page) => { 
    try {
        const response = await fetch(`${API}?page=${page}`);
        const data = await response.json();
        products = data.data;
        totalPages = data.last_page;
    } catch (error) {
        throw new SyntaxError(error);
    }
}
const fetchDataCategory = async (category) => {
    try {
        const response = await fetch(`${API}?cateogory=${category}`);
        const data = await response.json();
        products = data.data;
        totalPages = data.last_page;
    } catch (error) {
        throw new SyntaxError(error);
    }
};
const memo = {};
const getCategoryNameById = (id) => {
    if (id in memo) { return memo[id]; } 
    let category = categories.find(item => item.id === id );
    memo[id] = category.name;
    return memo[id];
};
const renderProducts = async () => {
    let htmlCards = ``;
    let cardEmptyProducts = `
        <section class="card-empty-products">
            <span class="card-empty-products__message"> Not products found </span>
        </section>
    `;
    products.forEach(({ discount, name, price, url_image, category }) => {
        const card = `
            <section class="card">
                <figure class="card__container-img">
                    <img class="card__img" src=${url_image} />
                </figure>
                <section class="card__information">
                    <span class="card__category">${getCategoryNameById(category)}</span>
                    <h2 class="card__title">${name}</h2>
                    <div class="card__container-footer">
                        <h3 class="card__price">${price}&#36;</h3>
                        <h3 class="card__discount">${discount}% DSCTO</h3>
                    </div>
                </section>
            </section>
        `;
        htmlCards += card;
    });
    let getCardsElem = document.getElementById('container-cards');
    if (products.length > 0) {
        getCardsElem.innerHTML = htmlCards;
        getCardsElem.style.display = 'grid';
    } else { 
        getCardsElem.style.display = 'flex';
        getCardsElem.innerHTML = cardEmptyProducts;
    }
};
const renderPagination = () => {
    let pageNumbers = document.getElementById('page-number');
    pageNumbers.innerHTML = ``;
    Array.from({ length: totalPages }, (_, i) => i + 1).forEach(el => {
        pageNumbers.innerHTML += `<span class="paginate__item">${el}</span>`
    });
    let spansPagination = document.querySelectorAll('.paginate__item');
    spansPagination.forEach(item => { 
        item.addEventListener('click', e => {
            let currentPageInteger = parseInt(e.target.textContent);
            currentPage = currentPageInteger
            renderDomPage(currentPage);
        });
    });
    hideButtonsPagination();
};
const renderCategories = () => {
    let containerCategory = document.querySelector('.nav__list-category');
    let htmlCategory = `<li class="nav__item-category">all</li>`;
    categories.forEach(({ name }) => {
        const categoryItem = `
            <li class="nav__item-category">${name}</li>
        `;
        htmlCategory += categoryItem;
    });
    containerCategory.innerHTML = htmlCategory;
    let listCategories = document.querySelectorAll('.nav__item-category');
    listCategories.forEach(item => { 
        item.addEventListener('click', e => {
            let textContentCategory = e.target.textContent;
            if (textContentCategory === 'all') {
                renderDom();
            } else { 
                renderDomCategory(textContentCategory);
            }
        });
    });
};
const hideButtonsPagination = () => {
    let buttonLeft = document.querySelector('.paginate__button-left');
    let buttonRight = document.querySelector('.paginate__button-right');
    if (products.length > 0) {
        buttonLeft.style.display = 'flex';
        buttonRight.style.display = 'flex';
    } else {
        buttonLeft.style.display = 'none';
        buttonRight.style.display = 'none';
    }
};
const focusCurrentPaginate = (page) => {
    let spansPagination = document.querySelectorAll('.paginate__item');
    spansPagination.forEach((item, index) => {
        if (index === page - 1) {
            item.style.background = "#5EE6EB";
            item.style.color = "#fff";
        } else { 
            item.style.background = "#fff";
            item.style.color = "#000";
        }
    });
};
const checkOpacityButtonLeftOrRight = () => {
    currentPage === 1 ? buttonLeft.classList.add('opacity') : buttonLeft.classList.remove('opacity');
    currentPage === totalPages ? buttonRight.classList.add('opacity') : buttonRight.classList.remove('opacity');
};

const renderDomCategory = async (category) => {
    await fetchDataCategory(category);
    await renderProducts();
    renderPagination();
    currentPage = 1
    focusCurrentPaginate(currentPage);
    checkOpacityButtonLeftOrRight();
};

const renderDomPage = async (page) => {
    await fetchDataPage(page);
    await renderProducts();
    renderPagination();
    focusCurrentPaginate(page);
    checkOpacityButtonLeftOrRight();
};
const renderDom = async () => {
    await fetchDataInit();
    await renderProducts();
    renderPagination();
    renderCategories();
    focusCurrentPaginate(currentPage);
    checkOpacityButtonLeftOrRight();
};
const renderDomSearch = async (search) => {
    await fetchDataSearch(search);
    
    await renderProducts();
    renderPagination();
    currentPage = 1
    focusCurrentPaginate(currentPage);
    checkOpacityButtonLeftOrRight();
};
renderDom();
const loadActivate = (flag) => {
    let spinner = document.querySelector('.loadingspinner');
    if (flag) {
        spinner.style.display = 'block';
    } else { 
        spinner.style.display = 'none';
    }
};
const search = document.querySelector('#input-search');
search.addEventListener('input', e => {
    loadActivate(true);
    renderDomSearch(e.target.value);
    loadActivate(false);
});
const buttonLeft = document.querySelector('.paginate__button-left');
const buttonRight = document.querySelector('.paginate__button-right');
buttonLeft.addEventListener('click', e => { 
    if (currentPage > 1) {
        currentPage -= 1;
        renderDomPage(currentPage);
    }
});
buttonRight.addEventListener('click', e => { 
    if (currentPage < totalPages) { 
        currentPage += 1;
        renderDomPage(currentPage);
    }
});