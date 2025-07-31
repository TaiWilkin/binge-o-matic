export async function fetchFromTMDB(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
  return response.json();
}

export function searchTMDB(searchQuery) {
  const searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${process.env.API_KEY}&language=en-US&query=${searchQuery}&page=1&include_adult=false`;
  return fetchFromTMDB(searchUrl);
}

export function fetchShowFromTMDB(media_id) {
  const searchUrl = `https://api.themoviedb.org/3/tv/${media_id}?api_key=${process.env.API_KEY}&language=en-US`;
  return fetchFromTMDB(searchUrl);
}

export function fetchSeasonFromTMDB(show_id, season_number) {
  const searchUrl = `https://api.themoviedb.org/3/tv/${show_id}/season/${season_number}?api_key=${process.env.API_KEY}&language=en-US`;
  return fetchFromTMDB(searchUrl);
}
