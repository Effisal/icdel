function countCharacters(inputId, counterId) {
    const input = document.getElementById(inputId);
    const counter = document.getElementById(counterId);
    const characterCount = input.value.length;
    counter.textContent = 'Количество символов: ' + characterCount;
  }