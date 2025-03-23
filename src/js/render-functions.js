
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

function imgTemplate(img) {
  const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = img;
  return `<li class="gallery-item">
  <a class="gallery-link" href="${img.largeImageURL}">
    <img
      class="gallery-image"
      src="${img.webformatURL}"
      alt="${img.tags}"
    />
  </a>
  
  <ul class="image-info">
      <li class="info-item">
        <p class="text">Likes</p>
        <p class="text-value">${img.likes}</p>
      </li>
      <li class="info-item">
        <p class="text">Views</p>
        <p class="text-value">${img.views}</p>
      </li>
      <li class="info-item">
        <p class="text">Comments</p>
        <p class="text-value">${img.comments}</p>
      </li>
      <li class="info-item">
        <p class="text">Downloads</p>
        <p class="text-value">${img.downloads}</p>
      </li>
      </ul>
</li>`
};
export const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export function imgsTemplate(imgs) {
  return imgs.map(imgTemplate).join('');
}