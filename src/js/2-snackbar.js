document.addEventListener('DOMContentLoaded', function () {
  // Отримуємо форму
  const form = document.querySelector('.form');

  // Функція для створення промісу
  function createPromise(delay, state) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (state === 'fulfilled') {
          resolve(delay);
        } else {
          reject(delay);
        }
      }, delay);
    });
  }

  // Обробник події сабміту форми
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Отримуємо значення з форми
    const delay = Number(this.elements.delay.value);
    const state = this.elements.state.value;

    // Створюємо проміс
    createPromise(delay, state)
      .then(delay => {
        // Виконуємо дії при успішному виконанні промісу
        iziToast.success({
          title: '',
          message: `✅ Fulfilled promise in ${delay}ms`,
          position: 'topCenter',
          backgroundColor: '#59c173',
          messageColor: 'white',
          timeout: 5000,
          closeOnClick: true,
        });
      })
      .catch(delay => {
        // Виконуємо дії при відхиленні промісу
        iziToast.error({
          title: '',
          message: `❌ Rejected promise in ${delay}ms`,
          position: 'topCenter',
          backgroundColor: '#ff5549',
          messageColor: 'white',
          timeout: 5000,
          closeOnClick: true,
        });
      });

    // Очищаємо форму
    this.reset();
  });
});
