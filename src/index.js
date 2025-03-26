document.addEventListener("DOMContentLoaded", () => {
    const baseURL = "http://localhost:3000/characters";
    const characterBar = document.getElementById("character-bar");
    const detailedInfo = document.getElementById("detailed-info");
    const nameDisplay = document.getElementById("name");
    const imageDisplay = document.getElementById("image");
    const voteCount = document.getElementById("vote-count");
    const votesForm = document.getElementById("votes-form");
    const resetBtn = document.getElementById("reset-btn");
    const characterForm = document.getElementById("character-form");
    
    let currentCharacter = null;

    // Fetch and display character names
    fetch(baseURL)
        .then(response => response.json())
        .then(characters => {
            characters.forEach(character => addCharacterToBar(character));
        });

    function addCharacterToBar(character) {
        const span = document.createElement("span");
        span.textContent = character.name;
        span.style.cursor = "pointer";
        span.addEventListener("click", () => displayCharacterDetails(character));
        characterBar.appendChild(span);
    }

    function displayCharacterDetails(character) {
        currentCharacter = character;
        nameDisplay.textContent = character.name;
        imageDisplay.src = character.image;
        imageDisplay.alt = character.name;
        voteCount.textContent = character.votes;
    }

    // Handle votes submission
    votesForm.addEventListener("submit", event => {
        event.preventDefault();
        if (!currentCharacter) return;

        const votesInput = document.getElementById("votes");
        let votesToAdd = parseInt(votesInput.value);
        if (isNaN(votesToAdd) || votesToAdd < 0) votesToAdd = 0;
        
        currentCharacter.votes += votesToAdd;
        voteCount.textContent = currentCharacter.votes;
        votesInput.value = "";
    });

    // Reset votes to 0
    resetBtn.addEventListener("click", () => {
        if (!currentCharacter) return;
        currentCharacter.votes = 0;
        voteCount.textContent = 0;
    });

    // Bonus: Add a new character
    if (characterForm) {
        characterForm.addEventListener("submit", event => {
            event.preventDefault();
            const nameInput = document.getElementById("name");
            const imageUrlInput = document.getElementById("image-url");
            
            const newCharacter = {
                name: nameInput.value,
                image: imageUrlInput.value,
                votes: 0
            };
            
            fetch(baseURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCharacter)
            })
            .then(response => response.json())
            .then(character => {
                addCharacterToBar(character);
                displayCharacterDetails(character);
            });
            
            nameInput.value = "";
            imageUrlInput.value = "";
        });
    }
});