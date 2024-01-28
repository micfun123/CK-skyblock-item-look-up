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
        threshold: 0.5,
        ignoreFieldNorm: true,
        useExtendedSearch: true,
        minMatchCharLength: 2,
        findAllMatches: true,
        isCaseSensitive: false,
        includeMatches: true,
        shouldSort: true,
        includeScore: true,
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
    const filteredResults = searchResults.filter(result => result.score <= 0.3);


    // Display results
    const results = filteredResults
        .map(({ item }) => {
            const island = item.island;
            const islandData = item.data;

            const trades = islandData.trades
                .filter(trade => normalizeString(trade.get).includes(itemToSearch) || normalizeString(trade.get) === normalizeString(itemToSearch))
                .map(trade => `<span class="trade-info">${trade.villager_name} will sell you ${trade.receiveamount} ${trade.get} for ${trade.giveamount} ${trade.give}</span>`);


            const sells = islandData.sell
                .filter(sell => normalizeString(sell.itemrecieve).includes(itemToSearch) || normalizeString(sell.itemrecieve) === normalizeString(itemToSearch))
                .map(sell => `<span class="trade-info"><br>${island} will sell you ${sell.item} for ${sell.price} ${sell.itemrecieve}</span>`);


            const publicItems = islandData.publicItems
                .filter(item => normalizeString(item).includes(itemToSearch) || normalizeString(item) === normalizeString(itemToSearch))
                .map(item => `<span class="trade-info"><br>${item} is available for free</span>`);
            

            return `<div class="island-info"><h2>${island}</h2>${trades.join('')}${sells.join('')}${publicItems.join('')}</div>`;
        });

    // Display search results
    resultsDiv.innerHTML = results.length === 0 ? '<p>No results found.</p>' : results.join('');
}