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

    // Perform the exact search
    const searchResults = dataArray.filter(({ data }) => {
        const islandData = data;

        // Check if the specified item is present in trades, sells, or public items
        const trades = islandData.trades.some(trade => normalizeString(trade.get) === itemToSearch || normalizeString(trade.get) === normalizeString(itemToSearch));
        const sells = islandData.sell.some(sell => normalizeString(sell.itemrecieve) === itemToSearch || normalizeString(sell.itemrecieve) === normalizeString(itemToSearch));
        const publicItems = islandData.publicItems.some(item => normalizeString(item) === itemToSearch || normalizeString(item) === normalizeString(itemToSearch));

        return trades || sells || publicItems;
    });

    // Display results
    const results = searchResults
        .map(({ island, data }) => {
            const islandData = data;

            // Filter trades where you receive the specified item
            const trades = islandData.trades
                .filter(trade => normalizeString(trade.get) === itemToSearch || normalizeString(trade.get) === normalizeString(itemToSearch))
                .map(trade => `<span class="trade-info">${trade.villager_name} will sell you ${trade.receiveamount} ${trade.get} for ${trade.giveamount} ${trade.give}</span>`);

            // Filter sells where you receive the specified item
            const sells = islandData.sell
                .filter(sell => normalizeString(sell.itemrecieve) === itemToSearch || normalizeString(sell.itemrecieve) === normalizeString(itemToSearch))
                .map(sell => `<span class="trade-info"><br>${island} will sell you ${sell.item} for ${sell.price} ${sell.itemrecieve}</span>`);

            const publicItems = islandData.publicItems
                .filter(item => normalizeString(item) === itemToSearch || normalizeString(item) === normalizeString(itemToSearch))
                .map(item => `<span class="trade-info"><br>${item} is available for free</span>`);

            return `<div class="island-info"><h2>${island}</h2>${trades.join('')}${sells.join('')}${publicItems.join('')}</div>`;
        });

    // Display search results
    resultsDiv.innerHTML = results.length === 0 ? '<p>No results found.</p>' : results.join('');
}
