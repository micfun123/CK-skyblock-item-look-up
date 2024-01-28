async function search() {
    const itemInput = document.getElementById('itemInput');
    const resultsDiv = document.getElementById('results');
    const itemToSearch = itemInput.value.trim().toLowerCase();

    // Load data from JSON file
    const response = await fetch('islandsData.json');
    const islandsData = await response.json();

    // Clear previous results
    resultsDiv.innerHTML = '';

    // Convert islandData to an array for fuzzy search
    const dataArray = Object.entries(islandsData).map(([island, data]) => ({ island, data }));

    // Create a new Fuse instance with options
    const fuse = new Fuse(dataArray, {
        keys: ['data.trades.get', 'data.sell.itemrecieve', 'data.publicItems'],
        includeScore: true,
        threshold: 0.1, // Adjust the threshold as needed
    });

    // Perform the fuzzy search
    const searchResults = fuse.search(itemToSearch);

    // Display results
    const results = searchResults
        .filter(result => result.score < 0.1) // Adjust the threshold here as well
        .map(({ item, score }) => {
            const islandData = item.data;
            const trades = islandData.trades
                .map(trade => `<span class="trade-info">${trade.villager_name} will sell you ${trade.receiveamount} ${trade.get} for ${trade.giveamount} ${trade.give} </span>`);

            const sells = islandData.sell
                .map(sell => `<span class="sell-info">${sell.price} ${sell.item}</span> can be sold for <span class="sell-info">${sell.itemrecieve}</span>`);

            const publicItems = islandData.publicItems.map(item => `<span class="sell-info">${item}</span>`);
            const publicItemsInfo = publicItems.length > 0 ? publicItems.join(' is available in a public area, ') + ' is available in a public area' : '';

            // Display results, don't show empty arrays or empty strings
            return `<div class="island">
                        <h2>${item.island}</h2>
                        <h3>
                        ${trades.length > 0 ? trades.join('') : ''}
                        ${sells.length > 0 ? sells.join('') : ''}
                        ${publicItemsInfo}</h3>
                    </div>`;
        });

    // Display search results
    resultsDiv.innerHTML = results.length === 0 ? '<p>No results found.</p>' : results.join('');
}
