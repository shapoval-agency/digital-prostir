document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.form-validation');
  if (!form) return;

  const patterns = {
    name: /^[А-Яа-яІіЇїЄєҐґA-Za-z\s'-]{2,50}$/,
    phone:
      /^[\+]?[0-9]{1,4}?[-.\s]?[(]?[0-9]{1,3}?[)]?[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}$/,
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  };

  const errorMessages = {
    name: "Введіть коректне ім'я (мінімум 2 символи)",
    phone: 'Введіть коректний номер телефону',
    email: 'Введіть коректну email адресу',
    required: "Це поле обов'язкове",
  };

  function validateField(input) {
    const fieldName = input.name;
    const value = input.value.trim();
    const container = input.closest('.input-frame, .input-frame-2');
    const errorElement = container.querySelector('.error-message');

    container.classList.remove('is-valid', 'is-error');

    if (input.hasAttribute('required') && !value) {
      container.classList.add('is-error');
      if (errorElement) {
        errorElement.textContent = errorMessages.required;
      }
      return false;
    }

    if (value && patterns[fieldName]) {
      if (!patterns[fieldName].test(value)) {
        container.classList.add('is-error');
        if (errorElement) {
          errorElement.textContent = errorMessages[fieldName];
        }
        return false;
      }
    }

    if (value) {
      container.classList.add('is-valid');
    }

    return true;
  }

  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('focus', function () {
      const container = this.closest('.input-frame, .input-frame-2');
      container.classList.add('is-focused');
    });

    field.addEventListener('blur', function () {
      const container = this.closest('.input-frame, .input-frame-2');
      container.classList.remove('is-focused');
      validateField(this);
    });

    field.addEventListener('input', function () {
      const container = this.closest('.input-frame, .input-frame-2');
      if (container.classList.contains('is-error')) {
        container.classList.remove('is-error');
      }
    });
  });

  const phoneInput = form.querySelector('input[name="phone"]');
  if (phoneInput) {
    phoneInput.addEventListener('input', function (e) {
      let value = e.target.value.replace(/\D/g, '');

      if (value.startsWith('380')) {
        value = value.substring(0, 12);
        if (value.length >= 3) {
          value =
            '+' +
            value.substring(0, 3) +
            (value.length > 3 ? ' ' + value.substring(3, 5) : '') +
            (value.length > 5 ? ' ' + value.substring(5, 8) : '') +
            (value.length > 8 ? ' ' + value.substring(8, 10) : '') +
            (value.length > 10 ? ' ' + value.substring(10, 12) : '');
        }
      } else if (value.startsWith('0')) {
        value = value.substring(0, 10);
        if (value.length >= 1) {
          value =
            value.substring(0, 3) +
            (value.length > 3 ? ' ' + value.substring(3, 6) : '') +
            (value.length > 6 ? ' ' + value.substring(6, 8) : '') +
            (value.length > 8 ? ' ' + value.substring(8, 10) : '');
        }
      }

      e.target.value = value;
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let isValid = true;
    const requiredFields = form.querySelectorAll('input[required]');

    requiredFields.forEach(field => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    if (isValid) {
      const button = form.querySelector('.buttons-2');
      const originalText = button.querySelector('.text-2').textContent;

      button.disabled = true;
      button.querySelector('.text-2').textContent = 'Відправляємо...';

      setTimeout(() => {
        button.querySelector('.text-2').textContent = 'Успішно відправлено!';
        button.style.backgroundColor = '#00c853';

        setTimeout(() => {
          form.reset();
          form.querySelectorAll('.is-valid').forEach(el => {
            el.classList.remove('is-valid');
          });
          button.disabled = false;
          button.querySelector('.text-2').textContent = originalText;
          button.style.backgroundColor = '';
        }, 2000);
      }, 1500);
    }
  });
});
