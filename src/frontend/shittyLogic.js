// Function to fetch and parse JSON data
async function fetchData() {
  try {
    // In a real application, this would be an API endpoint
    // For this example, we'll use a mock fetch that returns the JSON data
    const response = await fetch('../../assets/client_data.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    
    // For demonstration purposes, return the sample data from the error
    return {
      client: {
        fullName: "Failed to load client data",
        // Default fallback data
      }
    };
  }
}

// Function to format currency
function formatCurrency(value, currency = '€') {
  return `${currency}${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

// Function to format percentage
function formatPercentage(value) {
  const formattedValue = parseFloat(value).toFixed(2);
  return `${value >= 0 ? '+' : ''}${formattedValue}%`;
}

// Function to get HTML class based on performance
function getPerformanceClass(value) {
  return value >= 0 ? 'positive' : 'negative';
}

// Function to set up client information
function setupClientInfo(data) {
  const client = data.client;
  
  // Basic info
  document.getElementById('client-name').textContent = client.fullName;
  
  // Handle contact info that might be missing in the JSON
  const contactInfo = client.contact || {};
  document.getElementById('client-phone').textContent = contactInfo.phone || '+33 6 XX XX XX XX';
  document.getElementById('client-email').textContent = contactInfo.email || 'isabelle.dubois@example.com';
  document.getElementById('client-address').textContent = contactInfo.address || 'Paris, France';
  
  document.getElementById('risk-tolerance').textContent = client.preferences.riskTolerance;
  
  // Goals
  const goalsContainer = document.getElementById('goals-container');
  goalsContainer.innerHTML = '';
  client.preferences.goals.forEach(goal => {
    const goalTag = document.createElement('span');
    goalTag.className = 'tag';
    goalTag.textContent = goal;
    goalsContainer.appendChild(goalTag);
  });
  
  // Interests
  const interestsContainer = document.getElementById('interests-container');
  interestsContainer.innerHTML = '';
  client.preferences.interests.forEach(interest => {
    const interestTag = document.createElement('span');
    interestTag.className = 'tag';
    interestTag.textContent = interest;
    interestsContainer.appendChild(interestTag);
  });
  
  // Communication - using a placeholder since it might be missing
  const commPreference = client.preferences.communication ? 
    `${client.preferences.communication.preferredChannel || 'Email'}, 
     ${client.preferences.communication.frequency || 'Monthly'}, 
     ${client.preferences.communication.bestTime || 'Morning'}` :
    'Email, Monthly, Morning';
  
  document.getElementById('communication-pref').textContent = commPreference;
  
  // Call character
  document.getElementById('call-character').textContent = client.preferences.callCharacter;
}

// Function to set up portfolio summary
function setupPortfolioSummary(data) {
  const portfolio = data.portfolio;
  const performanceSummary = data.callContext.performanceSummary;
  
  document.getElementById('total-value').textContent = formatCurrency(portfolio.summary.totalValue);
  
  const ytdReturn = document.getElementById('ytd-return');
  ytdReturn.textContent = `${portfolio.summary.ytdReturn}%`;
  ytdReturn.className = `value ${getPerformanceClass(portfolio.summary.ytdReturn)}`;
  
  const benchmarkReturn = document.getElementById('benchmark-return');
  benchmarkReturn.textContent = performanceSummary.benchmarkReturn;
  benchmarkReturn.className = `value ${getPerformanceClass(parseFloat(performanceSummary.benchmarkReturn))}`;
  
  const drawdown = document.getElementById('drawdown');
  drawdown.textContent = `${portfolio.performance.drawdown}%`;
  drawdown.className = `value ${getPerformanceClass(portfolio.performance.drawdown)}`;
}

// Function to set up asset allocation
function setupAssetAllocation(data) {
  const allocation = data.portfolio.summary.assetAllocation;
  
  // Create pie chart with CSS conic gradient
  const chart = document.getElementById('allocation-chart');
  const stocksPercent = allocation.stocks;
  const bondsPercent = allocation.bonds;
  const altsPercent = allocation.alternatives;
  
  chart.style.background = `conic-gradient(
    var(--secondary) 0% ${stocksPercent}%, 
    var(--tertiary) ${stocksPercent}% ${stocksPercent + bondsPercent}%, 
    var(--warning) ${stocksPercent + bondsPercent}% 100%
  )`;
  
  // Create legend
  const legend = document.getElementById('allocation-legend');
  legend.innerHTML = '';
  
  const categories = [
    { name: 'Stocks', percent: stocksPercent, class: 'stocks' },
    { name: 'Bonds', percent: bondsPercent, class: 'bonds' },
    { name: 'Alt', percent: altsPercent, class: 'alternatives' }
  ];
  
  categories.forEach(category => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    
    const colorBox = document.createElement('div');
    colorBox.className = `color-box ${category.class}`;
    
    const label = document.createElement('span');
    label.textContent = `${category.name} (${category.percent}%)`;
    
    item.appendChild(colorBox);
    item.appendChild(label);
    legend.appendChild(item);
  });
}

// Function to set up market indices
function setupMarketIndices(data) {
  const indices = data.marketData.indices;
  const container = document.getElementById('indices-container');
  
  Object.entries(indices).forEach(([name, value]) => {
    const item = document.createElement('div');
    item.className = 'summary-item';
    
    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = name;
    
    const valueSpan = document.createElement('span');
    valueSpan.className = 'value';
    valueSpan.textContent = name === 'EU10Y' ? `${value}%` : value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    item.appendChild(label);
    item.appendChild(valueSpan);
    container.appendChild(item);
  });
}

// Function to set up economic indicators
function setupEconomicIndicators(data) {
  const indicators = data.marketData.economicIndicators;
  const container = document.getElementById('indicators-container');
  
  Object.entries(indicators).forEach(([name, value]) => {
    const item = document.createElement('div');
    item.className = 'summary-item';
    
    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    
    const valueSpan = document.createElement('span');
    valueSpan.className = 'value';
    valueSpan.textContent = `${value}%`;
    
    item.appendChild(label);
    item.appendChild(valueSpan);
    container.appendChild(item);
  });
}

// Function to set up holdings table
function setupHoldings(data) {
  const holdings = data.portfolio.holdings;
  const tableBody = document.querySelector('#holdings-table tbody');
  
  holdings.forEach(holding => {
    const row = document.createElement('tr');
    
    const nameCell = document.createElement('td');
    nameCell.textContent = holding.name;
    
    const symbolCell = document.createElement('td');
    symbolCell.textContent = holding.symbol;
    
    const sharesCell = document.createElement('td');
    sharesCell.textContent = holding.shares;
    
    const marketValueCell = document.createElement('td');
    marketValueCell.textContent = formatCurrency(holding.marketValue);
    
    const costBasisCell = document.createElement('td');
    costBasisCell.textContent = formatCurrency(holding.costBasis);
    
    const performanceCell = document.createElement('td');
    performanceCell.textContent = formatPercentage(holding.performance);
    performanceCell.className = getPerformanceClass(holding.performance);
    
    row.appendChild(nameCell);
    row.appendChild(symbolCell);
    row.appendChild(sharesCell);
    row.appendChild(marketValueCell);
    row.appendChild(costBasisCell);
    row.appendChild(performanceCell);
    
    tableBody.appendChild(row);
  });
}

// Function to set up performance chart
function setupPerformanceChart(data) {
  const historicalData = data.portfolio.performance.historicalData;
  const chartContainer = document.getElementById('performance-chart');
  
  // Find the maximum value for scaling
  const maxValue = Math.max(...historicalData.map(item => item.value));
  
  historicalData.forEach(item => {
    const height = (item.value / maxValue) * 180;
    
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${height}px`;
    
    const barValue = document.createElement('div');
    barValue.className = 'bar-value';
    barValue.textContent = formatCurrency(item.value);
    
    const barLabel = document.createElement('div');
    barLabel.className = 'bar-label';
    // Format date from YYYY-MM-DD to Month YYYY
    const date = new Date(item.date);
    barLabel.textContent = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    bar.appendChild(barValue);
    bar.appendChild(barLabel);
    chartContainer.appendChild(bar);
  });
}

// Function to set up transactions
function setupTransactions(data) {
  const transactions = data.portfolio.transactions;
  const tableBody = document.querySelector('#transactions-table tbody');
  
  transactions.forEach(transaction => {
    const row = document.createElement('tr');
    
    const dateCell = document.createElement('td');
    // Format date from YYYY-MM-DD to Month DD, YYYY
    const date = new Date(transaction.date);
    dateCell.textContent = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    const typeCell = document.createElement('td');
    typeCell.textContent = transaction.type;
    
    const symbolCell = document.createElement('td');
    symbolCell.textContent = transaction.symbol;
    
    const detailsCell = document.createElement('td');
    if (transaction.shares) {
      detailsCell.textContent = `${transaction.shares} shares`;
    } else if (transaction.amount) {
      detailsCell.textContent = formatCurrency(transaction.amount);
    }
    
    row.appendChild(dateCell);
    row.appendChild(typeCell);
    row.appendChild(symbolCell);
    row.appendChild(detailsCell);
    
    tableBody.appendChild(row);
  });
}

// Function to set up news
function setupNews(data) {
  const news = data.marketData.news;
  const container = document.getElementById('news-container');
  container.innerHTML = '';
  
  news.forEach(item => {
    const newsItem = document.createElement('div');
    newsItem.className = 'news-item';
    
    const newsLink = document.createElement('a');
    newsLink.className = 'news-title';
    newsLink.href = item.url;
    newsLink.target = '_blank';
    newsLink.textContent = item.title;
    
    newsItem.appendChild(newsLink);
    container.appendChild(newsItem);
  });
}

// Function to set up key contributors
function setupContributors(data) {
  const contributors = data.callContext.performanceSummary.keyContributors;
  const tableBody = document.querySelector('#contributors-table tbody');
  tableBody.innerHTML = '';
  
  contributors.forEach(contributor => {
    const row = document.createElement('tr');
    
    const symbolCell = document.createElement('td');
    symbolCell.textContent = contributor.symbol;
    
    const performanceCell = document.createElement('td');
    performanceCell.textContent = contributor.decline;
    performanceCell.className = 'negative';
    
    const reasonCell = document.createElement('td');
    reasonCell.textContent = contributor.reason;
    
    row.appendChild(symbolCell);
    row.appendChild(performanceCell);
    row.appendChild(reasonCell);
    
    tableBody.appendChild(row);
  });
}

// Function to set up recommendations
function setupRecommendations(data) {
  const recommendations = data.recommendations;
  
  document.getElementById('recommendation-rebalance').textContent = recommendations.rebalance;
  document.getElementById('recommendation-longterm').textContent = recommendations.longTermView;
  
  const strategiesContainer = document.getElementById('mitigation-strategies');
  strategiesContainer.innerHTML = '';
  
  recommendations.mitigationStrategies.forEach(strategy => {
    const item = document.createElement('li');
    item.textContent = strategy;
    strategiesContainer.appendChild(item);
  });
  
  document.getElementById('manager-actions').textContent = recommendations.managerActions;
}

// Function to set up next steps
function setupNextSteps() {
  document.getElementById('next-followup').textContent = 'Schedule quarterly review call in 3 months';
  document.getElementById('next-documents').textContent = 'Update investment policy statement';
}

// Function to set current date
function setupCurrentDate() {
  const dateElement = document.getElementById('current-date');
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateElement.textContent = new Date().toLocaleDateString('en-US', options);
}
