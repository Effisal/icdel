document.addEventListener('DOMContentLoaded', function() {
    var form = document.querySelector('.modal_wrapper');
    var errorMessage = document.getElementById('error-message');
  
    form.addEventListener('submit', function(event) {
      var passwordInput = document.querySelector('input[name="pass"]');
      var confirmPasswordInput = document.querySelector('input[name="passtwo"]');
      
      if (passwordInput.value !== confirmPasswordInput.value) {
        event.preventDefault(); // Отмена стандартной отправки формы
        errorMessage.textContent = 'Пароли не совпадают';
      }
    });
  });
  
