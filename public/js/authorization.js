openModal = document.querySelector('.auto');
closeModal = document.querySelector('.close_modal')

regopenModal = document.querySelector('.reg');
regcloseModal = document.querySelector('.reg-close_modal')

openModal.addEventListener('click', () => {
    document.querySelector('.black-bg').classList.toggle('open')
});

closeModal.addEventListener('click', () => {
    document.querySelector('.black-bg').classList.remove('open')
})

regopenModal.addEventListener('click', () => {
    document.querySelector('.reg-bg').classList.toggle('open')
});

regcloseModal.addEventListener('click', () => {
    document.querySelector('.reg-bg').classList.remove('open')
})