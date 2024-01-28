async function search() {
    const itemInput = document.getElementById('itemInput');
    const resultsDiv = document.getElementById('results');
    const itemToSearch = itemInput.value.trim().toLowerCase();

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
        const trades = islandData.trades.some(trade => pluralize(trade.get.toLowerCase()) === itemToSearch || pluralize(trade.get.toLowerCase()) === pluralize(itemToSearch));
        const sells = islandData.sell.some(sell => pluralize(sell.itemrecieve.toLowerCase()) === itemToSearch || pluralize(sell.itemrecieve.toLowerCase()) === pluralize(itemToSearch));
        const publicItems = islandData.publicItems.some(item => pluralize(item.toLowerCase()) === itemToSearch || pluralize(item.toLowerCase()) === pluralize(itemToSearch));

        return trades || sells || publicItems;
    });

    // Display results
    const results = searchResults
        .map(({ island, data }) => {
            const islandData = data;

            // Filter trades where you receive the specified item
            const trades = islandData.trades
                .filter(trade => pluralize(trade.get.toLowerCase()) === itemToSearch || pluralize(trade.get.toLowerCase()) === pluralize(itemToSearch))
                .map(trade => `<span class="trade-info">${trade.villager_name} will sell you ${trade.receiveamount} ${trade.get} for ${trade.giveamount} ${trade.give} </span>`);

            // Display results, don't show empty arrays or empty strings
            return trades.length > 0 ? `<div class="island">
                                            <h2>${island}</h2>
                                            <h3>${trades.join('')}</h3>
                                        </div>` : '';
        });

    // Display search results
    resultsDiv.innerHTML = results.length === 0 ? '<p>No results found.</p>' : results.join('');
}
