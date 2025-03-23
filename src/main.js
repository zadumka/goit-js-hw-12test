import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import { searchImg } from './js/pixabay-api.js';
import { imgsTemplate, lightbox } from './js/render-functions.js';

export const refs = {
    form: document.querySelector('.search-form'),
    input: document.querySelector('#image-input'),
    gallery: document.querySelector('.gallery'),
    btnLoadMore: document.querySelector('.js-load-btn'),
    loader: document.querySelector('.js-loader')
};

const params = {
  query: '',
  page: 1,
  total: null,
  per_page: 40,
};

refs.form.addEventListener('submit',async (e) => {
    e.preventDefault();
    showLoader();

    params.query = refs.input.value.trim();
    params.page = 1;

    if (params.query === '') {
      hideLoader();
      return;
    }
    refs.gallery.innerHTML = '';
    refs.form.reset();
    hideBtnLoadMore();
    
    try {
        const result = await searchImg(params.query, params.page,params.per_page);
        const data = result.data;
        
      
        if (data.hits.length === 0) {
            iziToast.info({
                title: '',
                message: 'Sorry, there are no images matching your search query. Please try again!',
                messageColor: '#fafafb',
                backgroundColor: '#ef4040',
                messageSize: '16px',
                position: 'topRight',
                maxWidth: '432px',
            });
        } else {
            refs.gallery.innerHTML = imgsTemplate(data.hits);
            lightbox.refresh();

            params.total = data.totalHits;
            checkBtnLoadMore();
        }
        
    } catch(error) {
       refs.gallery.innerHTML = '';
       iziToast.error({
        title: 'Error',
        message: 'Something went wrong. Please try again.',
        position: 'topRight',
       });
    } finally {
      hideLoader();
    }
});

refs.btnLoadMore.addEventListener('click', async () => {
    params.page += 1;
    showLoader();

    try {
        const result = await searchImg(params.query, params.page, params.per_page);
        const data = result.data;
        refs.gallery.insertAdjacentHTML('beforeend', imgsTemplate(data.hits));
        lightbox.refresh();

        params.total = data.totalHits;
        
        checkBtnLoadMore();
        scrollToNewImages();
        
    } catch (error) {
        iziToast.error({
            title: 'Error',
            message: 'Something went wrong. Please try again.',
            position: 'topRight',
        });
        } finally {
        setTimeout(() => {
        hideLoader();
    }, 5000);
    }
});

function showBtnLoadMore() {
     refs.btnLoadMore.classList.remove('hidden');
}
function hideBtnLoadMore() {
     refs.btnLoadMore.classList.add('hidden');
}
function checkBtnLoadMore() {
    const maxPage = Math.ceil(params.total / params.per_page);

    if (params.page >= maxPage) {
        hideBtnLoadMore();
        iziToast.info({
            title: '',
            message: 'We"re sorry, but you"ve reached the end of search results.',
            position: 'topRight',
        });
    } else {
    showBtnLoadMore();
    }
}

function showLoader() {
    refs.loader.classList.remove('hidden');
}
function hideLoader() {
    refs.loader.classList.add('hidden');
}

function scrollToNewImages() {
    const { height } = refs.gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: height * 2, 
        behavior: 'smooth'
    });
}