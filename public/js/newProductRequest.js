
const userRequestForm= document.querySelector("#user-request-form");
const productName= document.querySelector("#name");
const productWebsite= document.querySelector("#website");
const productLink= document.querySelector("#link");

userRequestForm.addEventListener("submit", (event) => {
    event.preventDefault();
    fetch('/userRequest', {
        method: "POST",
        body: JSON.stringify({
            name: productName.value,
            website: productWebsite.value,
            link: productLink.value
         }),
         headers: {
            'Content-type': 'application/json; charset=UTF-8'
         }
    })
    
});