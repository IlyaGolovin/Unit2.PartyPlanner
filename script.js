const COHORT = "/2109-CPU-RM-WEB-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api${COHORT}/events`;
//const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2109-CPU-RM-WEB-PT/events`;
const state = {
  events: [],
  
};
//console.log(state.events)
const artistList = document.querySelector("#artists");

const addArtistForm = document.querySelector("#addArtist");
addArtistForm.addEventListener("submit", addArtist);

/**
 * Sync state with the API and rerender
 */
async function render() {
  await getArtists();
  renderArtists();
}
render();

/**
 * Update state with artists from API
 */
async function getArtists() {
  // TODO
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.events = json.data;
    //console.log(state.events);
  } catch (error) {
    console.error(error);
  }
}

function renderArtists() {
  // TODO
  if (!state.events.length) {
    artistList.innerHTML = "<li>No artists.</li>";
    return;
  }

  const events = state.events;

  // Create an empty array to store the event cards.
  const eventCards = [];

  // Iterate over the events and create an event card for each event.
  for (const event of events) {
    const li = document.createElement("li");

    // Parse the date into a Date object.
    const date = new Date(event.date);

    // Check if the date is valid.
    if (date instanceof Date && !isNaN(date.getTime())) {
      // Format the date.
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Add the event information to the event card.
      li.innerHTML = `
      <div class="artist-card">
        <h2>${event.name}</h2>
        <p>${event.description}</p>
        <p>${event.location}</p>
        <p>${formattedDate}</p>
        
        <button data-artist-id="${event.id}" onclick="deleteArtist(event)">Delete Event</button>
      </div>
    `;
    } else {
      console.log("The date is not valid.")
      // Handle the error.
    }

    // Add the event card to the array.
    eventCards.unshift(li);
  }

  // Replace the contents of the artist list with the event cards.
  artistList.replaceChildren(...eventCards);
}

/**
 * Ask the API to create a new artist based on form data
 * @param {Event} event
 */
async function addArtist(event) {
  
    event.preventDefault();

    
  
    const artistData = {
      name: addArtistForm.name.value,
      description: addArtistForm.description.value,
      date: new Date(addArtistForm.date.value).toISOString(),
      location: addArtistForm.location.value,
    };
  
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(artistData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create artist");
      }
  
      render();
      // Clear the input fields.
    addArtistForm.reset();

    } catch (error) {
      console.error(error);
    }
  }

  
  

async function deleteArtist(event) {
  event.preventDefault();

  const artistId = event.target.getAttribute("data-artist-id");

  try {
    const response = await fetch(`${API_URL}/${artistId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete artist");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}
