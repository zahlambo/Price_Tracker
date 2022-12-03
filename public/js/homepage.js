const dropdownHamburger = document.querySelector('#dropdown-hamburger');
const dropdown = document.querySelector('#dropdown');


// Open or close dropdown when clicked on hamburger.
dropdownHamburger.addEventListener("click", () => {
   if(window.getComputedStyle(dropdown).opacity === '0') {
      dropdown.style.opacity = 1; 
      dropdown.style.transform = 'translateY(0px)';
      dropdown.style.pointerEvents = 'all';
   }
   else {
      dropdown.style.opacity = 0;
      dropdown.style.transform = 'translateY(-20px)';
      dropdown.style.pointerEvents = 'none';
   }
 })