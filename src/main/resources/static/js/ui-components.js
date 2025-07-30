/**
 * UI Components Library - Companion JavaScript for Thymeleaf UI Fragments
 * Provides JavaScript functionality for common UI components
 */

// UI Components namespace
const UIComponents = {
    
    /**
     * Sidebar Component Utilities
     */
    Sidebar: {
        /**
         * Initialize sidebar functionality
         */
        init() {
            this.setupActiveNavigation();
            this.setupResponsiveToggle();
        },
        
        /**
         * Setup active navigation highlighting based on current page
         */
        setupActiveNavigation() {
            const currentPath = window.location.pathname;
            const navLinks = document.querySelectorAll('.sidebar .nav-link');
            
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && currentPath.includes(href.split('/').pop())) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        },
        
        /**
         * Setup responsive sidebar toggle for mobile
         */
        setupResponsiveToggle() {
            if (window.innerWidth <= 768) {
                this.makeMobileResponsive();
            }
            
            window.addEventListener('resize', () => {
                if (window.innerWidth <= 768) {
                    this.makeMobileResponsive();
                } else {
                    this.makeDesktopResponsive();
                }
            });
        },
        
        makeMobileResponsive() {
            const sidebar = document.querySelector('.sidebar');
            const mainContent = document.querySelector('.main-content');
            
            if (sidebar && mainContent) {
                sidebar.style.transform = 'translateX(-100%)';
                mainContent.style.marginLeft = '0';
            }
        },
        
        makeDesktopResponsive() {
            const sidebar = document.querySelector('.sidebar');
            const mainContent = document.querySelector('.main-content');
            
            if (sidebar && mainContent) {
                sidebar.style.transform = 'translateX(0)';
                mainContent.style.marginLeft = '280px';
            }
        }
    },
    
    /**
     * Statistics Cards Component
     */
    StatsCards: {
        /**
         * Animate stats cards on page load
         */
        animateOnLoad() {
            const statsCards = document.querySelectorAll('.stats-card');
            
            statsCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    card.style.transition = 'all 0.5s ease';
                    
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                }, index * 100);
            });
        },
        
        /**
         * Update stats card value with animation
         */
        updateValue(cardSelector, newValue) {
            const card = document.querySelector(cardSelector);
            const valueElement = card?.querySelector('h3');
            
            if (valueElement) {
                const currentValue = parseInt(valueElement.textContent) || 0;
                this.animateCounter(valueElement, currentValue, newValue);
            }
        },
        
        /**
         * Animate counter from current to new value
         */
        animateCounter(element, start, end, duration = 1000) {
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const currentValue = Math.floor(start + (end - start) * progress);
                element.textContent = currentValue;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        }
    },
    
    /**
     * Table Component Utilities
     */
    Table: {
        /**
         * Initialize table functionality
         */
        init(tableId, options = {}) {
            const table = document.getElementById(tableId);
            if (!table) return;
            
            if (options.sortable) {
                this.makeSortable(table);
            }
            
            if (options.filterable) {
                this.makeFilterable(table, options.filterInput);
            }
            
            if (options.hoverable) {
                this.addHoverEffects(table);
            }
        },
        
        /**
         * Make table sortable by clicking headers
         */
        makeSortable(table) {
            const headers = table.querySelectorAll('thead th');
            
            headers.forEach((header, index) => {
                header.style.cursor = 'pointer';
                header.addEventListener('click', () => {
                    this.sortTable(table, index);
                });
            });
        },
        
        /**
         * Sort table by column index
         */
        sortTable(table, columnIndex) {
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            
            const sorted = rows.sort((a, b) => {
                const aValue = a.cells[columnIndex].textContent.trim();
                const bValue = b.cells[columnIndex].textContent.trim();
                
                return aValue.localeCompare(bValue, undefined, { numeric: true });
            });
            
            tbody.innerHTML = '';
            sorted.forEach(row => tbody.appendChild(row));
        },
        
        /**
         * Add filter functionality to table
         */
        makeFilterable(table, filterInputId) {
            const filterInput = document.getElementById(filterInputId);
            if (!filterInput) return;
            
            filterInput.addEventListener('input', (e) => {
                this.filterTable(table, e.target.value);
            });
        },
        
        /**
         * Filter table rows based on search term
         */
        filterTable(table, searchTerm) {
            const rows = table.querySelectorAll('tbody tr');
            const term = searchTerm.toLowerCase();
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(term) ? '' : 'none';
            });
        },
        
        /**
         * Add hover effects to table rows
         */
        addHoverEffects(table) {
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                row.addEventListener('mouseenter', () => {
                    row.style.transform = 'scale(1.01)';
                });
                
                row.addEventListener('mouseleave', () => {
                    row.style.transform = 'scale(1)';
                });
            });
        }
    },
    
    /**
     * Modal Component Utilities
     */
    Modal: {
        /**
         * Show modal with optional callback
         */
        show(modalId, callback) {
            const modal = document.getElementById(modalId);
            if (!modal) return;
            
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();
            
            if (callback) {
                modal.addEventListener('shown.bs.modal', callback, { once: true });
            }
        },
        
        /**
         * Hide modal with optional callback
         */
        hide(modalId, callback) {
            const modal = document.getElementById(modalId);
            if (!modal) return;
            
            const bootstrapModal = bootstrap.Modal.getInstance(modal);
            if (bootstrapModal) {
                bootstrapModal.hide();
                
                if (callback) {
                    modal.addEventListener('hidden.bs.modal', callback, { once: true });
                }
            }
        },
        
        /**
         * Populate modal form with data
         */
        populateForm(modalId, data) {
            const modal = document.getElementById(modalId);
            if (!modal) return;
            
            Object.keys(data).forEach(key => {
                const input = modal.querySelector(`[name="${key}"], #${key}`);
                if (input) {
                    if (input.type === 'checkbox') {
                        input.checked = data[key];
                    } else {
                        input.value = data[key] || '';
                    }
                }
            });
        },
        
        /**
         * Clear modal form
         */
        clearForm(modalId) {
            const modal = document.getElementById(modalId);
            if (!modal) return;
            
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
            }
        }
    },
    
    /**
     * Alert Component Utilities
     */
    Alert: {
        /**
         * Show alert with auto-dismiss
         */
        show(type, message, duration = 5000) {
            const alertContainer = this.getOrCreateContainer();
            
            const alertElement = document.createElement('div');
            alertElement.className = `alert alert-${type} alert-dismissible fade show`;
            alertElement.innerHTML = `
                <i class="fas fa-${this.getIcon(type)} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            
            alertContainer.appendChild(alertElement);
            
            // Auto-dismiss after duration
            setTimeout(() => {
                if (alertElement.parentNode) {
                    alertElement.remove();
                }
            }, duration);
        },
        
        /**
         * Get or create alert container
         */
        getOrCreateContainer() {
            let container = document.getElementById('alert-container');
            
            if (!container) {
                container = document.createElement('div');
                container.id = 'alert-container';
                container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
                document.body.appendChild(container);
            }
            
            return container;
        },
        
        /**
         * Get appropriate icon for alert type
         */
        getIcon(type) {
            const icons = {
                success: 'check-circle',
                danger: 'exclamation-triangle',
                warning: 'exclamation-circle',
                info: 'info-circle'
            };
            return icons[type] || 'info-circle';
        }
    },
    
    /**
     * Form Component Utilities
     */
    Form: {
        /**
         * Initialize form with validation and submission handling
         */
        init(formId, options = {}) {
            const form = document.getElementById(formId);
            if (!form) return;
            
            if (options.validate) {
                this.setupValidation(form);
            }
            
            if (options.submitHandler) {
                form.addEventListener('submit', options.submitHandler);
            }
            
            if (options.autoSave) {
                this.setupAutoSave(form);
            }
        },
        
        /**
         * Setup form validation
         */
        setupValidation(form) {
            const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
        },
        
        /**
         * Validate individual field
         */
        validateField(field) {
            const isValid = field.checkValidity();
            
            if (!isValid) {
                this.showFieldError(field, field.validationMessage);
            } else {
                this.clearFieldError(field);
            }
            
            return isValid;
        },
        
        /**
         * Show field error
         */
        showFieldError(field, message) {
            field.classList.add('is-invalid');
            
            let feedback = field.parentNode.querySelector('.invalid-feedback');
            if (!feedback) {
                feedback = document.createElement('div');
                feedback.className = 'invalid-feedback';
                field.parentNode.appendChild(feedback);
            }
            
            feedback.textContent = message;
        },
        
        /**
         * Clear field error
         */
        clearFieldError(field) {
            field.classList.remove('is-invalid');
            const feedback = field.parentNode.querySelector('.invalid-feedback');
            if (feedback) {
                feedback.remove();
            }
        },
        
        /**
         * Setup auto-save functionality
         */
        setupAutoSave(form) {
            const inputs = form.querySelectorAll('input, select, textarea');
            
            inputs.forEach(input => {
                input.addEventListener('change', () => {
                    this.autoSave(form);
                });
            });
        },
        
        /**
         * Auto-save form data to localStorage
         */
        autoSave(form) {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            localStorage.setItem(`form_${form.id}`, JSON.stringify(data));
        },
        
        /**
         * Restore form data from localStorage
         */
        restoreAutoSave(formId) {
            const saved = localStorage.getItem(`form_${formId}`);
            if (saved) {
                const data = JSON.parse(saved);
                this.populateForm(formId, data);
            }
        }
    },
    
    /**
     * Loading Component Utilities
     */
    Loading: {
        /**
         * Show loading spinner
         */
        show(containerId, message = 'Loading...') {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner text-center p-4';
            spinner.innerHTML = `
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2 text-muted">${message}</p>
            `;
            
            container.innerHTML = '';
            container.appendChild(spinner);
        },
        
        /**
         * Hide loading spinner and restore content
         */
        hide(containerId, content) {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            if (content) {
                container.innerHTML = content;
            } else {
                const spinner = container.querySelector('.loading-spinner');
                if (spinner) {
                    spinner.remove();
                }
            }
        }
    },
    
    /**
     * Initialize all UI components
     */
    init() {
        // Initialize sidebar
        this.Sidebar.init();
        
        // Animate stats cards
        this.StatsCards.animateOnLoad();
        
        // Initialize common tooltips
        this.initTooltips();
        
        // Setup global error handling
        this.setupErrorHandling();
    },
    
    /**
     * Initialize Bootstrap tooltips
     */
    initTooltips() {
        const tooltipTriggerList = [].slice.call(
            document.querySelectorAll('[data-bs-toggle="tooltip"]')
        );
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    },
    
    /**
     * Setup global error handling for UI components
     */
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('UI Component Error:', event.error);
            this.Alert.show('danger', 'An unexpected error occurred. Please refresh the page.');
        });
    }
};

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    UIComponents.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIComponents;
}

// Global aliases for backward compatibility
window.UIComponents = UIComponents;
