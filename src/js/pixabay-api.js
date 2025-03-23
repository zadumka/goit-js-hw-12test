import axios from 'axios';

export async function getAllImages(message,page,perPage) {
  const baseURL = 'https://pixabay.com/api/';

  const params = {
    key: '49423998-53f799fc922e58b577969e777',
    q: message,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page: perPage,
  };
  const result = await axios.get(baseURL, { params });
  
  
  return result.data;
}