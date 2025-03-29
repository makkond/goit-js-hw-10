// Описаний в документації
import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

flatpickr('#datepicker', { enableTime: true });

// DOM елементи
const datetimePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysElement = document.querySelector('[data-days]');
const hoursElement = document.querySelector('[data-hours]');
const minutesElement = document.querySelector('[data-minutes]');
const secondsElement = document.querySelector('[data-seconds]');

// Змінні
let userSelectedDate = null;
let countdownInterval = null;

// Налаштування flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  dateFormat: 'Y-m-d H:i',
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    const selectedDate = selectedDates[0];

    if (selectedDate <= new Date()) {
      iziToast.error({
        title: 'Помилка',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startButton.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      startButton.disabled = false;
    }
  },
};

// Ініціалізація flatpickr
flatpickr(datetimePicker, options);

// Функція для додавання ведучого нуля
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// Функція для конвертації мілісекунд у дні, години, хвилини, секунди
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Функція для оновлення відображення таймера
function updateTimerDisplay(timeObj) {
  daysElement.textContent = addLeadingZero(timeObj.days);
  hoursElement.textContent = addLeadingZero(timeObj.hours);
  minutesElement.textContent = addLeadingZero(timeObj.minutes);
  secondsElement.textContent = addLeadingZero(timeObj.seconds);
}

// Функція для запуску зворотного відліку
function startCountdown() {
  // Вимкнення кнопки Start та поля вибору дати
  startButton.disabled = true;
  datetimePicker.disabled = true;

  countdownInterval = setInterval(() => {
    const currentTime = new Date();
    const timeDifference = userSelectedDate - currentTime;

    if (timeDifference <= 0) {
      clearInterval(countdownInterval);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      datetimePicker.disabled = false; // Повторне включення поля вибору дати
      return;
    }

    const timeObj = convertMs(timeDifference);
    updateTimerDisplay(timeObj);
  }, 1000);
}

// Обробник події для кнопки Start
startButton.addEventListener('click', startCountdown);
