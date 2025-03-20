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
        const response = await fetch("http://127.0.0.1:5000/get_user/0", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        
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

// Populate the News section with relevant financial news
document.addEventListener("DOMContentLoaded", function() {
    const newsContainer = document.querySelector('.bottom-row .card:first-child');
    
    if (newsContainer) {
        // Create news container
        const newsContent = document.createElement('div');
        newsContent.className = 'news-content';
        
        // Style the news container to match dark theme
        newsContent.style.maxHeight = '280px';
        newsContent.style.overflowY = 'auto';
        newsContent.style.padding = '0 5px';
        newsContent.style.scrollbarWidth = 'thin';
        newsContent.style.scrollbarColor = '#888 #323232';
        
        // Add news items
        const newsItems = [
        
        ];
        
        // Add each news item to the container
        newsItems.forEach(item => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            newsItem.style.marginBottom = '15px';
            newsItem.style.borderBottom = '1px solid #444';
            newsItem.style.paddingBottom = '10px';
            newsItem.style.backgroundColor = '#323232';
            newsItem.style.padding = '10px';
            newsItem.style.borderRadius = '8px';
            
            // Create metadata container
            const metaContainer = document.createElement('div');
            metaContainer.style.display = 'flex';
            metaContainer.style.alignItems = 'center';
            metaContainer.style.marginBottom = '6px';
            
            // Create category badge
            const category = document.createElement('span');
            category.className = 'news-category';
            category.textContent = item.category;
            category.style.backgroundColor = 'rgb(205, 72, 43)';
            category.style.color = 'white';
            category.style.padding = '3px 8px';
            category.style.borderRadius = '4px';
            category.style.fontSize = '12px';
            category.style.marginRight = '10px';
            category.style.fontWeight = 'bold';
            
            // Create date element
            const date = document.createElement('span');
            date.className = 'news-date';
            date.textContent = item.date;
            date.style.color = '#aaa';
            date.style.fontSize = '12px';
            date.style.fontWeight = '500';
            
            // Create title
            const title = document.createElement('h3');
            title.className = 'news-title';
            title.textContent = item.title;
            title.style.fontSize = '16px';
            title.style.margin = '8px 0';
            title.style.color = 'white';
            title.style.fontWeight = 'bold';
            
            // Create content
            const content = document.createElement('p');
            content.className = 'news-content';
            content.textContent = item.content;
            content.style.fontSize = '14px';
            content.style.color = '#ccc';
            content.style.lineHeight = '1.4';
            content.style.margin = '0';
            
            // Append elements properly
            metaContainer.appendChild(category);
            metaContainer.appendChild(date);
            
            newsItem.appendChild(metaContainer);
            newsItem.appendChild(title);
            newsItem.appendChild(content);
            
            // Append news item to news content
            newsContent.appendChild(newsItem);
        });
        
        // Append news content to news container
        newsContainer.appendChild(newsContent);
    } else {
        console.error("News container not found in the DOM");
    }
});

// Fix the content rotation functions
document.addEventListener("DOMContentLoaded", function() {
    // Define related content items (analysis and news pairs that appear together)
    const contentItems = [
        {
            analysis: {
                title: "AI Competition Intensifies in Financial Sector",
                points: [
                    "Alphabet's new AI financial tools targeting wealth management firms.",
                    "40% improvement in insights delivery reported by early partners."
                ]
            },
            news: {
                title: "Alphabet's AI Division Announces Revolutionary Financial Analysis Tool",
                content: "In a move to regain market confidence, Alphabet unveiled a new AI-powered financial analysis platform targeting wealth management firms.",
                date: "March 19, 2025",
                category: "Technology"
            }
        },
        {
            analysis: {
                title: "Regulatory Environment Shifting",
                points: [
                    "EU Digital Markets Act implementation finalized.",
                    "Tech companies face September compliance deadline."
                ]
            },
            news: {
                title: "EU Finalizes Digital Markets Act Implementation",
                content: "Major tech companies including Alphabet and Microsoft have until September to comply with the EU's strict new digital market regulations.",
                date: "March 18, 2025",
                category: "Regulation"
            }
        },
        {
            analysis: {
                title: "Interest Rate Outlook",
                points: [
                    "Fed signals possible rate cut in June meeting.",
                    "Inflation metrics showing signs of stabilization."
                ]
            },
            news: {
                title: "Federal Reserve Holds Rates Steady, Signals Possible Cut",
                content: "The Federal Reserve maintained the current interest rate range today, but Chair Janet Powell hinted at a possible rate cut in June.",
                date: "March 20, 2025",
                category: "Economy"
            }
        },
        {
            analysis: {
                title: "Bond Market Reaction",
                points: [
                    "Treasury yields falling on rate cut expectations.",
                    "10-year yield at lowest level since December 2024."
                ]
            },
            news: {
                title: "Bond Markets Rally on Fed Comments",
                content: "Treasury bonds rallied following the Federal Reserve's latest signals, with the benchmark 10-year yield falling to 3.2%.",
                date: "March 20, 2025",
                category: "Markets"
            }
        },
        {
            analysis: {
                title: "SIX Group's Digital Asset Growth",
                points: [
                    "Record transaction volumes in Q1 2025.",
                    "Institutional adoption accelerating in European markets."
                ]
            },
            news: {
                title: "SIX Group Reports 15% Growth in Digital Asset Services",
                content: "SIX Group's digital asset platform saw record transaction volumes in Q1 2025, as institutional adoption continues to accelerate.",
                date: "March 17, 2025",
                category: "Markets"
            }
        },
        {
            analysis: {
                title: "Strategic Partnerships Expansion",
                points: [
                    "SIX Group forms alliances with three major European banks.",
                    "Digital asset custody and settlement network expanding."
                ]
            },
            news: {
                title: "SIX Group Expands Institutional Blockchain Services",
                content: "SIX Group announced strategic partnerships with three major European banks today, expanding its digital asset network across the continent.",
                date: "March 18, 2025",
                category: "Finance"
            }
        }
    ];
    
    let currentItemIndex = 0;
    const maxItemsToShow = 3; // Maximum number of analysis/news items to show
    
    // Keep track of displayed items
    const displayedAnalysis = [];
    const displayedNews = [];
    
    // Function to add new analysis item at the top
    function addAnalysisItem(analysisItem) {
        const responseBox = document.querySelector('.response-box');
        if (!responseBox) return;
    
        // Get or create keypoints container
        let keypoints = responseBox.querySelector('.keypoints');
        if (!keypoints) {
            keypoints = document.createElement('div');
            keypoints.className = 'keypoints';
            responseBox.appendChild(keypoints);
        }
    
        // Create new keypoint element with fade-in animation
        const keypoint = document.createElement('div');
        keypoint.className = 'keypoint';
        keypoint.style.opacity = '0';
        keypoint.style.transition = 'opacity 0.7s ease-in-out';
        keypoint.style.marginBottom = '15px';
        keypoint.style.backgroundColor = '#323232';
        keypoint.style.padding = '10px';
        keypoint.style.borderRadius = '8px';
        keypoint.style.borderBottom = '1px solid #444';
    
        // Add title
        const title = document.createElement('h3');
        title.textContent = analysisItem.title;
        title.style.color = 'white';
        title.style.fontSize = '16px';
        title.style.margin = '8px 0';
        title.style.fontWeight = 'bold';
        keypoint.appendChild(title);
    
        // Create points list but keep bullet points invisible initially
        const pointsList = document.createElement('ul');
        pointsList.style.color = '#ccc';
        pointsList.style.fontSize = '14px';
        pointsList.style.lineHeight = '1.4';
    
        // Create list items with individual fade-in transitions
        const listItems = [];
        analysisItem.points.forEach(point => {
            const listItem = document.createElement('li');
            listItem.textContent = point;
            listItem.style.opacity = '0';
            listItem.style.transition = 'opacity 0.5s ease-in-out';
            pointsList.appendChild(listItem);
            listItems.push(listItem);
        });
    
        keypoint.appendChild(pointsList);
    
        // Add to the top of the container
        if (keypoints.firstChild) {
            keypoints.insertBefore(keypoint, keypoints.firstChild);
        } else {
            keypoints.appendChild(keypoint);
        }
    
        // Track this item
        displayedAnalysis.push(keypoint);
    
        // Remove oldest item if we exceed the limit
        if (displayedAnalysis.length > maxItemsToShow) {
            const oldestItem = displayedAnalysis.shift();
            // Fade out before removing
            oldestItem.style.opacity = '0';
            setTimeout(() => {
                if (oldestItem.parentNode) {
                    oldestItem.parentNode.removeChild(oldestItem);
                }
            }, 500);
        }
    
        // Fade in the keypoint container first
        setTimeout(() => {
            keypoint.style.opacity = '1';
    
            // Then fade in each bullet point with a staggered delay
            listItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                }, 300 + (index * 200)); // Start after 300ms, then 200ms for each point
            });
        }, 100);
    }
    
    // Function to add new news item at the top
    function addNewsItem(newsItem) {
        const newsContainer = document.querySelector('.bottom-row .card:first-child');
        if (!newsContainer) return;
        
        // Get or create news content div
        let newsContent = newsContainer.querySelector('.news-content');
        if (!newsContent) {
            newsContent = document.createElement('div');
            newsContent.className = 'news-content';
            newsContent.style.maxHeight = '280px';
            newsContent.style.overflowY = 'auto';
            newsContent.style.padding = '0 5px';
            newsContent.style.scrollbarWidth = 'thin';
            newsContent.style.scrollbarColor = '#888 #323232';
            newsContainer.appendChild(newsContent);
        }
        
        // Create new news item
        const newsElement = document.createElement('div');
        newsElement.className = 'news-item';
        newsElement.style.marginBottom = '15px';
        newsElement.style.borderBottom = '1px solid #444';
        newsElement.style.paddingBottom = '10px';
        newsElement.style.backgroundColor = '#323232';
        newsElement.style.padding = '10px';
        newsElement.style.borderRadius = '8px';
        newsElement.style.opacity = '0';
        newsElement.style.transition = 'opacity 0.7s ease-in-out';
        
        // Create metadata container
        const metaContainer = document.createElement('div');
        metaContainer.style.display = 'flex';
        metaContainer.style.alignItems = 'center';
        metaContainer.style.marginBottom = '6px';
        
        // Create category badge
        const category = document.createElement('span');
        category.className = 'news-category';
        category.textContent = newsItem.category;
        category.style.backgroundColor = 'rgb(205, 72, 43)';
        category.style.color = 'white';
        category.style.padding = '3px 8px';
        category.style.borderRadius = '4px';
        category.style.fontSize = '12px';
        category.style.marginRight = '10px';
        category.style.fontWeight = 'bold';
        
        // Create date element
        const date = document.createElement('span');
        date.className = 'news-date';
        date.textContent = newsItem.date;
        date.style.color = '#aaa';
        date.style.fontSize = '12px';
        date.style.fontWeight = '500';
        
        // Create title
        const title = document.createElement('h3');
        title.className = 'news-title';
        title.textContent = newsItem.title;
        title.style.fontSize = '16px';
        title.style.margin = '8px 0';
        title.style.color = 'white';
        title.style.fontWeight = 'bold';
        
        // Create content
        const content = document.createElement('p');
        content.className = 'news-content';
        content.textContent = newsItem.content;
        content.style.fontSize = '14px';
        content.style.color = '#ccc';
        content.style.lineHeight = '1.4';
        content.style.margin = '0';
        
        // Assemble the news item
        metaContainer.appendChild(category);
        metaContainer.appendChild(date);
        
        newsElement.appendChild(metaContainer);
        newsElement.appendChild(title);
        newsElement.appendChild(content);
        
        // Add to the top of the container
        if (newsContent.firstChild) {
            newsContent.insertBefore(newsElement, newsContent.firstChild);
        } else {
            newsContent.appendChild(newsElement);
        }
        
        // Track this item
        displayedNews.push(newsElement);
        
        // Remove oldest item if we exceed the limit
        if (displayedNews.length > maxItemsToShow) {
            const oldestItem = displayedNews.shift();
            // Fade out before removing
            oldestItem.style.opacity = '0';
            setTimeout(() => {
                if (oldestItem.parentNode) {
                    oldestItem.parentNode.removeChild(oldestItem);
                }
            }, 500);
        }
        
        // Fade in the new item
        setTimeout(() => {
            newsElement.style.opacity = '1';
        }, 100);
    }
    
    // Function to add a new pair of related content
    function addRelatedContent() {
        const currentItem = contentItems[currentItemIndex];
        
        // Add new items at the top of each section
        addAnalysisItem(currentItem.analysis);
        addNewsItem(currentItem.news);
        
        // Move to next item
        currentItemIndex = (currentItemIndex + 1) % contentItems.length;
    }
    
    // Add initial items (starting with 2)
    addRelatedContent(); // Add first item
    
    // Set a timeout to add the second item after 1 second
    setTimeout(() => {
        addRelatedContent();
        
        // Then set up the regular interval for additional items
        setInterval(addRelatedContent, 4000);
    }, 1000);
});

