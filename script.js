let segmentChart = null;
let cityChart = null;
let ageChart = null;
const API_BASE = '/api';

const showToast = (message, type = 'success') => {
    const toast = document.getElementById(type + 'Toast');
    if (toast) {
        toast.querySelector('.toast-body').textContent = message;
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }
};

const showMessage = (message, type = 'success') => {
    const msgDiv = document.getElementById('formMessage');
    if (msgDiv) {
        msgDiv.innerHTML = `<div class="alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
    }
};

async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        if (!response.ok) {
            const error = await response.json().catch(() => ({message: 'Server error'}));
            throw new Error(error.message || 'Request failed');
        }
        return await response.json();
    } catch (error) {
        showToast(error.message, 'error');
        throw error;
    }
}

async function addCustomer() {
    const addBtn = document.getElementById('addBtn');
    const form = document.getElementById('customerForm');
    
    if (!addBtn || !form) return;
    
    addBtn.disabled = true;
    addBtn.innerHTML = 'Adding...';
    
    const formData = {
        name: document.getElementById('name').value.trim(),
        age: parseInt(document.getElementById('age').value),
        city: document.getElementById('city').value.trim(),
        purchase: parseFloat(document.getElementById('purchase').value)
    };

    if (!formData.name || !formData.city || isNaN(formData.age) || isNaN(formData.purchase) || formData.age < 18) {
        showMessage('Please fill all fields correctly (Age >= 18)', 'error');
        resetFormBtn();
        return;
    }

    try {
        await apiCall('/customers', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        });
        showMessage('✅ Customer added successfully!', 'success');
        form.reset();
        loadCustomers();
        loadInsights();
    } catch (error) {
        // Error handled in apiCall
    } finally {
        resetFormBtn();
    }
}

function resetFormBtn() {
    const addBtn = document.getElementById('addBtn');
    if (addBtn) {
        addBtn.disabled = false;
        addBtn.innerHTML = 'Add Customer';
    }
}

async function loadCustomers() {
    try {
        const customers = await apiCall('/customers');
        const tbody = document.querySelector('#customersTable tbody');
        const countEl = document.getElementById('totalCount');
        
        if (tbody) tbody.innerHTML = '';
        if (countEl) countEl.textContent = customers.length || 0;
        
        if (tbody) {
            customers.forEach(customer => {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${customer.id}</td>
                    <td>${customer.name}</td>
                    <td>${customer.age}</td>
                    <td>${customer.city}</td>
                    <td>₹${customer.purchase?.toLocaleString('en-IN', {maximumFractionDigits: 0}) || '0'}</td>
                `;
            });
        }
    } catch (error) {
        showToast('Failed to load customers', 'error');
    }
}

async function loadInsights() {
    try {
        const insights = await apiCall('/insights');
        
        // Update KPIs (safe access)
        const totalKPI = document.getElementById('totalKPI');
        const avgKPI = document.getElementById('avgKPI');
        const topKPI = document.getElementById('topKPI');
        const topCityKPI = document.getElementById('topCityKPI');
        
        if (totalKPI) totalKPI.textContent = insights.total_customers || 0;
        if (avgKPI) avgKPI.textContent = `₹${(insights.average_purchase || 0).toLocaleString('en-IN', {maximumFractionDigits: 0})}`;
        
        if (topKPI && insights.top_customer) {
            topKPI.textContent = `${insights.top_customer.name}: ₹${insights.top_customer.purchase.toLocaleString('en-IN')}`;
        } else if (topKPI) {
            topKPI.textContent = '-';
        }
        
        if (topCityKPI && insights.city_purchases && insights.city_purchases[0]) {
            const topCity = insights.city_purchases[0];
            topCityKPI.textContent = `${topCity.city} (${topCity.count})`;
        } else if (topCityKPI) {
            topCityKPI.textContent = '-';
        }
        
        // Charts with safe destroy
        const segmentCtx = document.getElementById('segmentChart')?.getContext('2d');
        if (segmentCtx && segmentChart) segmentChart.destroy();
        if (segmentCtx) {
            segmentChart = new Chart(segmentCtx, {
                type: 'doughnut',
                data: {
                    labels: ['High (>₹500)', 'Medium (₹200-500)', 'Low (<₹200)'],
                    datasets: [{ 
                        data: [insights.segments?.high_spenders || 0, insights.segments?.medium_spenders || 0, insights.segments?.low_spenders || 0],
                        backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1']
                    }]
                },
                options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
            });
        }

        // City Chart
        const cityCtx = document.getElementById('cityChart')?.getContext('2d');
        if (cityCtx && cityChart) cityChart.destroy();
        if (cityCtx && insights.city_purchases && insights.city_purchases.length > 0) {
            const cityLabels = insights.city_purchases.map(c => c.city);
            const cityData = insights.city_purchases.map(c => c.avg);
            cityChart = new Chart(cityCtx, {
                type: 'bar',
                data: {
                    labels: cityLabels,
                    datasets: [{ label: 'Avg Purchase ₹', data: cityData, backgroundColor: '#0d6efd' }]
                },
                options: { 
                    responsive: true, 
                    scales: { y: { beginAtZero: true } },
                    plugins: { title: { display: true, text: 'Avg Purchase by City' } } 
                }
            });
        }

        // Age Chart
        const ageCtx = document.getElementById('ageChart')?.getContext('2d');
        if (ageCtx && ageChart) ageChart.destroy();
        if (ageCtx) {
            ageChart = new Chart(ageCtx, {
                type: 'bar',
                data: {
                    labels: Object.keys(insights.age_groups || {}),
                    datasets: [{ 
                        label: 'Count', 
                        data: Object.values(insights.age_groups || {}), 
                        backgroundColor: '#28a745' 
                    }]
                },
                options: { 
                    responsive: true, 
                    scales: { y: { beginAtZero: true } },
                    plugins: { title: { display: true, text: 'Age Distribution' } } 
                }
            });
        }

    } catch (error) {
        console.error('Insights error:', error);
        showToast('Failed to load insights: ' + error.message, 'error');
    }
}

async function initDB() {
    try {
        await fetch('/api/init', {method: 'POST'});
        showToast('Database initialized!');
        loadCustomers();
        loadInsights();
    } catch (error) {
        showToast('Init failed', 'error');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('customerForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            addCustomer();
        });
    }
    loadCustomers();
    loadInsights();
});
