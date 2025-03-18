#!/usr/bin/env node

import axios from "axios";
const API_URL = "https://graphql.anilist.co";

// Function to fetch anime details by ID
async function fetchAnimeById(animeId) {
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

    const variables = { id: animeId };

    try {
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
        console.error("Error fetching anime details:", error.message);
    }
}

// Function to fetch paginated anime IDs
async function fetchPaginatedAnime(page = 1, perPage = 5, keyword=null) {
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
    }`;

    const variables = { page, perPage, search: keyword || null };
    console.log(keyword)
    try {
        const response = await axios.post(API_URL, { query, variables });
        const pageInfo = response.data.data.Page.pageInfo;
        const mediaList = response.data.data.Page.media;

        console.log(`\n📄 Page ${page}:`);
        mediaList.forEach((anime) => {
            console.log(`🎥 ${anime.title.english || anime.title.romaji} (ID: ${anime.id})`);
        });

        // Fetch next page if available
        if (pageInfo.hasNextPage) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            await fetchPaginatedAnime(page + 1, perPage);
        }
    } catch (error) {
        console.error("Error fetching paginated anime:", error.message);
    }
}

// CLI Execution
const args = process.argv.slice(2);

if (args.length === 0) {
    console.log("🔹 Usage: anime-cli <command> <argument>");
    console.log("🔹 Commands:");
    console.log("   search <anime_id>     → Fetch anime details by ID");
    console.log("   list <page> <perPage> → Fetch paginated anime list");
} else {
    const command = args[0];

    if (command === "search" && args[1]) {
        fetchAnimeById(parseInt(args[1]));
    } else if (command === "list") {
        const page = args[1] ? parseInt(args[1]) : 1;
        const perPage = args[2] ? parseInt(args[2]) : 5;
        const keyword = args.length > 3 ? args.slice(3).join(" ") : null;
    
        fetchPaginatedAnime(page, perPage, keyword);
    }
     else {
        console.log("Invalid command. Use 'anime-cli search <id>' or 'anime-cli list <page> <perPage>'.");
    }
}
