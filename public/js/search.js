const searchBar = document.querySelector("#search-bar");
const cardContainer = document.querySelector("#card-container");
const searchSuggestions = document.querySelector("#search-suggestions");

// Declarations.
let timeoutId;

// Functions.
function deleteChilds(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// Fliter the products shown on the page based on the given data
function filterProducts(datas) {
  // clear previous products.
  deleteChilds(cardContainer);

  // Add new products based on the given data.
  for (let i in datas) {
    // Creating elements.
    const product = document.createElement("div");
    const imageAnchor = document.createElement("a");
    const productImage = document.createElement("img");
    const productName = document.createElement("p");
    const productPrice = document.createElement("p");

    // Assigning values.
    productImage.src = `${datas[i].image}`;
    imageAnchor.href = `/tracking/prod/${datas[i]._id}`;
    productName.innerText = datas[i].name;
    // Getting the most recent price.
    const price =
      datas[i].price_history[datas[i].price_history.length - 1].price;
    productPrice.innerText = price;

    // Assigning classes
    product.classList.add("product");
    productImage.classList.add("card-image");
    productName.classList.add("card-name");
    productPrice.classList.add("card-price");

    // Appending everything properly.
    imageAnchor.appendChild(productImage);
    product.appendChild(productName);
    product.appendChild(productPrice);
    product.appendChild(imageAnchor);
    cardContainer.appendChild(product);
  }
}

searchBar.addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    // getting the domain name out.
    fetch(`/search?name=${searchBar.value}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        filterProducts(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

// Code for showing search suggestion.
function addSuggestion(datas) {
  // Remove previous suggestions.
  deleteChilds(searchSuggestions);
  // Add suggestion for the first 10 data.
  for (i in datas) {
    if (i < 10) {
      // Creating elements.
      const li = document.createElement("li");
      const a = document.createElement("a");
      // Assigning values.
      a.href = `/tracking/prod/${datas[i]._id}`; //Need to change this.
      a.innerText = datas[i].name;

      // Appending everything properly.
      li.appendChild(a);
      searchSuggestions.appendChild(li);
    }
  }
}

// Show suggestions when searching.
searchBar.addEventListener("keyup", (e) => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  // if there is no value, search suggestions need to be cleared.
  timeoutId = setTimeout(() => {
    if (searchBar.value === "") {
      deleteChilds(searchSuggestions);
    }
    // Need to make sure that enter, up, down, left,
    // right key was not presed
    else if (
      e.keyCode !== 13 &&
      e.keyCode !== 37 &&
      e.keyCode !== 38 &&
      e.keyCode !== 39 &&
      e.keyCode !== 40
    ) {
      fetch(`/search?name=${searchBar.value}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          addSuggestion(data);
        });
    }
  }, 100);
});

// Things that should happen when clicked on the document.
document.addEventListener("click", () => {
  deleteChilds(searchSuggestions);
  if (window.getComputedStyle(dropdown).opacity === "1") {
    dropdown.style.opacity = 0;
    dropdown.style.transform = "translateY(-20px)";
    dropdown.style.pointerEvents = "none";
  }
});