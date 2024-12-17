import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startButton = document.querySelector("[data-start]");
const datetimePicker = document.querySelector("#datetime-picker");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let timerInterval = null;

startButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "topRight",
      });
      startButton.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      startButton.disabled = false;
    }
  },
};

flatpickr(datetimePicker, options);

startButton.addEventListener("click", () => {
  if (!userSelectedDate) return;

  startButton.disabled = true;
  datetimePicker.disabled = true;

  timerInterval = setInterval(() => {
    const currentTime = new Date();
    const timeDiff = userSelectedDate - currentTime;

    if (timeDiff <= 0) {
      clearInterval(timerInterval);
      updateTimerUI(0);
      iziToast.success({
        title: "Done",
        message: "Countdown has finished!",
        position: "topRight",
      });
      datetimePicker.disabled = false;
      return;
    }

    updateTimerUI(timeDiff);
  }, 1000);
});

function updateTimerUI(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}
