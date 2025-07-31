// AI Insights Generator
class FinancialInsights {
    constructor() {
        this.insights = [];
        this.thresholds = {
            liquidity: { warning: 1.0, critical: 0.8 },
            leverage: { warning: 0.6, critical: 0.8 },
            profitability: { warning: 5, critical: 2 },
            efficiency: { warning: 1.5, critical: 1.0 }
        };
    }

    generateInsights(data, ratios) {
        if (!data || !ratios) return [];

        this.insights = [];
        
        // Calculate key metrics
        const totalAssets = Object.values(data.assets).reduce((sum, val) => sum + val, 0);
        const totalLiabilities = Object.values(data.liabilities).reduce((sum, val) => sum + val, 0);
        const totalEquity = Object.values(data.equity).reduce((sum, val) => sum + val, 0);
        const currentAssets = this.getCurrentAssets(data.assets);
        const currentLiabilities = this.getCurrentLiabilities(data.liabilities);

        // Generate insights based on different categories
        this.analyzeLiquidity(ratios, currentAssets, currentLiabilities);
        this.analyzeLeverage(ratios, totalLiabilities, totalEquity, totalAssets);
        this.analyzeProfitability(ratios);
        this.analyzeEfficiency(ratios);
        this.analyzeAssetStructure(data.assets, totalAssets);
        this.analyzeLiabilityStructure(data.liabilities, totalLiabilities);
        this.analyzeEquityStructure(data.equity, totalEquity);
        this.analyzeOverallHealth(ratios, totalAssets, totalLiabilities, totalEquity);

        return this.insights;
    }

    getCurrentAssets(assets) {
        const currentAssetKeys = ['Cash & Cash Equivalents', 'Accounts Receivable', 'Inventory'];
        return currentAssetKeys.reduce((sum, key) => sum + (assets[key] || 0), 0);
    }

    getCurrentLiabilities(liabilities) {
        const currentLiabilityKeys = ['Accounts Payable', 'Short-term Debt'];
        return currentLiabilityKeys.reduce((sum, key) => sum + (liabilities[key] || 0), 0);
    }

    analyzeLiquidity(ratios, currentAssets, currentLiabilities) {
        const currentRatio = ratios.currentRatio?.value || 0;
        const quickRatio = ratios.quickRatio?.value || 0;
        const cashRatio = ratios.cashRatio?.value || 0;

        if (currentRatio < this.thresholds.liquidity.critical) {
            this.addInsight('danger', '⚠️ Critical Liquidity Risk', 
                `Current ratio of ${currentRatio.toFixed(2)} indicates severe liquidity issues. The company may struggle to meet short-term obligations. Consider immediate action to improve cash flow and reduce short-term debt.`);
        } else if (currentRatio < this.thresholds.liquidity.warning) {
            this.addInsight('warning', '⚠️ Liquidity Warning', 
                `Current ratio of ${currentRatio.toFixed(2)} is below the recommended threshold of 1.5. Monitor cash flow closely and consider strategies to improve working capital.`);
        } else if (currentRatio > 2.0) {
            this.addInsight('success', '✅ Strong Liquidity Position', 
                `Current ratio of ${currentRatio.toFixed(2)} indicates excellent short-term financial health. The company has sufficient current assets to cover obligations.`);
        }

        if (quickRatio < 0.5) {
            this.addInsight('danger', '⚠️ Quick Ratio Alert', 
                `Quick ratio of ${quickRatio.toFixed(2)} is critically low. The company may face immediate cash flow problems if inventory cannot be quickly converted to cash.`);
        } else if (quickRatio < 1.0) {
            this.addInsight('warning', '⚠️ Quick Ratio Warning', 
                `Quick ratio of ${quickRatio.toFixed(2)} is below the recommended level. Consider reducing inventory levels or improving collection of receivables.`);
        }

        if (cashRatio < 0.2) {
            this.addInsight('warning', '⚠️ Cash Position Alert', 
                `Cash ratio of ${cashRatio.toFixed(2)} indicates limited immediate cash availability. Consider building cash reserves for operational flexibility.`);
        }
    }

    analyzeLeverage(ratios, totalLiabilities, totalEquity, totalAssets) {
        const debtToEquity = ratios.debtToEquity?.value || 0;
        const debtToAssets = ratios.debtToAssets?.value || 0;
        const equityMultiplier = ratios.equityMultiplier?.value || 0;

        if (debtToEquity > 2.0) {
            this.addInsight('danger', '⚠️ High Leverage Risk', 
                `Debt-to-equity ratio of ${debtToEquity.toFixed(2)} indicates excessive financial leverage. This increases financial risk and may limit future borrowing capacity.`);
        } else if (debtToEquity > 1.0) {
            this.addInsight('warning', '⚠️ Moderate Leverage', 
                `Debt-to-equity ratio of ${debtToEquity.toFixed(2)} is above the conservative threshold. Monitor debt levels and ensure adequate cash flow for debt service.`);
        } else if (debtToEquity < 0.3) {
            this.addInsight('success', '✅ Conservative Capital Structure', 
                `Debt-to-equity ratio of ${debtToEquity.toFixed(2)} indicates a conservative approach to financing. This provides financial flexibility but may limit growth opportunities.`);
        }

        if (debtToAssets > 0.7) {
            this.addInsight('danger', '⚠️ High Asset Leverage', 
                `Debt-to-assets ratio of ${debtToAssets.toFixed(2)} shows that over 70% of assets are financed by debt. This creates significant financial risk.`);
        }

        if (equityMultiplier > 3.0) {
            this.addInsight('warning', '⚠️ High Financial Leverage', 
                `Equity multiplier of ${equityMultiplier.toFixed(2)} indicates significant use of debt financing. While this can amplify returns, it also increases risk.`);
        }
    }

    analyzeProfitability(ratios) {
        const roa = ratios.returnOnAssets?.value || 0;
        const roe = ratios.returnOnEquity?.value || 0;

        if (roa < this.thresholds.profitability.critical) {
            this.addInsight('danger', '⚠️ Poor Asset Utilization', 
                `Return on Assets of ${roa.toFixed(1)}% is critically low. The company is not generating adequate returns from its asset base. Consider asset optimization strategies.`);
        } else if (roa < this.thresholds.profitability.warning) {
            this.addInsight('warning', '⚠️ Below-Average Asset Returns', 
                `Return on Assets of ${roa.toFixed(1)}% is below industry standards. Focus on improving operational efficiency and asset utilization.`);
        } else if (roa > 15) {
            this.addInsight('success', '✅ Excellent Asset Returns', 
                `Return on Assets of ${roa.toFixed(1)}% indicates superior asset utilization and operational efficiency.`);
        }

        if (roe < 5) {
            this.addInsight('danger', '⚠️ Poor Equity Returns', 
                `Return on Equity of ${roe.toFixed(1)}% is critically low. Shareholders are not receiving adequate returns on their investment.`);
        } else if (roe < 10) {
            this.addInsight('warning', '⚠️ Below-Average Equity Returns', 
                `Return on Equity of ${roe.toFixed(1)}% is below the recommended threshold. Focus on improving profitability and operational efficiency.`);
        } else if (roe > 20) {
            this.addInsight('success', '✅ Strong Equity Returns', 
                `Return on Equity of ${roe.toFixed(1)}% indicates excellent profitability and strong returns for shareholders.`);
        }
    }

    analyzeEfficiency(ratios) {
        const assetTurnover = ratios.assetTurnover?.value || 0;
        const inventoryTurnover = ratios.inventoryTurnover?.value || 0;
        const receivablesTurnover = ratios.receivablesTurnover?.value || 0;

        if (assetTurnover < this.thresholds.efficiency.critical) {
            this.addInsight('warning', '⚠️ Low Asset Efficiency', 
                `Asset turnover ratio of ${assetTurnover.toFixed(2)} indicates inefficient use of assets. Consider strategies to increase sales or reduce asset base.`);
        }

        if (inventoryTurnover < 2) {
            this.addInsight('warning', '⚠️ Slow Inventory Turnover', 
                `Inventory turnover of ${inventoryTurnover.toFixed(2)} suggests slow-moving inventory. Consider inventory management improvements to reduce carrying costs.`);
        }

        if (receivablesTurnover < 5) {
            this.addInsight('warning', '⚠️ Slow Collections', 
                `Receivables turnover of ${receivablesTurnover.toFixed(2)} indicates slow collection of credit sales. Implement stricter credit policies or collection procedures.`);
        }
    }

    analyzeAssetStructure(assets, totalAssets) {
        const cash = assets['Cash & Cash Equivalents'] || 0;
        const receivables = assets['Accounts Receivable'] || 0;
        const inventory = assets['Inventory'] || 0;
        const fixedAssets = assets['Fixed Assets'] || 0;

        const cashRatio = totalAssets > 0 ? cash / totalAssets : 0;
        const receivablesRatio = totalAssets > 0 ? receivables / totalAssets : 0;
        const inventoryRatio = totalAssets > 0 ? inventory / totalAssets : 0;
        const fixedAssetsRatio = totalAssets > 0 ? fixedAssets / totalAssets : 0;

        if (cashRatio < 0.1) {
            this.addInsight('warning', '⚠️ Low Cash Reserves', 
                `Cash represents only ${(cashRatio * 100).toFixed(1)}% of total assets. Consider building cash reserves for operational flexibility and emergency situations.`);
        } else if (cashRatio > 0.3) {
            this.addInsight('success', '✅ Strong Cash Position', 
                `Cash represents ${(cashRatio * 100).toFixed(1)}% of total assets, providing excellent liquidity and financial flexibility.`);
        }

        if (receivablesRatio > 0.25) {
            this.addInsight('warning', '⚠️ High Accounts Receivable', 
                `Accounts receivable represent ${(receivablesRatio * 100).toFixed(1)}% of total assets. Consider improving collection procedures to reduce credit risk.`);
        }

        if (inventoryRatio > 0.4) {
            this.addInsight('warning', '⚠️ High Inventory Levels', 
                `Inventory represents ${(inventoryRatio * 100).toFixed(1)}% of total assets. Consider inventory optimization strategies to reduce carrying costs.`);
        }

        if (fixedAssetsRatio > 0.7) {
            this.addInsight('warning', '⚠️ High Fixed Asset Concentration', 
                `Fixed assets represent ${(fixedAssetsRatio * 100).toFixed(1)}% of total assets. This may indicate capital-intensive operations with limited flexibility.`);
        }
    }

    analyzeLiabilityStructure(liabilities, totalLiabilities) {
        const accountsPayable = liabilities['Accounts Payable'] || 0;
        const shortTermDebt = liabilities['Short-term Debt'] || 0;
        const longTermDebt = liabilities['Long-term Debt'] || 0;

        const apRatio = totalLiabilities > 0 ? accountsPayable / totalLiabilities : 0;
        const shortTermRatio = totalLiabilities > 0 ? shortTermDebt / totalLiabilities : 0;
        const longTermRatio = totalLiabilities > 0 ? longTermDebt / totalLiabilities : 0;

        if (shortTermRatio > 0.5) {
            this.addInsight('danger', '⚠️ High Short-term Debt', 
                `Short-term debt represents ${(shortTermRatio * 100).toFixed(1)}% of total liabilities. This creates significant refinancing risk and cash flow pressure.`);
        }

        if (longTermRatio > 0.7) {
            this.addInsight('warning', '⚠️ High Long-term Debt', 
                `Long-term debt represents ${(longTermRatio * 100).toFixed(1)}% of total liabilities. Monitor debt service requirements and interest rate exposure.`);
        }

        if (apRatio > 0.4) {
            this.addInsight('warning', '⚠️ High Accounts Payable', 
                `Accounts payable represent ${(apRatio * 100).toFixed(1)}% of total liabilities. While this provides interest-free financing, it may strain supplier relationships.`);
        }
    }

    analyzeEquityStructure(equity, totalEquity) {
        const commonStock = equity['Common Stock'] || 0;
        const retainedEarnings = equity['Retained Earnings'] || 0;

        const stockRatio = totalEquity > 0 ? commonStock / totalEquity : 0;
        const retainedRatio = totalEquity > 0 ? retainedEarnings / totalEquity : 0;

        if (retainedRatio < 0.3) {
            this.addInsight('warning', '⚠️ Low Retained Earnings', 
                `Retained earnings represent only ${(retainedRatio * 100).toFixed(1)}% of total equity. This may limit internal financing capacity for future growth.`);
        } else if (retainedRatio > 0.7) {
            this.addInsight('success', '✅ Strong Retained Earnings', 
                `Retained earnings represent ${(retainedRatio * 100).toFixed(1)}% of total equity, providing strong internal financing capacity for future investments.`);
        }

        if (stockRatio > 0.8) {
            this.addInsight('warning', '⚠️ High Paid-in Capital', 
                `Common stock represents ${(stockRatio * 100).toFixed(1)}% of total equity. This may indicate reliance on external financing rather than internal growth.`);
        }
    }

    analyzeOverallHealth(ratios, totalAssets, totalLiabilities, totalEquity) {
        const goodRatios = Object.values(ratios).filter(r => r.status === 'good').length;
        const totalRatios = Object.keys(ratios).length;
        const healthScore = Math.round((goodRatios / totalRatios) * 100);

        if (healthScore >= 80) {
            this.addInsight('success', '✅ Excellent Financial Health', 
                `Overall financial health score of ${healthScore}% indicates strong financial position across all key metrics. The company demonstrates excellent financial management.`);
        } else if (healthScore >= 60) {
            this.addInsight('success', '✅ Good Financial Health', 
                `Overall financial health score of ${healthScore}% indicates solid financial position with room for improvement in specific areas.`);
        } else if (healthScore >= 40) {
            this.addInsight('warning', '⚠️ Moderate Financial Health', 
                `Overall financial health score of ${healthScore}% indicates areas of concern that require attention. Focus on improving key financial metrics.`);
        } else {
            this.addInsight('danger', '⚠️ Poor Financial Health', 
                `Overall financial health score of ${healthScore}% indicates significant financial challenges. Immediate action is required to address multiple areas of concern.`);
        }

        // Balance sheet equation check
        const balanceCheck = Math.abs(totalAssets - (totalLiabilities + totalEquity));
        const balancePercentage = totalAssets > 0 ? (balanceCheck / totalAssets) * 100 : 0;

        if (balancePercentage > 5) {
            this.addInsight('danger', '⚠️ Balance Sheet Imbalance', 
                `Significant imbalance detected in balance sheet equation. Assets = $${totalAssets.toLocaleString()}, Liabilities + Equity = $${(totalLiabilities + totalEquity).toLocaleString()}. Verify data accuracy.`);
        }
    }

    addInsight(type, title, description) {
        this.insights.push({
            type: type,
            title: title,
            description: description,
            timestamp: new Date().toISOString()
        });
    }

    getInsightsSummary() {
        const summary = {
            total: this.insights.length,
            success: this.insights.filter(i => i.type === 'success').length,
            warning: this.insights.filter(i => i.type === 'warning').length,
            danger: this.insights.filter(i => i.type === 'danger').length
        };

        summary.healthScore = summary.total > 0 ? 
            Math.round(((summary.success * 2) + summary.warning) / (summary.total * 2) * 100) : 0;

        return summary;
    }
}

// Global insights instance
const financialInsights = new FinancialInsights();

// Function to update insights display
function updateInsights(data) {
    if (!data) return;

    // Get ratios if available
    const ratios = window.financialRatios ? window.financialRatios.calculateRatios(data) : {};
    
    // Generate insights
    const insights = financialInsights.generateInsights(data, ratios);
    const summary = financialInsights.getInsightsSummary();

    // Update insights content
    const insightsContent = document.getElementById('insightsContent');
    insightsContent.innerHTML = '';

    if (insights.length === 0) {
        insightsContent.innerHTML = `
            <div class="insight-item">
                <div class="insight-header">
                    <span class="insight-icon">ℹ️</span>
                    <span class="insight-title">No Data Available</span>
                </div>
                <div class="insight-description">
                    Please upload or enter balance sheet data to generate insights.
                </div>
            </div>
        `;
        return;
    }

    // Add insights with animation delay
    insights.forEach((insight, index) => {
        setTimeout(() => {
            const insightElement = createInsightElement(insight);
            insightsContent.appendChild(insightElement);
        }, index * 200);
    });

    // Update AI info
    const aiInfo = document.querySelector('.ai-info p');
    if (aiInfo) {
        aiInfo.textContent = `Analysis complete: ${summary.total} insights generated (${summary.success} positive, ${summary.warning} warnings, ${summary.danger} critical).`;
    }
}

function createInsightElement(insight) {
    const element = document.createElement('div');
    element.className = `insight-item ${insight.type}`;

    element.innerHTML = `
        <div class="insight-header">
            <span class="insight-icon">${getInsightIcon(insight.type)}</span>
            <span class="insight-title">${insight.title}</span>
        </div>
        <div class="insight-description">${insight.description}</div>
    `;

    return element;
}

function getInsightIcon(type) {
    const icons = {
        success: '✅',
        warning: '⚠️',
        danger: '🚨',
        neutral: 'ℹ️'
    };
    return icons[type] || icons.neutral;
}

// Export for global access
window.updateInsights = updateInsights;
window.financialInsights = financialInsights; 