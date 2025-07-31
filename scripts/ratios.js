// Financial Ratios Calculator
class FinancialRatios {
    constructor() {
        this.ratios = {};
        this.thresholds = {
            currentRatio: { good: 1.5, average: 1.0, risky: 0.8 },
            quickRatio: { good: 1.0, average: 0.7, risky: 0.5 },
            debtToEquity: { good: 0.5, average: 1.0, risky: 2.0 },
            debtToAssets: { good: 0.4, average: 0.6, risky: 0.8 },
            equityMultiplier: { good: 1.5, average: 2.0, risky: 3.0 },
            workingCapital: { good: 0.2, average: 0.1, risky: 0.05 }
        };
    }

    calculateRatios(data) {
        if (!data) return {};

        const assets = data.assets || {};
        const liabilities = data.liabilities || {};
        const equity = data.equity || {};

        // Calculate key values
        const currentAssets = this.getCurrentAssets(assets);
        const currentLiabilities = this.getCurrentLiabilities(liabilities);
        const totalAssets = Object.values(assets).reduce((sum, val) => sum + val, 0);
        const totalLiabilities = Object.values(liabilities).reduce((sum, val) => sum + val, 0);
        const totalEquity = Object.values(equity).reduce((sum, val) => sum + val, 0);
        const inventory = assets['Inventory'] || 0;

        // Calculate ratios
        const ratios = {
            currentRatio: this.calculateCurrentRatio(currentAssets, currentLiabilities),
            quickRatio: this.calculateQuickRatio(currentAssets, inventory, currentLiabilities),
            debtToEquity: this.calculateDebtToEquity(totalLiabilities, totalEquity),
            debtToAssets: this.calculateDebtToAssets(totalLiabilities, totalAssets),
            equityMultiplier: this.calculateEquityMultiplier(totalAssets, totalEquity),
            workingCapitalRatio: this.calculateWorkingCapitalRatio(currentAssets, currentLiabilities, totalAssets),
            assetTurnover: this.calculateAssetTurnover(totalAssets),
            returnOnAssets: this.calculateReturnOnAssets(totalAssets),
            returnOnEquity: this.calculateReturnOnEquity(totalEquity),
            cashRatio: this.calculateCashRatio(assets['Cash & Cash Equivalents'] || 0, currentLiabilities),
            timesInterestEarned: this.calculateTimesInterestEarned(totalAssets, totalLiabilities),
            fixedAssetTurnover: this.calculateFixedAssetTurnover(assets['Fixed Assets'] || 0),
            inventoryTurnover: this.calculateInventoryTurnover(inventory),
            receivablesTurnover: this.calculateReceivablesTurnover(assets['Accounts Receivable'] || 0)
        };

        // Add status and descriptions
        Object.keys(ratios).forEach(ratio => {
            ratios[ratio] = {
                value: ratios[ratio],
                status: this.getRatioStatus(ratio, ratios[ratio]),
                description: this.getRatioDescription(ratio, ratios[ratio])
            };
        });

        this.ratios = ratios;
        return ratios;
    }

    getCurrentAssets(assets) {
        const currentAssetKeys = ['Cash & Cash Equivalents', 'Accounts Receivable', 'Inventory'];
        return currentAssetKeys.reduce((sum, key) => sum + (assets[key] || 0), 0);
    }

    getCurrentLiabilities(liabilities) {
        const currentLiabilityKeys = ['Accounts Payable', 'Short-term Debt'];
        return currentLiabilityKeys.reduce((sum, key) => sum + (liabilities[key] || 0), 0);
    }

    calculateCurrentRatio(currentAssets, currentLiabilities) {
        return currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    }

    calculateQuickRatio(currentAssets, inventory, currentLiabilities) {
        const quickAssets = currentAssets - inventory;
        return currentLiabilities > 0 ? quickAssets / currentLiabilities : 0;
    }

    calculateDebtToEquity(totalLiabilities, totalEquity) {
        return totalEquity > 0 ? totalLiabilities / totalEquity : 0;
    }

    calculateDebtToAssets(totalLiabilities, totalAssets) {
        return totalAssets > 0 ? totalLiabilities / totalAssets : 0;
    }

    calculateEquityMultiplier(totalAssets, totalEquity) {
        return totalEquity > 0 ? totalAssets / totalEquity : 0;
    }

    calculateWorkingCapitalRatio(currentAssets, currentLiabilities, totalAssets) {
        const workingCapital = currentAssets - currentLiabilities;
        return totalAssets > 0 ? workingCapital / totalAssets : 0;
    }

    calculateAssetTurnover(totalAssets) {
        // Assuming revenue is 2x total assets for demonstration
        const revenue = totalAssets * 2;
        return totalAssets > 0 ? revenue / totalAssets : 0;
    }

    calculateReturnOnAssets(totalAssets) {
        // Assuming net income is 10% of total assets for demonstration
        const netIncome = totalAssets * 0.1;
        return totalAssets > 0 ? (netIncome / totalAssets) * 100 : 0;
    }

    calculateReturnOnEquity(totalEquity) {
        // Assuming net income is 15% of total equity for demonstration
        const netIncome = totalEquity * 0.15;
        return totalEquity > 0 ? (netIncome / totalEquity) * 100 : 0;
    }

    calculateCashRatio(cash, currentLiabilities) {
        return currentLiabilities > 0 ? cash / currentLiabilities : 0;
    }

    calculateTimesInterestEarned(totalAssets, totalLiabilities) {
        // Assuming EBIT is 15% of total assets and interest is 5% of total liabilities
        const ebit = totalAssets * 0.15;
        const interest = totalLiabilities * 0.05;
        return interest > 0 ? ebit / interest : 0;
    }

    calculateFixedAssetTurnover(fixedAssets) {
        // Assuming revenue is 2x total assets
        const revenue = fixedAssets * 2;
        return fixedAssets > 0 ? revenue / fixedAssets : 0;
    }

    calculateInventoryTurnover(inventory) {
        // Assuming cost of goods sold is 1.5x inventory
        const cogs = inventory * 1.5;
        return inventory > 0 ? cogs / inventory : 0;
    }

    calculateReceivablesTurnover(receivables) {
        // Assuming revenue is 3x receivables
        const revenue = receivables * 3;
        return receivables > 0 ? revenue / receivables : 0;
    }

    getRatioStatus(ratioName, value) {
        const threshold = this.thresholds[ratioName];
        if (!threshold) return 'neutral';

        // For ratios where lower is better (debt ratios)
        if (ratioName.includes('debt') || ratioName.includes('Debt')) {
            if (value <= threshold.good) return 'good';
            if (value <= threshold.average) return 'average';
            return 'risky';
        }

        // For ratios where higher is better
        if (value >= threshold.good) return 'good';
        if (value >= threshold.average) return 'average';
        return 'risky';
    }

    getRatioDescription(ratioName, value) {
        const descriptions = {
            currentRatio: 'Measures the company\'s ability to pay short-term obligations with current assets.',
            quickRatio: 'More conservative measure of liquidity, excluding inventory from current assets.',
            debtToEquity: 'Shows the proportion of debt financing relative to equity financing.',
            debtToAssets: 'Indicates what portion of assets are financed by debt.',
            equityMultiplier: 'Measures financial leverage and the amount of assets financed by equity.',
            workingCapitalRatio: 'Shows the proportion of working capital to total assets.',
            assetTurnover: 'Measures how efficiently the company uses its assets to generate sales.',
            returnOnAssets: 'Shows how efficiently the company generates profit from its assets.',
            returnOnEquity: 'Measures the return generated on shareholders\' equity investment.',
            cashRatio: 'Most conservative liquidity ratio, using only cash and cash equivalents.',
            timesInterestEarned: 'Measures the company\'s ability to meet interest payments.',
            fixedAssetTurnover: 'Shows how efficiently fixed assets are used to generate sales.',
            inventoryTurnover: 'Measures how quickly inventory is sold and replaced.',
            receivablesTurnover: 'Shows how efficiently the company collects on credit sales.'
        };

        return descriptions[ratioName] || 'Financial ratio analysis metric.';
    }

    getSummaryStats(ratios) {
        const goodCount = Object.values(ratios).filter(r => r.status === 'good').length;
        const averageCount = Object.values(ratios).filter(r => r.status === 'average').length;
        const riskyCount = Object.values(ratios).filter(r => r.status === 'risky').length;
        const totalCount = Object.keys(ratios).length;

        return {
            total: totalCount,
            good: goodCount,
            average: averageCount,
            risky: riskyCount,
            healthScore: Math.round((goodCount / totalCount) * 100)
        };
    }
}

// Global ratios instance
const financialRatios = new FinancialRatios();

// Function to update ratios display
function updateRatios(data) {
    if (!data) return;

    const ratios = financialRatios.calculateRatios(data);
    const summaryStats = financialRatios.getSummaryStats(ratios);

    // Update ratios grid
    const ratiosGrid = document.getElementById('ratiosGrid');
    ratiosGrid.innerHTML = '';

    Object.entries(ratios).forEach(([ratioName, ratio]) => {
        const ratioCard = createRatioCard(ratioName, ratio);
        ratiosGrid.appendChild(ratioCard);
    });

    // Update summary stats
    updateSummaryStats(summaryStats);
}

function createRatioCard(ratioName, ratio) {
    const card = document.createElement('div');
    card.className = `ratio-card ${ratio.status}`;

    const formattedValue = ratio.value.toFixed(2);
    const statusText = ratio.status.charAt(0).toUpperCase() + ratio.status.slice(1);

    card.innerHTML = `
        <div class="ratio-header">
            <div class="ratio-name">${formatRatioName(ratioName)}</div>
            <div class="ratio-status ${ratio.status}">${statusText}</div>
        </div>
        <div class="ratio-value">${formattedValue}</div>
        <div class="ratio-description">${ratio.description}</div>
    `;

    return card;
}

function formatRatioName(ratioName) {
    return ratioName
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
}

function updateSummaryStats(stats) {
    const summaryStats = document.getElementById('summaryStats');
    
    summaryStats.innerHTML = `
        <div class="summary-stat">
            <div class="summary-stat-value">${stats.healthScore}%</div>
            <div class="summary-stat-label">Health Score</div>
        </div>
        <div class="summary-stat">
            <div class="summary-stat-value">${stats.good}</div>
            <div class="summary-stat-label">Good Ratios</div>
        </div>
        <div class="summary-stat">
            <div class="summary-stat-value">${stats.average}</div>
            <div class="summary-stat-label">Average Ratios</div>
        </div>
        <div class="summary-stat">
            <div class="summary-stat-value">${stats.risky}</div>
            <div class="summary-stat-label">Risky Ratios</div>
        </div>
    `;
}

// Export for global access
window.updateRatios = updateRatios;
window.financialRatios = financialRatios; 