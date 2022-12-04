const popupDiv = document.querySelector('.popup');
const overlayDiv = document.getElementById('overlay');
const openpop = () => {
    popupDiv.classList.add('active');
    overlayDiv.classList.add('active');
}

const closepop = () => {
    popupDiv.classList.remove('active');
    overlayDiv.classList.remove('active');
}

overlayDiv.addEventListener('click', () => {
    closepop();
});