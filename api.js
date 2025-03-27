import axios from 'axios';

// base anilist API url
const API_URL = 'https://graphql.anilist.co';

// Search API by Keyword
export const searchByKeyword = async (keyword, page = 1, perPage = 10) => {
  try {
    const query = `
    query ($page: Int, $perPage: Int, $search: String) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          hasNextPage
        }
        media (search: $search, type: ANIME) {
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
    console.log(`🔍 Searching for: "${keyword}"`);
    const response = await axios.post(API_URL, { query, variables });
    const { hasNextPage } = response.data.data.Page.pageInfo;
    const mediaList = response.data.data.Page.media;

    console.log(`\n📄 Page ${page}:`);
    mediaList.forEach((anime) => {
      console.log(`🎥 ${anime.title.english || anime.title.romaji} (ID: ${anime.id})`);
    });

    // Fetch next page if available
    if (hasNextPage) {
      await new Promise(resolve => setTimeout(resolve, 500));
      await searchByKeyword(keyword, page + 1, perPage);
    }

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
    }`;

    const variables = { id: id };
    const response = await axios.post(API_URL, { query, variables });
    const anime = response.data.data.Media;

    console.log("\n🎬 Anime Details:");
    console.log(`📌 Title: ${anime.title.english || anime.title.romaji || anime.title.native}`);
    console.log(`📆 Season: ${anime.season} ${anime.seasonYear}`);
    console.log(`⭐ Rating: ${anime.averageScore}/100`);
    console.log(`🎭 Genres: ${anime.genres.join(", ")}`);
    console.log(`📺 Episodes: ${anime.episodes || "Unknown"}`);
    console.log(`📝 Description:\n${anime.description.replace(/<[^>]*>/g, "")}\n`);



  } catch (error) {
  console.error('Error fetching details from AniList:', error.message);
  throw error;
  }
};
