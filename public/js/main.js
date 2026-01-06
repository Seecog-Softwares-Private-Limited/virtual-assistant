// Initialize dark mode from localStorage
(function() {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) {
    document.documentElement.classList.add('dark');
  }
})();

// Form validation helper
function validateForm(form) {
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;
  
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      isValid = false;
      field.classList.add('border-red-500');
      field.classList.remove('border-gray-300');
    } else {
      field.classList.remove('border-red-500');
      field.classList.add('border-gray-300');
    }
  });
  
  return isValid;
}

// Add form validation on submit
document.addEventListener('DOMContentLoaded', function() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      if (!validateForm(form)) {
        e.preventDefault();
        alert('Please fill in all required fields.');
      }
    });
  });
  
  // Handle service selection for booking form
  const serviceSelect = document.getElementById('serviceSelect');
  const serviceIdInput = document.getElementById('serviceId');
  if (serviceSelect && serviceIdInput) {
    serviceSelect.addEventListener('change', function() {
      const selectedOption = this.options[this.selectedIndex];
      const serviceId = selectedOption.getAttribute('data-id');
      serviceIdInput.value = serviceId || '';
    });
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

