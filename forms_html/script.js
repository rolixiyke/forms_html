// Form Validation Script
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const formStatus = document.getElementById('formStatus');

    // Validation rules
    const validationRules = {
        'first-name': {
            validate: (value) => value.trim().length >= 2,
            error: 'First name must be at least 2 characters'
        },
        'last-name': {
            validate: (value) => value.trim().length >= 2,
            error: 'Last name must be at least 2 characters'
        },
        'dob': {
            validate: (value) => {
                if (!value) return false;
                const age = new Date().getFullYear() - new Date(value).getFullYear();
                return age >= 18 && age <= 120;
            },
            error: 'Please enter a valid date of birth (18+ years old)'
        },
        'gender': {
            validate: (value) => value !== '',
            error: 'Please select a gender'
        },
        'address': {
            validate: (value) => value.trim().length >= 5,
            error: 'Please enter a valid address'
        },
        'city': {
            validate: (value) => value.trim().length >= 2,
            error: 'City must be at least 2 characters'
        },
        'state': {
            validate: (value) => value.trim().length >= 2,
            error: 'State/Province must be at least 2 characters'
        },
        'postal': {
            validate: (value) => value.trim().length >= 3,
            error: 'Please enter a valid postal code'
        },
        'phone': {
            validate: (value) => /^[\d\s\-\+\(\)]+$/.test(value) && value.replace(/\D/g, '').length >= 10,
            error: 'Please enter a valid phone number'
        },
        'email': {
            validate: (value) => {
                if (value === '') return true; // Email is optional
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            error: 'Please enter a valid email address'
        },
        'emergency-name': {
            validate: (value) => value.trim().length >= 2,
            error: 'Contact name must be at least 2 characters'
        },
        'relationship': {
            validate: (value) => value.trim().length >= 2,
            error: 'Please enter a valid relationship'
        },
        'emergency-phone': {
            validate: (value) => /^[\d\s\-\+\(\)]+$/.test(value) && value.replace(/\D/g, '').length >= 10,
            error: 'Please enter a valid emergency phone number'
        },
        'emergency-alt': {
            validate: (value) => {
                if (value === '') return true; // Alternate phone is optional
                return /^[\d\s\-\+\(\)]+$/.test(value) && value.replace(/\D/g, '').length >= 10;
            },
            error: 'Please enter a valid phone number'
        },
        'reason': {
            validate: (value) => value.trim().length >= 5,
            error: 'Please provide a reason for visit (at least 5 characters)'
        },
        'agreeRecords': {
            validate: (value) => document.querySelector('input[name="agreeRecords"]').checked,
            error: 'You must confirm the information is accurate'
        }
    };

    // Validate single field
    function validateField(fieldId) {
        const field = document.getElementById(fieldId);
        const rule = validationRules[fieldId];

        if (!rule) return true; // Skip validation if no rule exists

        const isValid = rule.validate(field.value);
        const fieldWrapper = field.closest('.field');
        const errorElement = document.getElementById(`${fieldId}-error`);

        if (field.value === '' && !fieldId.includes('emergency-alt') && fieldId !== 'email' && fieldId !== 'reason') {
            // Field is empty and required
            if (field.hasAttribute('required')) {
                fieldWrapper.classList.add('has-error');
                fieldWrapper.classList.remove('has-success');
                if (errorElement) {
                    errorElement.textContent = `${field.placeholder || 'This field'} is required`;
                    errorElement.classList.add('show');
                }
                return false;
            }
        } else if (!isValid && field.value !== '') {
            // Validation failed
            fieldWrapper.classList.add('has-error');
            fieldWrapper.classList.remove('has-success');
            if (errorElement) {
                errorElement.textContent = rule.error;
                errorElement.classList.add('show');
            }
            return false;
        } else if (isValid && field.value !== '') {
            // Validation passed
            fieldWrapper.classList.remove('has-error');
            fieldWrapper.classList.add('has-success');
            if (errorElement) {
                errorElement.classList.remove('show');
            }
            return true;
        } else {
            // Field is optional and empty
            fieldWrapper.classList.remove('has-error', 'has-success');
            if (errorElement) {
                errorElement.classList.remove('show');
            }
            return true;
        }
    }

    // Validate entire form
    function validateForm() {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach((field) => {
            const fieldId = field.id;
            if (!validateField(fieldId)) {
                isValid = false;
            }
        });

        // Also validate optional fields that have values
        Object.keys(validationRules).forEach((fieldId) => {
            const field = document.getElementById(fieldId);
            if (field && !field.hasAttribute('required') && field.value !== '') {
                if (!validateField(fieldId)) {
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    // Clear form status
    function clearFormStatus() {
        formStatus.classList.remove('show', 'success', 'error');
        formStatus.textContent = '';
    }

    // Show form status
    function showFormStatus(type, message) {
        formStatus.textContent = message;
        formStatus.classList.add('show', type);

        if (type === 'success') {
            setTimeout(() => {
                clearFormStatus();
            }, 5000);
        }
    }

    // Add real-time validation to all input fields
    document.querySelectorAll('input, select, textarea').forEach((field) => {
        if (field.closest('form') === form) {
            field.addEventListener('blur', () => {
                if (field.id) {
                    validateField(field.id);
                }
            });

            field.addEventListener('input', () => {
                if (field.id) {
                    const fieldWrapper = field.closest('.field');
                    if (fieldWrapper.classList.contains('has-error')) {
                        validateField(field.id);
                    }
                }
            });

            field.addEventListener('change', () => {
                if (field.id) {
                    const fieldWrapper = field.closest('.field');
                    if (fieldWrapper.classList.contains('has-error')) {
                        validateField(field.id);
                    }
                }
            });
        }
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearFormStatus();

        if (validateForm()) {
            showFormStatus('success', '✓ Form submitted successfully! Thank you for registering.');
            console.log('Form is valid. Ready to submit:', new FormData(form));
            // Here you would normally send the data to a server
            // setTimeout(() => form.reset(), 1500);
        } else {
            showFormStatus('error', '✗ Please fix the errors above before submitting.');
            // Scroll to first error
            const firstError = form.querySelector('.has-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // Handle form reset
    form.addEventListener('reset', () => {
        clearFormStatus();
        document.querySelectorAll('.field').forEach((fieldWrapper) => {
            fieldWrapper.classList.remove('has-error', 'has-success');
        });
        document.querySelectorAll('.error-message').forEach((errorEl) => {
            errorEl.classList.remove('show');
            errorEl.textContent = '';
        });
    });
});
