"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const API_URL = "http://api.tvmaze.com/";
const DEFAULT_IMG = "https://tinyurl.com/tv-missing";
let showId = null;


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

/** Pull data from server and return array with object
 * [{id: name: summary: image:}]
 */
async function getShowsByTerm(searchTerm) {

  const apiExt = "search/shows/";

  const result = await axios.get(
    API_URL + apiExt, { params: { q: searchTerm } });

  const showData = result.data[0].show;

  const id = showData.id;
  showId = id;

  const name = showData.name;
  const summary = showData.summary;

  let image = showData.image.medium;
  (!image) ? image = DEFAULT_IMG : image;


  return [{ id, name, summary, image }];
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.image}
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }

}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(show) {

  let apiEpisodesUrl = `shows/${show}/episodes`

  const result = await axios.get(API_URL + apiEpisodesUrl);

  let episodes = [];

  for(let episode of result.data){

    const id = episode.id;
    const name = episode.name;
    const season = episode.season;
    const number = episode.number;

    episodes.push({id, name, season, number});
  }

  return episodes;

 }




 $showsList.on("click", $("<button>"), async function () {

  await getEpisodesOfShow(showId);
});


/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {

}
