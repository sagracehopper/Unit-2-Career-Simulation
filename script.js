// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "2409-ghp-et-web-pt"; //name of cohort
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

/**
 * Fetches all players from the API. fetch all player data from the API
 * @returns {Object[]} the array of player objects
 */
//async function- uses the word async and await; async allows the function to know that it will be a promise (await part); comes in pairs
// pair async - await 
const fetchAllPlayers = async () => {
  try {
    // TODO

    const response = await fetch(`${API_URL}/players`); //fetching is a javascript build-in and creates a network call, 
    //does a "GET" (types of request: GET, POST, DELETE) request

    const data = await response.json(); //response from URL is in a json 
    console.log(data.data.players); //to de-structure an object add "dot" 
    return data.data.players;

    //catching errors 
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/players/${playerId}`,{
      method: 'GET',
    });//template literal //getting playerID via api url; using "fetching"
    
    const data = await response.json(); //response from URL is in json
    console.log(data.data.player); 
    return data.data.player;
    //catching errors 
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};
/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */

// const functionName = () => {} // this is how ALL functions should look
// function functionName(){} <- this is the also a valid way a function is written

const addNewPlayer = async (playerObj) => {
  console.log(playerObj);
  try {
    const response = await fetch(`${API_URL}/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playerObj)

    }); 
    const result = await response.json(); //json is a js object notation (just an object)
    console.log(result);


  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

// addNewPlayer({name: "John", breed: "Beagle", status: "bench", imageUrl: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.britannica.com%2Fanimal%2Fbeagle-dog&psig=AOvVaw3CvNC57c15v9boG1CpxYkB&ust=1734132330669000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCICps76wo4oDFQAAAAAdAAAAABAE"});

// END 
/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (playerId) => {
  try {
    const response = await fetch (`${API_URL}/players/${playerId}`, {
     method: `DELETE`,  //enter methods here; we need to specify that this is the method of delete
    }); 
    const result = await response.json(); 
    console.log(result); //console logging the jsonified library
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = (playerList) => {
  const container = document.querySelector("#puppy-container");
  playerList.forEach((item) => {
    const h3 = document.createElement('h3');
    h3.textContent = item.name;
    const img = document.createElement('img');
    img.src = item.imageUrl;
    const btn = document.createElement('button');
    btn.textContent = "See Details";
    btn.addEventListener('click', () => {
      const detailsContainer = document.getElementById('single-player-container');
      while (detailsContainer.firstChild) {
        detailsContainer.removeChild(detailsContainer.firstChild);
      }
      renderSinglePlayer(item.id);
    });
    const rmBtn = document.createElement('button');
    rmBtn.textContent = "Remove Player";
    rmBtn.addEventListener('click', () => {
      removePlayer(item.id);
    })
  
   
    container.appendChild(img);
    container.appendChild(h3);
    container.appendChild(btn);
    container.appendChild(rmBtn);
  })


};

/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = async(player) => {

  const playerInfo = await fetchSinglePlayer(player);
  console.log(playerInfo);
  const singleArea = document.querySelector('#single-player-container');
  const playerName = document.createElement('h3');
  playerName.textContent = playerInfo.name;
  const breed = document.createElement('h5');
  breed.textContent = playerInfo.breed;
  const img = document.createElement('img');
  img.src = playerInfo.imageUrl;
  const status = document.createElement(`h5`); 
  status.textContent = playerInfo.status; 

  singleArea.appendChild(playerName);
  singleArea.appendChild(breed);
  singleArea.appendChild(img);
  singleArea.appendChild(status); 
  
  


};

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */
const renderNewPlayerForm = () => {
  const playerForm = document.getElementById('new-player-form');
  const playerName = document.getElementById('playerNameInput');
  const playerBreed = document.getElementById('playerBreedInput');
  const imageUrlInput = document.getElementById('imageUrlInput');
  let name, breed, imageUrl;
  playerForm.addEventListener('submit', (event) => [
    event.preventDefault(),
    name = playerName.value,
    breed = playerBreed.value,
    imageUrl = imageUrlInput.value,
    addNewPlayer({name, breed, imageUrl}),

  ])
  };

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  renderNewPlayerForm();
};

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
    removePlayer,
    renderAllPlayers,
    renderSinglePlayer,
    renderNewPlayerForm,
  };
} else {
  init();
}
