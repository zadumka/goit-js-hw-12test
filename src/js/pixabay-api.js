import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com';

export async function searchImg(query, page) {
    const BASE_URL = 'https://pixabay.com/api/';
    const params = {
        key: '49423998-53f799fc922e58b577969e777',
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page:40 
    };
    return await axios.get(BASE_URL, { params })
};