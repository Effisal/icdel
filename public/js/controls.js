$(document).ready(async function(){

    const ajaxPath = 'core/php/ajax.php';

    let dropdownIsOpen = false;

    try{
        const response = await $.post(ajaxPath, {method: 'get_genres'});
        const genres_list = JSON.parse(response);
        console.log('LIST', genres_list);
        let options = '';
        if(genres_list.length > 0){
            genres_list.map(item => {
                options += `<option value="${item.id}">${item.genre_title}</option>`;
            });
            $('#genres_list').empty();
            $('#genres_list').append(options);
        }
    }
    catch(ex){

    }

    // Вывод книг
    getAllBooks();

    function getAllBooks() {
      $.ajax({
        url: 'tools.php', // Укажите путь к вашему серверному скрипту
        type: 'POST',
        dataType: 'json',
        data: {
          method: 'get_all_books',
          args: {}
        },
        success: function(response) {
          // Обработка успешного ответа сервера
  
          // Вывод информации о книгах на странице
          var books = response; // Распаковка JSON-данных
          // Очистка контейнера перед выводом новых книг
          $('#books-container').empty();
          // Проход по каждой книге и создание соответствующего элемента на странице
          for (var i = 0; i < books.length; i++) {
            var book = books[i];
            var bookElement = '<div class="book">' +
              '<h3>' + book.title + '</h3>' +
              '<p><strong>Автор:</strong> ' + book.author + '</p>' +
              '<p><strong>Жанр:</strong> ' + book.genre + '</p>' +
              '<p><strong>Описание:</strong> ' + book.description + '</p>' +
              '</div>';
  
            // Добавление элемента на страницу
            $('#books-container').append(bookElement);
          }
        },
        error: function() {
          // Обработка ошибки AJAX-запроса
          alert('Произошла ошибка при получении списка книг');
        }
      });
    }
   
    // Скрытый выпадающий список
    $('#myDropdown').addClass('dropdown-content-hide');

    // Кнопка для выпадающего списка
    $('#genres_button').on('click', async function(){
        $('#myDropdown').empty();
        if(dropdownIsOpen){
            $('#myDropdown').removeClass('dropdown-content-visible');
            // $('#myDropdown').empty();
            $('#myDropdown').addClass('dropdown-content-hide');
            dropdownIsOpen = false;
        }
        else{

            try{
                const genresListJson = await $.post(ajaxPath, {method: 'get_genres'});
                const genresList = JSON.parse( genresListJson);
                console.log(genresList);

                if(genresList.length > 0){
                    let dropdowncontent = '';
                    $('#myDropdown').removeClass('dropdown-content-hide');
                    $('#myDropdown').addClass('dropdown-content-visible');
                    genresList.map(item => {
                        dropdowncontent += `<div value="${item.id}" class="genre-div">${item.genre_title}</div>`;
                    });
                    $('#myDropdown').append(dropdowncontent);
                    dropdownIsOpen = true;
                }
                else{
                    alert('В базе данных сайта нет информации о жанрах')
                }               
            }
            catch{
                alert('Что-то пошло не так, попробуйте еще раз.');
            }
        }
    });

    // Выпадающий список жанров
    $(document).on('click', '.genre-div', async function(){
        const genre_id = Number( $(this).attr("value"));
        console.log('genre_id', genre_id);

        try{
            const booksListJson = await $.post(ajaxPath, {method: 'get_books_by_genre', args: genre_id});
            const booksList = JSON.parse( booksListJson);
            console.log(booksList);
            if(booksList.length > 0){
                let dropdowncontent = '';
                booksList.map(item => {
                    dropdowncontent += `<div value="${item.id}" class="book-div">${item.title}</div>`;
                });
                $('#myDropdown').empty();
                $('#myDropdown').append(dropdowncontent);
               
                dropdownIsOpen = false;
            }
            else{
                alert('Книг такого жанра на данный момент нет.');
            }
        }
        catch{
            alert('Что-то пошло не так, попробуйте еще раз.');
        }
    });

    // Авторизация
    $(document).on('click', '#auth-btn', async function(){
        const login = $('#log').val();
        const password = $('#pass').val();
        console.log(login + ' ' + password);

        try{
            const response = await $.post(ajaxPath, {method: 'get_autorization', args: {
                loginauth: login,
                passwordauth: password
            }});

           Cookies.set('auth', response);
           console.log(response);

           if(Number(response)>0){
            alert('Вы успешно авторизованы');
            $('#login-modal').removeClass('open');

            // Изменение кнопок вход и регистрация на имя пользователя
            $.post(ajaxPath, {
                method: 'get_username',
                args: {
                    userid: response
                }
            }, function(nickname) {
                $('.reg').html(nickname);
                $('.auto').hide();
                $('.reg').show();
            });

           }
           else{
            alert('Неверный логин или пароль');
           }
        }
        catch{
            alert('Что-то пошло не так, попробуйте еще раз.')
        }
    
    });


$(document).on('click', '.add_book', function(){
    const is_auth =  Cookies.get('auth');
    console.log('cookie', is_auth);
    if(Number(is_auth)>0){
        window.open('/icdel/FAQ.html', target='_self');
    }
    else{
        $('#login-modal').addClass('open');
    }
});

// Добавление новой книги
$(document).on('click', '#add_new_book', async function(){

    const new_book = {
        title: $('#book_name').val().trim(), 
        description: $('#book_description').val().trim(),
        genre_id: Number($('#genres_list').val()),
        user_id: Number(Cookies.get('auth'))
    };
    console.log('NEW', new_book);
    try{
        const response = await $.post(ajaxPath, {method: 'set_new_book', args: new_book});
        console.log('ADD_BOOK', response);
        if(Number(response)>0){
            alert(`Книга ${new_book.title} добавлена.`);
        }
    }
    catch(ex){
        alert('Книга не добавилась.');
    }

});

});

// сносим на 3 веселые буквы кукисы
$('#clear-cookies-btn').on('click', function() {
    // Удаление куки по имени
    document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
    // Или удаление всех куки
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf('=');
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  
    alert('Куки успешно очищены');
  });




window.onscroll = function() {
    scrollFunction();
  };
  
  function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      document.getElementById("scrollBtn").style.display = "block";
    } else {
      document.getElementById("scrollBtn").style.display = "none";
    }
  }
  
  function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }



