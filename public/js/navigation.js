const menu = document.querySelector('.burger_menu')
const menuBtn = document.querySelector('.burger-btn')

const body = document.body;

if (menu && menuBtn){
    menuBtn.addEventListener('click', () =>{
        menu.classList.toggle('active')
        menuBtn.classList.toggle('active')
        body.classList.toggle('lock')
    })

    menu.addEventListener ('click', e => {
        if (e.target.classList.contains('burger_menu')){
            menu.classList.remove('active')
            menuBtn.classList.remove('active')
            body.classList.remove('lock')
        }
    })
}


