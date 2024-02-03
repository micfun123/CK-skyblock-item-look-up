// Basic function for case-insensitive comparison
function normalizeString(str) {
    return str.toLowerCase();
}

async function search() {
    const itemInput = document.getElementById('itemInput');
    const resultsDiv = document.getElementById('results');
    const itemToSearch = normalizeString(itemInput.value.trim());

    // Load data from JSON file
    const response = await fetch('islandsData.json');
    const islandsData = await response.json();

    // Clear previous results
    resultsDiv.innerHTML = '';

    // Convert islandData to an array for exact search
    const dataArray = Object.entries(islandsData).map(([island, data]) => ({ island, data }));

    // Create a new Fuse instance with your data
    const fuse = new Fuse(dataArray, {
        keys: ['data.trades.get', 'data.sell.itemrecieve', 'data.publicItems'],
        includeScore: true,
        threshold: 0.4,
        ignoreFieldNorm: true, // Ignore field length when scoring (i.e. treat "a" and "ab" as equally close)
        findAllMatches: true, // Search everywhere in the text, not just at the beginning
        isCaseSensitive: false, // Don't care about case
        includeMatches: true, // Include the matches in the result
        shouldSort: true, // Sort the results by score
        tokenize: true, // Split the search query into individual search terms 
        keys: [
            {
                name: 'data.trades.get'
            },
            {
                name: 'data.sell.itemrecieve'
            },
            {
                name: 'data.publicItems'
            }
        ]
    });
    const searchResults = fuse.search(itemToSearch);

    // Filter out results with a score higher than the threshold
    const filteredResults = searchResults.filter(({ score }) => score <= 0.3);


    // Display results
    const results = filteredResults
    .map(({ item }) => {
        const island = item.island;
        const islandData = item.data;

        const trades = islandData.trades
            .filter(trade => {
                const normalizedGet = normalizeString(trade.get);
                return normalizedGet.includes(itemToSearch) || normalizedGet === itemToSearch;
            })
            .map(trade => `<span class="trade-info">${trade.villager_name} will sell you ${trade.receiveamount} ${trade.get} for ${trade.giveamount} ${trade.give} </span>`);

        const sells = islandData.sell
            .filter(sell => {
                const normalizedItemReceive = normalizeString(sell.itemrecieve);
                return normalizedItemReceive.includes(itemToSearch) || normalizedItemReceive === itemToSearch;
            })
            .map(sell => `<span class="trade-info"><br>${island} will sell you ${sell.item} for ${sell.price} ${sell.itemrecieve}</span>`);

        const publicItems = islandData.publicItems
            .filter(item => normalizeString(item).includes(itemToSearch) || normalizeString(item) === itemToSearch)
            .map(item => `<span class="trade-info"><br>${item} is available for free</span>`);

        // Check if there are any matching item names before displaying the island name
        if (trades.length > 0 || sells.length > 0 || publicItems.length > 0) {
            return `<div class="island-info"><h2>${island}</h2>${trades.join('<br> ')}<br>${sells.join('<br> ')}<br>${publicItems.join('<br> ')}</div>`;
        } else {
            return ''; // If no matching item names, return an empty string
        }
    });


    // Display search results
    resultsDiv.innerHTML = results.length === 0 ? '<p>No results found.</p>' : results.join('');
}