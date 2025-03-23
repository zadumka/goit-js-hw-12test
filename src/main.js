import { getAllImages } from './js/pixabay-api';
import { imageTemplate, imagesTemplate } from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.form'),
  gallery: document.querySelector('.gallery'),
  btnNext: document.querySelector('.gallery-btn'),
  loader: document.querySelector('.loader'),
};

let lightbox;

const params = {
  message: '',
  page: null,
  total: 1,
  perPage: 40,
};

hidebtnNext();

refs.form.addEventListener('submit', searchImages);

async function searchImages(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';

  const message = e.target.elements.search.value.trim();
  params.message = message;
  params.page = 1;

  try {
    const result = await getAllImages(
      params.message,
      params.page,
      params.perPage
    );

    if (result.hits.length === 0) {
      hidebtnNext();
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        messageColor: '#FFFFFF',
        backgroundColor: '#B51B1B',
        position: 'topRight',
        messageSize: '16px',
        messageLineHeight: '24px',
        maxWidth: '432px',
      });
    } else {
      const markup = imagesTemplate(result.hits);
      refs.gallery.innerHTML = markup;
      params.total = result.totalHits;

      checkBtnStatus();

      lightbox = new SimpleLightbox('.gallery a');
    }
  } catch (error) {
    refs.gallery.innerHTML = '';
    iziToast.error({
      message:
        'Sorry, there are no images matching your search query. Please try again!',
      messageColor: '#FFFFFF',
      backgroundColor: '#B51B1B',
      position: 'topRight',
      messageSize: '16px',
      messageLineHeight: '24px',
      maxWidth: '432px',
    });
    console.log(error);
  }

  e.target.reset();
}

refs.btnNext.addEventListener('click', async () => {
  hidebtnNext();
  showLoader();
  params.page += 1;

  try {
    const result2 = await getAllImages(
      params.message,
      params.page,
      params.perPage
    );

    const markup = imagesTemplate(result2.hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
    hideLoader();
    checkBtnStatus();
    scrollPage();
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again.',
      position: 'topRight',
    });
    hideLoader();
  }
});

function showLoader() {
  refs.loader.classList.remove('hidden');
  
}

function hideLoader() {
  refs.loader.classList.add('hidden');
  
}

function showbtnNext() {
  refs.btnNext.style.display = '';
}

function hidebtnNext() {
  refs.btnNext.style.display = 'none';
}

function checkBtnStatus() {
  const maxPage = Math.ceil(params.total / params.perPage);

  if (params.page >= maxPage || params.total < params.perPage) {
    hidebtnNext();
    iziToast.info({
      position: 'topRight',
      message: "We're sorry, but you've reached the end of search results.",
    });
  } else {
    showbtnNext();
  }
}

function scrollPage() {
  const info = refs.gallery.firstElementChild.getBoundingClientRect();
  const height = info.height;
  window.scrollBy({
    behavior: 'smooth',
    top: height * 2,
  });
}