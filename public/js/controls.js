$(document).ready(function(){

    const ajaxPath = 'core/php/ajax.php';

    let dropdownIsOpen = false;

   

    $('#myDropdown').addClass('dropdown-content-hide');

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
           if(Number(response)==1){
            alert('Вы успешно авторизованы');
            $('#login-modal').removeClass('open');

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
    if(Number(is_auth)==1){
        window.open('/icdel-main/FAQ.html', target='_self');
    }
    else{
        $('#login-modal').addClass('open');
    }
});

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
