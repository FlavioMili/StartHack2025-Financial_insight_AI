// Initialize the dashboard
async function initDashboard() {
  try {
    const data = await fetchData();
    
    // Set up all components
    setupCurrentDate();
    setupClientInfo(data);
    setupPortfolioSummary(data);
    setupAssetAllocation(data);
    setupMarketIndices(data);
    setupEconomicIndicators(data);
    setupHoldings(data);
    setupPerformanceChart(data);
    setupTransactions(data);
    setupNews(data);
    setupContributors(data);
    setupRecommendations(data);
    setupNextSteps();
    
    // Add animations
    animateElements();
    
  } catch (error) {
    console.error('Error initializing dashboard:', error);
  }
}

// Add some animations and visual enhancements
function animateElements() {
  // Animate cards
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 * index);
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initDashboard);