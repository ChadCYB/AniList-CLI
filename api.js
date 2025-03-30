import axios from 'axios';

// base anilist API url
const API_URL = 'https://graphql.anilist.co';

// Search API by Keyword
export const searchByKeyword = async (keyword, page = 1, perPage = 10, results = []) => {
  try {
    const query = `
      query ($page: Int, $perPage: Int, $search: String) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            hasNextPage
          }
          media(search: $search, type: ANIME) {
            id
            title {
              romaji
              english
            }
          }
        }
      }
    `;

    const variables = { page, perPage, search: keyword };
    const response = await axios.post(API_URL, { query, variables });
    const pageInfo = response.data.data.Page.pageInfo;
    const mediaList = response.data.data.Page.media;

    results.push(...mediaList);

    if (pageInfo.hasNextPage) {
      await new Promise(resolve => setTimeout(resolve, 500)); // optional delay
      return await searchByKeyword(keyword, page + 1, perPage, results);
    }

    return results;

  } catch (error) {
    console.error('Error searching AniList:', error.message);
    throw error;
  }
};

// Get Detailed Data by Unique Identifier
export const getByIdentifier = async (id) => {
  try {
    const query = `
      query ($id: Int) { 
        Media (id: $id, type: ANIME) { 
          id
          title {
            romaji
            english
            native
          }
          episodes
          averageScore
          genres
          season
          seasonYear
          description
        }
      }
    `;

    const variables = { id };
    const response = await axios.post(API_URL, { query, variables });
    const anime = response.data.data.Media;

    // Clean description by stripping HTML tags (optional)
    const cleanedDescription = anime.description?.replace(/<[^>]*>/g, "") || "";

    return {
      id: anime.id,
      title: {
        romaji: anime.title.romaji,
        english: anime.title.english,
        native: anime.title.native,
      },
      episodes: anime.episodes || null,
      averageScore: anime.averageScore || null,
      genres: anime.genres || [],
      season: anime.season || null,
      seasonYear: anime.seasonYear || null,
      description: cleanedDescription,
    };

  } catch (error) {
    console.error('Error fetching details from AniList:', error.message);
    throw error;
  }
};