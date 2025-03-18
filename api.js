const axios = require('axios');

const ANILIST_API_URL = 'https://graphql.anilist.co';

const searchQuery = `
  query ($search: String) {
    Page (page: 1, perPage: 10) {
      media (search: $search, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        type
        format
        status
        description
        episodes
        duration
        genres
        averageScore
        coverImage {
          large
        }
      }
    }
  }
`;

const getDetailsQuery = `
  query ($id: Int) {
    Media (id: $id) {
      id
      title {
        romaji
        english
        native
      }
      type
      format
      status
      description
      episodes
      duration
      genres
      averageScore
      coverImage {
        large
      }
      studios {
        nodes {
          name
        }
      }
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
    }
  }
`;

async function searchByKeyword(keyword) {
  try {
    const response = await axios.post(ANILIST_API_URL, {
      query: searchQuery,
      variables: { search: keyword }
    });
    return response.data.data.Page.media;
  } catch (error) {
    console.error('Error searching AniList:', error.message);
    throw error;
  }
}

async function getDetailsById(id) {
  try {
    const response = await axios.post(ANILIST_API_URL, {
      query: getDetailsQuery,
      variables: { id: parseInt(id) }
    });
    return response.data.data.Media;
  } catch (error) {
    console.error('Error fetching details from AniList:', error.message);
    throw error;
  }
}

module.exports = {
  searchByKeyword,
  getDetailsById
}; 