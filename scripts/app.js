// Global Application State
class BalanceSheetApp {
    constructor() {
        this.currentData = null;
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.charts = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.applyTheme();
        this.loadSampleData();
        this.setupLocalStorage();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.navigateToSection(e.target.dataset.section);
            });
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Help modal
        document.getElementById('helpBtn').addEventListener('click', () => {
            this.showHelpModal();
        });

        document.getElementById('closeHelpModal').addEventListener('click', () => {
            this.hideHelpModal();
        });

        // File upload
        this.setupFileUpload();

        // Manual input
        document.getElementById('processManualBtn').addEventListener('click', () => {
            this.processManualInput();
        });

        // Data preview actions
        document.getElementById('confirmDataBtn').addEventListener('click', () => {
            this.confirmData();
        });

        document.getElementById('editDataBtn').addEventListener('click', () => {
            this.editData();
        });

        // Sample download
        document.getElementById('downloadSample').addEventListener('click', (e) => {
            e.preventDefault();
            this.downloadSampleCSV();
        });

        // Export buttons
        document.getElementById('exportFullReport').addEventListener('click', () => {
            this.exportFullReport();
        });

        document.getElementById('exportCharts').addEventListener('click', () => {
            this.exportCharts();
        });

        document.getElementById('exportRatios').addEventListener('click', () => {
            this.exportRatios();
        });

        document.getElementById('exportInsights').addEventListener('click', () => {
            this.exportInsights();
        });

        // Insights refresh
        document.getElementById('refreshInsightsBtn').addEventListener('click', () => {
            this.refreshInsights();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Close modal on outside click
        document.getElementById('helpModal').addEventListener('click', (e) => {
            if (e.target.id === 'helpModal') {
                this.hideHelpModal();
            }
        });
    }

    setupFileUpload() {
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('fileUploadArea');
        const uploadBtn = document.getElementById('uploadBtn');

        // Click to upload
        uploadBtn.addEventListener('click', () => {
            fileInput.click();
        });

        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileUpload(files[0]);
            }
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileUpload(e.target.files[0]);
            }
        });
    }

    async handleFileUpload(file) {
        this.showLoading();

        try {
            const data = await this.parseFile(file);
            if (data) {
                this.currentData = data;
                this.showDataPreview(data);
            }
        } catch (error) {
            this.showError('Error processing file: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    async parseFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const content = e.target.result;
                    const data = this.parseCSV(content);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(new Error('Failed to read file'));

            if (file.name.endsWith('.csv')) {
                reader.readAsText(file);
            } else {
                reject(new Error('Unsupported file format. Please use CSV files.'));
            }
        });
    }

    parseCSV(content) {
        const lines = content.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const data = {};

        // Initialize data structure
        data.companyName = 'Uploaded Company';
        data.fiscalYear = new Date().getFullYear();
        data.assets = {};
        data.liabilities = {};
        data.equity = {};

        // Parse data rows
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = line.split(',').map(v => v.trim());
            const category = values[0];
            const item = values[1];
            const amount = parseFloat(values[2]) || 0;

            if (category && item && !isNaN(amount)) {
                if (category.toLowerCase().includes('asset')) {
                    data.assets[item] = amount;
                } else if (category.toLowerCase().includes('liability')) {
                    data.liabilities[item] = amount;
                } else if (category.toLowerCase().includes('equity')) {
                    data.equity[item] = amount;
                }
            }
        }

        return data;
    }

    processManualInput() {
        const data = {
            companyName: document.getElementById('companyName').value || 'Manual Input Company',
            fiscalYear: parseInt(document.getElementById('fiscalYear').value) || new Date().getFullYear(),
            assets: {
                'Cash & Cash Equivalents': parseFloat(document.getElementById('cash').value) || 0,
                'Accounts Receivable': parseFloat(document.getElementById('accountsReceivable').value) || 0,
                'Inventory': parseFloat(document.getElementById('inventory').value) || 0,
                'Fixed Assets': parseFloat(document.getElementById('fixedAssets').value) || 0
            },
            liabilities: {
                'Accounts Payable': parseFloat(document.getElementById('accountsPayable').value) || 0,
                'Short-term Debt': parseFloat(document.getElementById('shortTermDebt').value) || 0,
                'Long-term Debt': parseFloat(document.getElementById('longTermDebt').value) || 0
            },
            equity: {
                'Common Stock': parseFloat(document.getElementById('commonStock').value) || 0,
                'Retained Earnings': parseFloat(document.getElementById('retainedEarnings').value) || 0
            }
        };

        this.currentData = data;
        this.showDataPreview(data);
    }

    showDataPreview(data) {
        const preview = document.getElementById('dataPreview');
        const content = document.getElementById('previewContent');

        let html = `
            <div class="preview-section">
                <h4>Company: ${data.companyName}</h4>
                <p>Fiscal Year: ${data.fiscalYear}</p>
            </div>
        `;

        // Assets
        html += '<div class="preview-section"><h4>Assets</h4>';
        Object.entries(data.assets).forEach(([item, amount]) => {
            html += `<div>${item}: $${this.formatNumber(amount)}</div>`;
        });
        html += '</div>';

        // Liabilities
        html += '<div class="preview-section"><h4>Liabilities</h4>';
        Object.entries(data.liabilities).forEach(([item, amount]) => {
            html += `<div>${item}: $${this.formatNumber(amount)}</div>`;
        });
        html += '</div>';

        // Equity
        html += '<div class="preview-section"><h4>Equity</h4>';
        Object.entries(data.equity).forEach(([item, amount]) => {
            html += `<div>${item}: $${this.formatNumber(amount)}</div>`;
        });
        html += '</div>';

        content.innerHTML = html;
        preview.style.display = 'block';
        preview.scrollIntoView({ behavior: 'smooth' });
    }

    confirmData() {
        if (!this.currentData) return;

        this.updateBalanceSheet();
        this.updateCharts();
        this.updateRatios();
        this.updateInsights();
        this.navigateToSection('viewer');
    }

    editData() {
        document.getElementById('dataPreview').style.display = 'none';
        // Scroll back to manual input
        document.querySelector('.upload-method:last-child').scrollIntoView({ behavior: 'smooth' });
    }

    updateBalanceSheet() {
        if (!this.currentData) return;

        const data = this.currentData;

        // Update company info
        document.getElementById('companyNameDisplay').textContent = data.companyName;
        document.getElementById('fiscalYearDisplay').textContent = `Fiscal Year: ${data.fiscalYear}`;

        // Calculate totals
        const totalAssets = Object.values(data.assets).reduce((sum, val) => sum + val, 0);
        const totalLiabilities = Object.values(data.liabilities).reduce((sum, val) => sum + val, 0);
        const totalEquity = Object.values(data.equity).reduce((sum, val) => sum + val, 0);

        // Update summary cards
        document.getElementById('totalAssets').textContent = this.formatCurrency(totalAssets);
        document.getElementById('totalLiabilities').textContent = this.formatCurrency(totalLiabilities);
        document.getElementById('totalEquity').textContent = this.formatCurrency(totalEquity);

        // Update tables
        this.updateTable('assetsTableBody', data.assets, totalAssets);
        this.updateTable('liabilitiesTableBody', data.liabilities, totalLiabilities);
        this.updateTable('equityTableBody', data.equity, totalEquity);
    }

    updateTable(tableId, items, total) {
        const tbody = document.getElementById(tableId);
        tbody.innerHTML = '';

        Object.entries(items).forEach(([item, amount]) => {
            const percentage = total > 0 ? (amount / total * 100).toFixed(1) : 0;
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${item}</td>
                <td class="amount">${this.formatCurrency(amount)}</td>
                <td class="percentage">${percentage}%</td>
            `;
        });
    }

    updateCharts() {
        if (!this.currentData) return;

        // This will be handled by charts.js
        if (window.updateCharts) {
            window.updateCharts(this.currentData);
        }
    }

    updateRatios() {
        if (!this.currentData) return;

        // This will be handled by ratios.js
        if (window.updateRatios) {
            window.updateRatios(this.currentData);
        }
    }

    updateInsights() {
        if (!this.currentData) return;

        // This will be handled by insights.js
        if (window.updateInsights) {
            window.updateInsights(this.currentData);
        }
    }

    navigateToSection(sectionId) {
        // Update navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

        // Show/hide sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');

        // Update charts if navigating to charts section
        if (sectionId === 'charts' && this.currentData) {
            setTimeout(() => this.updateCharts(), 100);
        }
    }

    toggleTheme() {
        const themes = ['light', 'dark', 'banking'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.currentTheme = themes[nextIndex];
        
        this.applyTheme();
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        const themeIcon = document.querySelector('.theme-icon');
        if (this.currentTheme === 'dark') {
            themeIcon.textContent = '☀️';
        } else if (this.currentTheme === 'banking') {
            themeIcon.textContent = '🏦';
        } else {
            themeIcon.textContent = '🌙';
        }
    }

    showHelpModal() {
        document.getElementById('helpModal').classList.add('show');
    }

    hideHelpModal() {
        document.getElementById('helpModal').classList.remove('show');
    }

    showLoading() {
        document.getElementById('loadingOverlay').classList.add('show');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('show');
    }

    showError(message) {
        // Simple error display - could be enhanced with a proper toast system
        alert(message);
    }

    downloadSampleCSV() {
        const sampleData = `Category,Item,Amount
Assets,Cash & Cash Equivalents,500000
Assets,Accounts Receivable,300000
Assets,Inventory,400000
Assets,Fixed Assets,1200000
Liabilities,Accounts Payable,200000
Liabilities,Short-term Debt,300000
Liabilities,Long-term Debt,800000
Equity,Common Stock,500000
Equity,Retained Earnings,600000`;

        const blob = new Blob([sampleData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sample_balance_sheet.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    loadSampleData() {
        // Load sample data for demonstration
        const sampleData = {
            companyName: 'Sample Corporation',
            fiscalYear: 2024,
            assets: {
                'Cash & Cash Equivalents': 500000,
                'Accounts Receivable': 300000,
                'Inventory': 400000,
                'Fixed Assets': 1200000
            },
            liabilities: {
                'Accounts Payable': 200000,
                'Short-term Debt': 300000,
                'Long-term Debt': 800000
            },
            equity: {
                'Common Stock': 500000,
                'Retained Earnings': 600000
            }
        };

        // Pre-fill manual input form
        document.getElementById('companyName').value = sampleData.companyName;
        document.getElementById('fiscalYear').value = sampleData.fiscalYear;
        document.getElementById('cash').value = sampleData.assets['Cash & Cash Equivalents'];
        document.getElementById('accountsReceivable').value = sampleData.assets['Accounts Receivable'];
        document.getElementById('inventory').value = sampleData.assets['Inventory'];
        document.getElementById('fixedAssets').value = sampleData.assets['Fixed Assets'];
        document.getElementById('accountsPayable').value = sampleData.liabilities['Accounts Payable'];
        document.getElementById('shortTermDebt').value = sampleData.liabilities['Short-term Debt'];
        document.getElementById('longTermDebt').value = sampleData.liabilities['Long-term Debt'];
        document.getElementById('commonStock').value = sampleData.equity['Common Stock'];
        document.getElementById('retainedEarnings').value = sampleData.equity['Retained Earnings'];
    }

    setupLocalStorage() {
        // Save data to localStorage for persistence
        if (this.currentData) {
            localStorage.setItem('balanceSheetData', JSON.stringify(this.currentData));
        }

        // Load data from localStorage on page load
        const savedData = localStorage.getItem('balanceSheetData');
        if (savedData) {
            try {
                this.currentData = JSON.parse(savedData);
                this.updateBalanceSheet();
                this.updateCharts();
                this.updateRatios();
                this.updateInsights();
            } catch (error) {
                console.error('Error loading saved data:', error);
            }
        }
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K to focus search (if implemented)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            // Could implement search functionality here
        }

        // Escape to close modals
        if (e.key === 'Escape') {
            this.hideHelpModal();
        }

        // Number keys for navigation
        if (e.key >= '1' && e.key <= '6') {
            const sections = ['upload', 'viewer', 'charts', 'ratios', 'insights', 'export'];
            const index = parseInt(e.key) - 1;
            if (sections[index]) {
                this.navigateToSection(sections[index]);
            }
        }
    }

    formatNumber(num) {
        return new Intl.NumberFormat('en-US').format(num);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    // Export functions
    exportFullReport() {
        this.showLoading();
        setTimeout(() => {
            // This would integrate with jsPDF for full report generation
            this.hideLoading();
            this.showError('Full report export functionality would be implemented here');
        }, 1000);
    }

    exportCharts() {
        this.showLoading();
        setTimeout(() => {
            this.hideLoading();
            this.showError('Charts export functionality would be implemented here');
        }, 1000);
    }

    exportRatios() {
        this.showLoading();
        setTimeout(() => {
            this.hideLoading();
            this.showError('Ratios export functionality would be implemented here');
        }, 1000);
    }

    exportInsights() {
        this.showLoading();
        setTimeout(() => {
            this.hideLoading();
            this.showError('Insights export functionality would be implemented here');
        }, 1000);
    }

    refreshInsights() {
        if (this.currentData) {
            this.updateInsights();
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.balanceSheetApp = new BalanceSheetApp();
}); 