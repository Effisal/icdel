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
    // getAllBooks();

    // function getAllBooks() {
    //   $.ajax({
    //     url: 'tools.php', // Укажите путь к вашему серверному скрипту
    //     type: 'POST',
    //     dataType: 'json',
    //     data: {
    //       method: 'get_all_books',
    //       args: {}
    //     },
    //     success: function(response) {
    //       // Обработка успешного ответа сервера
  
    //       // Вывод информации о книгах на странице
    //       var books = response; // Распаковка JSON-данных
    //       // Очистка контейнера перед выводом новых книг
    //       $('#books-container').empty();
    //       // Проход по каждой книге и создание соответствующего элемента на странице
    //       for (var i = 0; i < books.length; i++) {
    //         var book = books[i];
    //         var bookElement = '<div class="book">' +
    //           '<h3>' + book.title + '</h3>' +
    //           '<p><strong>Автор:</strong> ' + book.nickname + '</p>' +
    //           '<p><strong>Жанр:</strong> ' + book.genre + '</p>' +
    //           '<p><strong>Описание:</strong> ' + book.description + '</p>' +
    //           '</div>';
  
    //         // Добавление элемента на страницу
    //         $('#books-container').append(bookElement);
    //       }
    //     },
    //     error: function() {
    //       // Обработка ошибки AJAX-запроса
    //       alert('Произошла ошибка при получении списка книг');
    //     }
    //   });
    // }
   
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

    // Выпадающий список жанров и вывод книг
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
                    dropdowncontent += `<div value="${item.id}" class="book-div">
                                            <section style="font-size: 25px;
                                            color: #340000;
                                            font-weight: bolder;"><span value="${item.id}" id="content_book">${item.title}</span></section> 
                                            <section style="margin-top: 10px">Автор: <span>${item.nickname}</span></section>
                                            <section style="margin-top: 10px">Описание: ${item.discription}<section>
                                        </div>`;
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

    // Переход на страницу с главами
    $(document).on('click', '#content_book', async function(){

        const id_book = $(this).attr('value');
        console.log('book_id', id_book);
        Cookies.set('book_id', id_book);

        
        try{
            const response = await $.post(ajaxPath, {method: 'get_book_content', args: id_book});
            console.log(response);
            chaptersList = JSON.parse(response);
            console.log("glavi", chaptersList);
            localStorage.setItem('chapters', response);
        }
        catch(ex){
            alert('Ошибка получения глав');
        }

        window.open('/icdel/Chapters.html', target='_self');
        
    })

    // Кнопка перехода на страницу "Добавить главу" из списка глав
    $(document).on('click', '.cnb-btn', async function() {
        const is_auth = Cookies.get('auth');
        let bookId = JSON.parse(localStorage["chapters"])[0]["id_books"]; 
    
        // Проверяем наличие аутентификации и другие условия
        if (Number(is_auth) > 0) {
            try {
                const response = await $.post(ajaxPath, {
                    method: 'check_book_owner',
                    args: {
                        id_users: is_auth,
                        id: bookId
                    }
                });
    
                let isOwner = response === 'true';
    
                if (isOwner) 
                {
                    window.location.replace('/icdel/AAJ.html');
                } 
                else 
                {
                    alert('Ошибка при добавления главы');
                }
            } catch(error) {
                console.error('Ошибка при выполнении запроса: ', error);
            }
        } else {
            // Действия, если пользователь не авторизован
            // Например, отображение сообщения или перенаправление на страницу авторизации
        }
        
        return false; // Отменяем действие по умолчанию, чтобы избежать обновления страницы
    });

    // Проверка авторизации при загрузке страницы
    $(document).ready(function() {
        const is_auth = Cookies.get('auth');
        console.log('cookie', is_auth);
  
        if (Number(is_auth) > 0) {
            $('.cnb-btn').show();
        } else {
            $('.cnb-btn').hide();
        }
    });

    // Вывод глав книги
    $('#chapters-list').ready(async function(){

        const chapterslist = localStorage.getItem('chapters');
        const list = JSON.parse(chapterslist);
        let chapters_list = '';

        if(list.length > 0){
            list.map(item => {
                chapters_list += `
                <div value="${item.id}" class="chapter_item">
                ${item.title}
                </div>
                `;
            });
            $('#chapters-list').append(chapters_list);
        }

    });

    // Переход к тексту главы
    $(document).on('click', '.chapter_item', async function(){
        
        const id_content = $(this).attr('value');
        console.log('content_id', id_content);
        localStorage.setItem('chapter_id', id_content);

        window.open('/icdel/Page.html', target='_self');

    });

    // Вывод контента из книги
    $('#chapters-list').ready(async function(){

        const chapterslist = localStorage.getItem('chapters');
        const list = JSON.parse(chapterslist);
        const chapter_id = Number(localStorage.getItem('chapter_id'));
        const chapter = list.find(item => Number(item.id) == chapter_id);
        console.log('CHAPTER', chapter);
        const chapter_title = ``;

        $(document).find('#chapter-title').append(chapter.title);
        $(document).find('#outputPage').append(chapter.content);

    });

    // Авторизация
    // $(document).on('click', '#auth-btn', async function(){
    //     const login = $('#log').val();
    //     const password = $('#pass').val();
    //     console.log(login + ' ' + password);

    //     try{
    //         const response = await $.post(ajaxPath, {method: 'get_autorization', args: {
    //             loginauth: login,
    //             passwordauth: password
    //         }});

    //        Cookies.set('auth', response);
    //        console.log(response);

    //        if(Number(response)>0){
    //         // alert('Вы успешно авторизованы');
    //         $('#login-modal').removeClass('open');

    //         // Изменение кнопок вход и регистрация на имя пользователя
    //         $.post(ajaxPath, {
    //             method: 'get_username',
    //             args: {
    //                 userid: response
    //             }
    //         }, function(nickname) {
    //             $('.reg').html(nickname);
    //             $('.auto').hide();
    //             $('.reg').show();
    //         });

    //        }
    //        else{
    //         alert('Неверный логин или пароль');
    //        }
    //     }
    //     catch{
    //         alert('Что-то пошло не так, попробуйте еще раз.')
    //     }
    
    // });

    // Вывод никнейма вместо кнопок регистрация и авторизация
    $(document).ready(function() {
        const isAuth = Cookies.get('auth');
        
        if (isAuth) {
          // Пользователь авторизован, скрываем кнопки авторизации/регистрации
          $('.auto, .reg').hide();
          
          // Получаем имя пользователя с помощью AJAX-запроса
          $.post(ajaxPath, {
            method: 'get_username',
            args: {
              userid: isAuth
            }
          }, function(nickname) {
            $('.user').text(nickname); // Замените '.user' на селектор элемента, где должен отображаться никнейм
            $('.user').show();
          });
        } else {
          // Пользователь не авторизован, скрываем никнейм пользователя
          $('.user').hide();
        }
      });
      //Сама авторизация
      $(document).on('click', '#auth-btn', async function(){
        const login = $('#log').val();
        const password = $('#pass').val();
        console.log(login + ' ' + password);
      
        try {
          const response = await $.post(ajaxPath, {
            method: 'get_autorization',
            args: {
              loginauth: login,
              passwordauth: password
            }
          });
      
          if (Number(response) > 0) {
            alert('Вы успешно авторизованы');
            $('#login-modal').removeClass('open');
      
            // Установка куки авторизации и имени пользователя
            Cookies.set('auth', response);
            Cookies.set('username', response);
      
            // Изменение кнопок на имя пользователя
            $('.reg').html(response);
            $('.auto').hide();
            $('.reg').show();
            location.reload();
          } 
          else {
            alert('Неверный логин или пароль');
          }
        } 
        catch {
          alert('Что-то пошло не так, попробуйте еще раз.');
        }
      });
      // Возврат кнопок регистрациия и авторизация при нажатии кнопки выход
      $(document).on('click', '#logout-btn', function() {
        // Удаление куки авторизации и имени пользователя
        Cookies.remove('auth');
        Cookies.remove('username');
      
        // Изменение кнопок на "Регистрацию" и "Вход"
        $('.reg').hide();
        $('.auto').show();
      });

// Проверка на наличие куки при нажатии кнопки "Добавить работу"
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

$(document).on('click', '.lk_user', function(){
    const is_auth =  Cookies.get('auth');
    console.log('cookie', is_auth);
    if(Number(is_auth)>0){
        window.open('/icdel/Profile.html', target='_self');
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
            localStorage.setItem('new_book_id', response);

            window.open('/icdel/AAJ.html', target='_self');

        }
    }
    catch(ex){
        alert('Книга не добавилась.');
    }

});

//Добавление главы
$(document).on('click', '#add_chapter_btn', async function(){

    const data = {

        title: $('#title-chap').val(),
        content: $('#js-input').val(),
        book_id: localStorage.getItem('new_book_id')

    };
    console.log('chapter-conter', data);

    try{

        const response = await $.post(ajaxPath, {
            method: 'set_new_chapter',
            args: data
        });

        console.log('id_new_chapter', response);

        if(Number(response)>0){
            alert(`Глава ${data.title} добавлена`);
            window.open('/icdel/index.html')
            return
        }
    

    }
    catch(ex){

        alert('Ошибка добавления главы');

    }
})

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

    location.reload();

  });



// Кнопка скрола вверх
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



