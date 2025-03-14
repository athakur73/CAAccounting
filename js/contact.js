// Office Status Handling
function updateOfficeStatus() {
    const statusElement = document.getElementById('officeStatus');
    if (!statusElement) return;

    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ...
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour * 60 + minute;

    // Office hours: Mon-Sat, 9 AM - 6 PM
    const isWorkingDay = day >= 1 && day <= 6;
    const isWorkingHours = currentTime >= 9 * 60 && currentTime < 18 * 60;

    if (isWorkingDay && isWorkingHours) {
        statusElement.textContent = 'Currently Open';
        statusElement.classList.remove('closed');
    } else {
        statusElement.textContent = 'Currently Closed';
        statusElement.classList.add('closed');
    }
}

// Form Validation and Handling
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.messageContainer = document.querySelector('.form-message');
        this.charCount = document.querySelector('.char-count');
        this.messageArea = document.getElementById('message');
        this.phoneInput = document.getElementById('phone');
        
        if (this.form) {
            this.initializeEventListeners();
        }
    }

    initializeEventListeners() {
        // Message character count
        if (this.messageArea && this.charCount) {
            this.messageArea.addEventListener('input', () => this.updateCharCount());
        }

        // Phone number formatting
        if (this.phoneInput) {
            this.phoneInput.addEventListener('input', (e) => this.formatPhoneNumber(e));
        }

        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
            input.addEventListener('invalid', (e) => this.handleInvalidField(e));
        });
    }

    updateCharCount() {
        const length = this.messageArea.value.length;
        this.charCount.textContent = `${length} characters (minimum 10)`;
        this.charCount.style.color = length >= 10 ? 'rgba(255, 255, 255, 0.6)' : '#ff6b6b';
    }

    formatPhoneNumber(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) value = value.slice(0, 10);
        e.target.value = value;
        
        const remaining = 10 - value.length;
        if (remaining > 0) {
            e.target.setCustomValidity(`Please enter ${remaining} more digit${remaining > 1 ? 's' : ''}`);
        } else {
            e.target.setCustomValidity('');
        }
    }

    validateField(input) {
        if (!input.value && input.required) {
            input.classList.add('invalid');
            return false;
        }

        if (input.type === 'email' && !this.isValidEmail(input.value)) {
            input.classList.add('invalid');
            return false;
        }

        if (input.type === 'tel' && input.value.length !== 10) {
            input.classList.add('invalid');
            return false;
        }

        if (input.id === 'message' && input.value.length < 10) {
            input.classList.add('invalid');
            return false;
        }

        input.classList.remove('invalid');
        return true;
    }

    clearFieldError(input) {
        input.classList.remove('invalid');
    }

    handleInvalidField(e) {
        e.preventDefault();
        e.target.classList.add('invalid');
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        // Validation
        if (!this.validateForm(data)) {
            return;
        }

        // Show success message with service-specific response
        const serviceName = this.form.querySelector('#service option:checked').textContent;
        this.showMessage(`Thank you for your interest in our ${serviceName.toLowerCase()}! Our team will contact you within 24 hours to discuss your requirements.`, true);
        
        // Reset form
        this.form.reset();
        if (this.charCount) {
            this.charCount.textContent = 'Minimum 10 characters';
            this.charCount.style.color = 'rgba(255, 255, 255, 0.6)';
        }
    }

    validateForm(data) {
        const { name, email, phone, service, message, privacy } = data;

        if (!name || !email || !phone || !service || !message || !privacy) {
            this.showMessage('Please fill in all required fields and accept the privacy policy.', false);
            return false;
        }

        if (name.length < 3) {
            this.showMessage('Please enter your full name (minimum 3 characters).', false);
            return false;
        }

        if (!this.isValidEmail(email)) {
            this.showMessage('Please enter a valid email address.', false);
            return false;
        }

        if (phone.length !== 10) {
            this.showMessage('Please enter a valid 10-digit phone number.', false);
            return false;
        }

        if (message.length < 10) {
            this.showMessage('Please provide more details in your message (minimum 10 characters).', false);
            return false;
        }

        return true;
    }

    showMessage(text, isSuccess) {
        if (!this.messageContainer) return;
        
        // Create message container
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Add icon
        const icon = document.createElement('i');
        icon.className = isSuccess ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        messageContent.appendChild(icon);
        
        // Add text
        const textSpan = document.createElement('span');
        textSpan.textContent = text;
        messageContent.appendChild(textSpan);
        
        // Add close button for error messages
        if (!isSuccess) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'message-close';
            closeBtn.innerHTML = '&times;';
            closeBtn.onclick = () => this.hideMessage();
            messageContent.appendChild(closeBtn);
        }
        
        // Update container
        this.messageContainer.innerHTML = '';
        this.messageContainer.appendChild(messageContent);
        
        // Show with animation
        this.messageContainer.className = `form-message ${isSuccess ? 'success' : 'error'}`;
        this.messageContainer.style.display = 'block';
        
        requestAnimationFrame(() => {
            this.messageContainer.style.opacity = '1';
            this.messageContainer.style.transform = 'translateY(0)';
        });
        
        // Auto-hide success messages
        if (isSuccess) {
            setTimeout(() => this.hideMessage(), 5000);
        }
        
        // Scroll into view
        this.messageContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    hideMessage() {
        if (!this.messageContainer) return;
        
        this.messageContainer.style.opacity = '0';
        this.messageContainer.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            this.messageContainer.style.display = 'none';
            this.messageContainer.innerHTML = '';
        }, 300);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Update office status initially and every minute
    updateOfficeStatus();
    setInterval(updateOfficeStatus, 60000);

    // Initialize contact form
    new ContactForm();
});
