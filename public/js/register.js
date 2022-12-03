const registerForm = document.querySelector("#register-form");
const passowrd = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirm-password");
const passwordMismatchMessage = document.querySelector(
  "#password-mismatch-message"
);

registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if(passowrd.value === confirmPassword.value) {
        registerForm.submit();
    }
    else {
        passwordMismatchMessage.classList.add("enabled");
    }
});

passowrd.addEventListener("click", (e) => {
    passwordMismatchMessage.classList.remove("enabled");
});

confirmPassword.addEventListener("click", (e) => {
    passwordMismatchMessage.classList.remove("enabled");
});