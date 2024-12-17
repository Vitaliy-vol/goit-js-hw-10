import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");
const delayInput = form.querySelector('input[name="delay"]');
const stateRadios = form.querySelectorAll('input[name="state"]');

form.addEventListener("submit", (event) => {
  event.preventDefault(); 

  const delay = parseInt(delayInput.value, 10); 
  const selectedState = [...stateRadios].find(radio => radio.checked)?.value; // Отримуємо значення вибраного стану

  if (!selectedState || isNaN(delay)) {
    iziToast.error({
      title: "Error",
      message: "Please provide valid input values.",
      position: "topRight",
    });
    return;
  }

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (selectedState === "fulfilled") {
        resolve(delay);
      } else if (selectedState === "rejected") {
        reject(delay);
      }
    }, delay);
  });

  promise
    .then((fulfilledDelay) => {
      iziToast.success({
        title: "Success",
        message: `✅ Fulfilled promise in ${fulfilledDelay}ms`,
        position: "topRight",
        timeout: 3000,
      });
    })
    .catch((rejectedDelay) => {
      iziToast.error({
        title: "Error",
        message: `❌ Rejected promise in ${rejectedDelay}ms`,
        position: "topRight",
        timeout: 3000,
      });
    });
});