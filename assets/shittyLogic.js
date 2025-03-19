// Function to fetch and parse JSON data
async function fetchData() {
  try {
    // In a real application, this would be an API endpoint
    // For this example, we'll use a mock fetch that returns the JSON data
    const response = await fetch('client-data.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    
    // For demonstration purposes, return the sample data
    // In a real application, you'd handle the error appropriately
    return {
      "client": {
        "fullName": "Isabelle Dubois",
        "contact": {
          "phone": "+33-6-12-34-56-78",
          "email": "isabelle.dubois@example.com",
          "address": "15 Rue de Rivoli, Paris, France"
        },
        "preferences": {
          "riskTolerance": "Moderate",
          "goals": ["Retirement (10 years)", "Children's University Funds"],
          "interests": ["Art History", "Sustainable Investments"],
          "communication": {
            "preferredChannel": "Email",
            "frequency": "Quarterly",
            "bestTime": "Morning"
          },
          "callCharacter": "Analytical and Proactive"
        }
      },
      "portfolio": {
        "summary": {
          "totalValue": 850000.00,
          "ytdReturn": -4.2,
          "assetAllocation": {
            "stocks": 60,
            "bonds": 30,
            "alternatives": 10
          }
        },
        "holdings": [
          {
            "symbol": "ASML.AS",
            "name": "ASML Holding NV",
            "shares": 150,
            "marketValue": 105000.00,
            "costBasis": 110000.00,
            "performance": -4.55
          },
          {
            "symbol": "NOVO-B.CO",
            "name": "Novo Nordisk A/S",
            "shares": 200,
            "marketValue": 120000.00,
            "costBasis": 128000.00,
            "performance": -6.25
          },
          {
            "symbol": "DBXN.DE",
            "name": "Xtrackers II EUR Govt Bond 10Y",
            "shares": 800,
            "marketValue": 81600.00,
            "costBasis": 80000.00,
            "performance": 2.00
          }
        ],
        "performance": {
          "ytdReturn": -4.2,
          "historicalData": [
            {"date": "2023-01-01", "value": 900000.00},
            {"date": "2023-07-01", "value": 880000.00},
            {"date": "2024-01-01", "value": 850000.00}
          ],
          "drawdown": -5.5
        },
        "transactions": [
          {"date":"2024-02-20", "type":"Sell", "symbol":"NOVO-B.CO", "shares":50},
          {"date":"2024-01-15", "type":"Dividend", "symbol":"ASML.AS", "amount":1200.00}
        ]
      },
      "marketData": {
        "indices": {
          "CAC40": 7500.00,
          "DAX": 16800.00,
          "EU10Y": 3.05
        },
        "news": [
          {
            "title": "Semiconductor Sector Faces Supply Chain Disruptions",
            "url": "https://example.com/semiconductor-news"
          },
          {
            "title": "Pharmaceutical Sector Under Pressure from Pricing Concerns",
            "url": "https://example.com/pharma-news"
          },
          {
            "title":"Eurozone inflation stubbornly high, ECB policy under scrutiny",
            "url":"https://example.com/eurozone-inflation"
          }
        ],
        "economicIndicators": {
          "inflation": 3.2,
          "interestRate": 4.0,
          "gdpGrowth": 1.5
        }
      },
      "callContext": {
        "performanceSummary": {
          "portfolioReturn": "-4.2%",
          "benchmarkReturn": "-2.5%",
          "keyContributors": [
            {"symbol": "ASML.AS", "decline": "-4.55%", "reason": "Supply chain issues, market volatility"},
            {"symbol": "NOVO-B.CO", "decline": "-6.25%", "reason": "Pricing pressures, competition"}
          ]
        },
        "recommendations": {
          "rebalance": "Consider rebalancing to reduce exposure to ASML.AS and NOVO-B.CO, and potentially increase bond or defensive sector allocation.",
          "longTermView": "Reiterate the 10-year retirement goal and the importance of staying focused on long-term objectives despite short-term fluctuations.",
          "mitigationStrategies": [
            "Explore diversifying into sustainable energy or infrastructure sectors.", 
            "Review NOVO-B.CO position for long-term growth potential."
          ],
          "managerActions":"Portfolio was rebalanced in February, reducing NOVO-B.CO exposure. Further review of the semiconductor sector is required."
        },
        "nextSteps": {
          "followUp": "Schedule a detailed portfolio review in three weeks to discuss potential adjustments and market outlook.",
          "documentVault": "Provide updated portfolio analysis and market commentary, emphasizing sustainable investment opportunities."
        }
      }
    };
  }
}

// Function to format currency
function formatCurrency(value, currency = 'Û') {
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
  document.getElementById('client-phone').textContent = client.contact.phone;
  document.getElementById('client-email').textContent = client.contact.email;
  document.getElementById('client-address').textContent = client.contact.address;
  document.getElementById('risk-tolerance').textContent = client.preferences.riskTolerance;
  
  // Goals
  const goalsContainer = document.getElementById('goals-container');
  client.preferences.goals.forEach(goal => {
    const goalTag = document.createElement('span');
    goalTag.className = 'tag';
    goalTag.textContent = goal;
    goalsContainer.appendChild(goalTag);
  });
  
  // Interests
  const interestsContainer = document.getElementById('interests-container');
  client.preferences.interests.forEach(interest => {
    const interestTag = document.createElement('span');
    interestTag.className = 'tag';
    interestTag.textContent = interest;
    interestsContainer.appendChild(interestTag);
  });
  
  // Communication
  const commPrefs = `${client.preferences.communication.preferredChannel}, 
                     ${client.preferences.communication.frequency}, 
                     ${client.preferences.communication.bestTime}`;
  document.getElementById('communication-pref').textContent = commPrefs;
  
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
