const userForm = document.querySelector('#user-form');
const passwordForm = document.querySelector('#password-form');
const name = document.querySelector('#name');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const passwordConfirm = document.querySelector('#confirm-password');
const changeInfo = document.querySelector('#change-info');
const changePassword = document.querySelector('#change-password');
const infoChangeContainer = document.querySelector('#info-change-container');
const passwordChangeContainer = document.querySelector('#password-change-container');



changeInfo.addEventListener('click', event => {
    infoChangeContainer.classList.remove('hidden');
    passwordChangeContainer.classList.add('hidden')
 });
 
 changePassword.addEventListener('click', event => {
    infoChangeContainer.classList.add('hidden');
    passwordChangeContainer.classList.remove('hidden');
 });


 /* ----------------FETCH Function ------------------------- */ 
 userForm.addEventListener('submit', event=>{
    event.preventDefault();
    if(!email.value.match(/(^.+@.+\.com$)/)){
            alert("Give a valid email");
    }
    else{
       fetch('/userEditInfo',{
          method:"PUT",
          body:JSON.stringify({
             name:name.value,
             email:email.value
          }),
          headers:{
            'Content-type': 'application/json; charset=UTF-8'
          }
       })
       .catch(err => {
         console.error(err);
       })
    }

 });
 
 passwordForm.addEventListener('submit', event => {
   event.preventDefault();
   if(!password.value.match(/(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(.{8})/)) {
      alert('Password must contain Uppercase Lowercase and at least 8 characters');
   }
   else if(password.value != passwordConfirm.value) {
      alert("Password fields don't match")
   }
   else {
      fetch('/changepassword', {
         method: "PUT",
         body: JSON.stringify({
            password: password.value
         }),
         headers: {
            'Content-type': 'application/json; charset=UTF-8'
         }
      })
      .catch(err => {
         console.error(err);
       })
   }
})