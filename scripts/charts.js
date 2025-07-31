// Charts Module using Chart.js
class BalanceSheetCharts {
    constructor() {
        this.charts = {};
        this.chartColors = {
            primary: '#2563eb',
            secondary: '#64748b',
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444',
            info: '#06b6d4',
            light: '#f1f5f9',
            dark: '#1e293b'
        };
    }

    updateCharts(data) {
        if (!data) return;

        this.createPieChart(data);
        this.createBarChart(data);
        this.createLineChart(data);
    }

    createPieChart(data) {
        const ctx = document.getElementById('pieChart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.charts.pieChart) {
            this.charts.pieChart.destroy();
        }

        const totalAssets = Object.values(data.assets).reduce((sum, val) => sum + val, 0);
        const totalLiabilities = Object.values(data.liabilities).reduce((sum, val) => sum + val, 0);
        const totalEquity = Object.values(data.equity).reduce((sum, val) => sum + val, 0);

        const chartData = {
            labels: ['Assets', 'Liabilities', 'Equity'],
            datasets: [{
                data: [totalAssets, totalLiabilities, totalEquity],
                backgroundColor: [
                    this.chartColors.success,
                    this.chartColors.danger,
                    this.chartColors.primary
                ],
                borderColor: [
                    this.chartColors.success,
                    this.chartColors.danger,
                    this.chartColors.primary
                ],
                borderWidth: 2,
                hoverBackgroundColor: [
                    this.chartColors.success + '80',
                    this.chartColors.danger + '80',
                    this.chartColors.primary + '80'
                ]
            }]
        };

        const config = {
            type: 'pie',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary'),
                            font: {
                                size: 12
                            },
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: $${value.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true
                }
            }
        };

        this.charts.pieChart = new Chart(ctx, config);
    }

    createBarChart(data) {
        const ctx = document.getElementById('barChart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.charts.barChart) {
            this.charts.barChart.destroy();
        }

        const assetItems = Object.entries(data.assets);
        const liabilityItems = Object.entries(data.liabilities);
        const equityItems = Object.entries(data.equity);

        const labels = [
            ...assetItems.map(([item]) => item),
            ...liabilityItems.map(([item]) => item),
            ...equityItems.map(([item]) => item)
        ];

        const assetValues = assetItems.map(([, value]) => value);
        const liabilityValues = liabilityItems.map(([, value]) => value);
        const equityValues = equityItems.map(([, value]) => value);

        const chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Assets',
                    data: [...assetValues, ...new Array(liabilityItems.length + equityItems.length).fill(0)],
                    backgroundColor: this.chartColors.success,
                    borderColor: this.chartColors.success,
                    borderWidth: 1
                },
                {
                    label: 'Liabilities',
                    data: [...new Array(assetItems.length).fill(0), ...liabilityValues, ...new Array(equityItems.length).fill(0)],
                    backgroundColor: this.chartColors.danger,
                    borderColor: this.chartColors.danger,
                    borderWidth: 1
                },
                {
                    label: 'Equity',
                    data: [...new Array(assetItems.length + liabilityItems.length).fill(0), ...equityValues],
                    backgroundColor: this.chartColors.primary,
                    borderColor: this.chartColors.primary,
                    borderWidth: 1
                }
            ]
        };

        const config = {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary'),
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = context.parsed.y;
                                return `${label}: $${value.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
                            font: {
                                size: 10
                            },
                            maxRotation: 45
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                        }
                    },
                    y: {
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                        }
                    }
                },
                animation: {
                    duration: 1000
                }
            }
        };

        this.charts.barChart = new Chart(ctx, config);
    }

    createLineChart(data) {
        const ctx = document.getElementById('lineChart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.charts.lineChart) {
            this.charts.lineChart.destroy();
        }

        // Generate historical data for trend analysis
        const years = [data.fiscalYear - 2, data.fiscalYear - 1, data.fiscalYear];
        const totalAssets = Object.values(data.assets).reduce((sum, val) => sum + val, 0);
        const totalLiabilities = Object.values(data.liabilities).reduce((sum, val) => sum + val, 0);
        const totalEquity = Object.values(data.equity).reduce((sum, val) => sum + val, 0);

        // Simulate historical trends
        const assetTrend = [
            totalAssets * 0.8,
            totalAssets * 0.9,
            totalAssets
        ];

        const liabilityTrend = [
            totalLiabilities * 0.85,
            totalLiabilities * 0.92,
            totalLiabilities
        ];

        const equityTrend = [
            totalEquity * 0.75,
            totalEquity * 0.88,
            totalEquity
        ];

        const chartData = {
            labels: years,
            datasets: [
                {
                    label: 'Total Assets',
                    data: assetTrend,
                    borderColor: this.chartColors.success,
                    backgroundColor: this.chartColors.success + '20',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Total Liabilities',
                    data: liabilityTrend,
                    borderColor: this.chartColors.danger,
                    backgroundColor: this.chartColors.danger + '20',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Total Equity',
                    data: equityTrend,
                    borderColor: this.chartColors.primary,
                    backgroundColor: this.chartColors.primary + '20',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }
            ]
        };

        const config = {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary'),
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = context.parsed.y;
                                return `${label}: $${value.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                        }
                    },
                    y: {
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                        }
                    }
                },
                animation: {
                    duration: 1500
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        };

        this.charts.lineChart = new Chart(ctx, config);
    }

    // Method to update chart colors based on theme
    updateChartColors() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        // Update chart colors based on theme
        if (isDark) {
            this.chartColors = {
                primary: '#3b82f6',
                secondary: '#94a3b8',
                success: '#10b981',
                warning: '#f59e0b',
                danger: '#ef4444',
                info: '#06b6d4',
                light: '#334155',
                dark: '#1e293b'
            };
        } else {
            this.chartColors = {
                primary: '#2563eb',
                secondary: '#64748b',
                success: '#10b981',
                warning: '#f59e0b',
                danger: '#ef4444',
                info: '#06b6d4',
                light: '#f1f5f9',
                dark: '#1e293b'
            };
        }

        // Recreate charts with new colors if data exists
        if (window.balanceSheetApp && window.balanceSheetApp.currentData) {
            this.updateCharts(window.balanceSheetApp.currentData);
        }
    }

    // Method to export charts as images
    exportChartAsImage(chartType) {
        const chart = this.charts[chartType];
        if (!chart) return null;

        return chart.toBase64Image();
    }

    // Method to get chart data for export
    getChartData(chartType) {
        const chart = this.charts[chartType];
        if (!chart) return null;

        return {
            labels: chart.data.labels,
            datasets: chart.data.datasets
        };
    }

    // Method to destroy all charts
    destroyCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    }
}

// Global charts instance
const balanceSheetCharts = new BalanceSheetCharts();

// Function to update charts (exported for global access)
function updateCharts(data) {
    balanceSheetCharts.updateCharts(data);
}

// Theme change listener
document.addEventListener('DOMContentLoaded', () => {
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                balanceSheetCharts.updateChartColors();
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
});

// Export for global access
window.updateCharts = updateCharts;
window.balanceSheetCharts = balanceSheetCharts; 