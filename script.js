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
            const trades = islandData.trades.filter(trade => trade.get.toLowerCase() === itemToSearch);
            const sells = islandData.sell.filter(sell => sell.itemrecieve.toLowerCase() === itemToSearch);
            return trades.length > 0 || sells.length > 0;
        })
        
        .map(([island, data]) => {
            const islandData = data;
            const trades = islandData.trades
                .filter(trade => trade.get.toLowerCase() === itemToSearch)
                .map(trade => `<span class="trade-info">${trade.villager_name} offers ${trade.giveamount} ${trade.give} for ${trade.receiveamount} ${trade.get}</span>`);
        
            const sells = islandData.sell
                .filter(sell => sell.itemrecieve.toLowerCase() === itemToSearch)
                .map(sell => `<span class="sell-info">${sell.price} ${sell.item}</span> can be sold for <span class="sell-info">${sell.itemrecieve}</span>`);
        
            const publicItems = islandData.publicItems.map(item => item.toLowerCase());
            const isItemPublic = publicItems.includes(itemToSearch);
        
            const publicItemsInfo = isItemPublic ? `<span class="sell-info">${itemToSearch}</span> are available in a public area` : '';
        
            return `<p>${island} Trades: ${trades.join('. ')}<br>Sells: ${sells.join(', ')}. <br> ${publicItemsInfo}</p>`;
        });

    // Display results
    resultsDiv.innerHTML = results.length === 0 ? '<p>No results found.</p>' : results.join('');
}
