$(document).ready(function() {
    // Функция для проверки наличия куки авторизации
    function checkAuthCookie() {
        const is_auth =  Cookies.get('auth');
        if(Number(is_auth)>0){
            return true;
        }
        else{
            return false;
        }
        return document.cookie.includes('auth=true');
    }
  
    // Проверяем наличие куки авторизации
    var isAuthenticated = checkAuthCookie();
  
    // Если пользователь авторизован, скрываем кнопки "Войти" и "Зарегистрироваться"
    if (isAuthenticated) {
      $('#login-btn').hide();
      $('#register-btn').hide();
    }
  });