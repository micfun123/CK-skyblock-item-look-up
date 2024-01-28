async function search() {
    const itemInput = document.getElementById('itemInput');
    const resultsDiv = document.getElementById('results');
    const itemToSearch = itemInput.value.toLowerCase();

    // Load data from JSON file
    const response = await fetch('islandsData.json');
    const islandsData = await response.json();

    // Clear previous results
    resultsDiv.innerHTML = '';

    // Search through the data
    const results = Object.entries(islandsData)
        .filter(([island, data]) => {
            const islandData = data;
            const trades = islandData.trades.filter(trade => trade.give.toLowerCase() === itemToSearch);
            const sells = islandData.sell.filter(sell => sell.itemrecieve.toLowerCase() === itemToSearch);
            const publicItems = islandData.publicItems.map(item => item.toLowerCase());
            const isItemPublic = publicItems.includes(itemToSearch.toLowerCase());
            return trades.length > 0 || sells.length > 0 || isItemPublic;
        })
        .map(([island, data]) => {
            const islandData = data;
            const trades = islandData.trades
                .filter(trade => trade.get.toLowerCase() === itemToSearch)
                .map(trade => `<span class="trade-info">${trade.villager_name} will sell you ${trade.receiveamount} ${trade.get} for ${trade.giveamount} ${trade.give} </span>`);

            const sells = islandData.sell
                .filter(sell => sell.itemrecieve.toLowerCase() === itemToSearch)
                .map(sell => `<span class="sell-info">${sell.price} ${sell.item}</span> can be sold for <span class="sell-info">${sell.itemrecieve}</span>`);

            const publicItems = islandData.publicItems.map(item => item.toLowerCase());
            const isItemPublic = publicItems.includes(itemToSearch.toLowerCase());
            const publicItemsInfo = isItemPublic ? `<span class="sell-info">${itemToSearch}</span> is available in a public area` : '';

            // Display results dont show empty arrays or empty strings
            return `<div class="island">
                        <h2>${island}</h2>
                        ${trades.length > 0 ? trades.join('') : ''}
                        ${sells.length > 0 ? sells.join('') : ''}
                        ${publicItemsInfo}
                    </div>`;
            
        });

    // Display results
    resultsDiv.innerHTML = results.length === 0 ? '<p>No results found.</p>' : results.join('');
}
