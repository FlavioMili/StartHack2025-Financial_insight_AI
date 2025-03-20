document.addEventListener("DOMContentLoaded", function () { //VIEW SELECTOR LOGIC 
    const buttons = document.querySelectorAll(".view-btn");
    if (buttons.length === 0) {
        console.error("Nessun elemento .view-btn trovato nel DOM.");
    }

    const text1 = document.getElementById("text1");
    const text2 = document.getElementById("text2");

    text2.style.display = "block"; // Mostra la Vista 1 di default

        renderPieChart(); // Disegna il grafico quando si seleziona la Vista 2
    

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            text1.style.display = "none";
            text2.style.display = "none";

            if (this.dataset.view === "text1") {
                text1.style.display = "block";
            } else if (this.dataset.view === "text2") {
                text2.style.display = "block";
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () { //PIE CHART 
    const buttons = document.querySelectorAll(".view-btn");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            buttons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            const selectedView = this.getAttribute("data-view");
            document.getElementById("text1").style.display = selectedView === "text1" ? "block" : "none";
            document.getElementById("text2").style.display = selectedView === "text2" ? "block" : "none";

            if (selectedView === "text2") {
                renderPieChart(); // Disegna il grafico quando si seleziona la Vista 2
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("http://127.0.0.1:5000/get_user/0");
        
        if (!response.ok) {
            throw new Error(`Errore HTTP! Stato: ${response.status}`);
        }
        
        const data = await response.json();
        const client = data.client;

        // Mostra il nome dell'utente
        document.getElementById("client-name").innerText = client.Name + ", ";

        // Mostra il profilo con lo stile badge
        const profileDetails = document.getElementById("profile-details");
        for (const [profileType, profileValue] of Object.entries(client.Profile)) {
            let badge = document.createElement("p");
            badge.className = "profile-badge";
            badge.innerText = `${profileValue}`;
            profileDetails.appendChild(badge);
        }

        // Informazioni fiscali
        const taxInfo = document.getElementById("tax-info");
        for (const [taxType, taxValue] of Object.entries(client.Taxes)) {
            let taxElement = document.createElement("p");
            taxElement.innerHTML = `<strong class="enphasis">${taxType.replace(/_/g, " ")}:</strong> ${taxValue > 0 ? taxValue+"%" : "n.a."}`;
            taxInfo.appendChild(taxElement);
        }

        // Stato e bandiera
        const countryInfo = document.getElementById("country-info");
        
        const countryFlags = {
            "Switzerland": "🇨🇭",
            "Italy": "🇮🇹",
            "Germany": "🇩🇪",
            "France": "🇫🇷",
            "USA": "🇺🇸"
        };

        const countryAbbr = {
            "Switzerland": "CH",
            "Italy": "ITA",
            "Germany": "DEU",
            "France": "FRA",
            "USA": "USA"
        };

        let countryText = document.createElement("p");
        let country = client.TaxZone;
        countryText.innerText = `${countryAbbr[country] || "n.a."} ${countryFlags[country] || ""}`;
        countryInfo.appendChild(countryText);

    } catch (error) {
        console.error("Errore nel caricamento del JSON:", error);
    }
});

// Chat functionality
document.addEventListener("DOMContentLoaded", function() {
    const chatInput = document.querySelector('.chat-input');
    const chatBox = document.querySelector('.chat-box');
    
    if (chatInput && chatBox) {
        // Default client ID
        const clientId = 0;
        
        // Function to add a message to the chat display
        function addMessageToChat(message, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = isUser ? 'user-message' : 'bot-message';
            messageDiv.textContent = message;
            messageDiv.style.padding = '8px 12px';
            messageDiv.style.margin = '4px 0';
            messageDiv.style.borderRadius = '12px';
            messageDiv.style.maxWidth = '80%';
            messageDiv.style.wordWrap = 'break-word';
            
            if (isUser) {
                messageDiv.style.alignSelf = 'flex-end';
                messageDiv.style.backgroundColor = '#555555'; // Dark gray for user messages
                messageDiv.style.color = 'white';
            } else {
                messageDiv.style.alignSelf = 'flex-start';
                messageDiv.style.backgroundColor = '#e0e0e0'; // Light gray for bot messages
                messageDiv.style.color = '#333';
            }
            
            // Make sure chat box is set up for flex layout
            chatBox.style.display = 'flex';
            chatBox.style.flexDirection = 'column';
            chatBox.style.overflowY = 'auto';
            
            chatBox.appendChild(messageDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
        }
        
        // Function to send chat message to backend
        async function sendChatMessage(message) {
            try {
                // Show user message immediately
                addMessageToChat(message, true);
                
                // Add loading indicator
                const loadingDiv = document.createElement('div');
                loadingDiv.className = 'loading-message';
                loadingDiv.textContent = 'Loading...';
                loadingDiv.style.alignSelf = 'flex-start';
                loadingDiv.style.fontStyle = 'italic';
                loadingDiv.style.color = '#888'; // Gray for loading indicator
                loadingDiv.style.margin = '4px 0';
                chatBox.appendChild(loadingDiv);
                
                // Create form data for POST request
                const formData = new FormData();
                formData.append('prompt', message);
                
                // Send request to backend
                const response = await fetch(`http://127.0.0.1:5000/chat/${clientId}`, {
                    method: 'POST',
                    body: formData
                });
                
                // Remove loading indicator
                chatBox.removeChild(loadingDiv);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Display response from assistant
                addMessageToChat(data.response);
                
            } catch (error) {
                console.error("Error sending chat message:", error);
                
                // Remove loading indicator if it exists
                const loadingElement = document.querySelector('.loading-message');
                if (loadingElement) {
                    chatBox.removeChild(loadingElement);
                }
                
                addMessageToChat("Sorry, there was an error processing your request.");
            }
        }
        
        // Handle sending messages when pressing Enter (but allow Shift+Enter for new lines)
        chatInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                const message = chatInput.value.trim();
                if (message) {
                    sendChatMessage(message);
                    chatInput.value = ''; // Clear input after sending
                }
            }
        });

        // Add a welcome message
        addMessageToChat("Hello! How can I help you with your financial questions today?");
        
        console.log("Chat functionality initialized");
    } else {
        console.error("Chat elements not found in the DOM");
    }
});

