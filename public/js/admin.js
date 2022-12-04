// Selecting necessary DOM elements.
const sideAnchor = document.querySelectorAll(".sidebar-anchor");
const mainElement = document.querySelectorAll(".main-element");
const scrapBtn = document.querySelector("#scrap-btn");
const deleteProductForm = document.querySelector("#delete-product-form");
const deleteProductInput = document.querySelector("#delete-product-input");
const formOutputContainer = document.querySelector("#form-output-container");
const stopBtn = document.querySelector("#stop-scrap-btn");
const hourOrMin = document.querySelector("#hour-or-minute");
const quantity = document.querySelector("#quantity");
const status = document.querySelector("#status");
const requestBtns = document.querySelectorAll('.request-btn');
const requestBtnsAccept = document.querySelectorAll('.request-btn-accept');
const newProductUrl = document.querySelector('#new-product-url');

// All necessary globals
const _interval = 2000; // to check if scraping if running.

// Change admin page view with sidebar.
sideAnchor.forEach((anchor, index) => {
  anchor.addEventListener("click", (e) => {
    mainElement.forEach((element, elIndex) => {
      if (index == elIndex) {
        element.classList.remove('hidden');
      }
      else {
        element.classList.add('hidden');
      }
    })
  })
});

// Start a single scrap.
scrapBtn.addEventListener("click", (e) => {
  // cron expr function will provide a cron expression for time scheduling
  const cronExpr = createCronExpr();
  console.log(cronExpr);
  fetch("/api/scrap", {
    method: 'POST',
    body: JSON.stringify({ cronExpr }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  }).catch(err => {
      console.error(err);
  });
});


function removeElements(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function addDeleteSearchResults(datas) {
  datas.forEach((data) => {
    // Creating Elements.
    const formOutput = document.createElement("div");
    const formOutputValue = document.createElement("p");
    const deleteButton = document.createElement("button");
    // Inserting necessary data.
    formOutputValue.innerText = data.url;
    deleteButton.innerText = "Delete";
    // Adding necessary classes.
    formOutput.classList.add("form-output");
    formOutputValue.classList.add("form-output-value");
    deleteButton.classList.add("btn-danger");

    // Appending them to the form.
    formOutput.appendChild(formOutputValue);
    formOutput.appendChild(deleteButton);
    formOutputContainer.appendChild(formOutput);

    // Adding Necessary events.
    deleteButton.addEventListener("click", () => deleteScrape(data._id, formOutput));
  });
  formOutputContainer.classList.remove("hidden");
}

function deleteScrape(id, output) {
  // Deleting the data from the database.
  fetch('/admin/deleteproduct', {
    method: "DELETE",
    body: JSON.stringify({
      id
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  });
  // Removing the data from the page.
  formOutputContainer.removeChild(output);
  // If no output left, hide the output container.
  if (!formOutputContainer.firstChild) {
    formOutputContainer.classList.add("hidden");
  }
}

// Search for deleting a product.
deleteProductForm.addEventListener('submit', (e) => {
  e.preventDefault();
  fetch(`/api/scrap?name=${deleteProductInput.value}`)
    .then(res => res.json())
    .then(datas => {
      removeElements(formOutputContainer);
      addDeleteSearchResults(datas);
    });
});

// Delete a product.
stopBtn.addEventListener("click", (e) => {
  fetch("/api/stopscraping", {
    method: 'POST'
  })
    .catch(err => {
      console.error(err);
    })
});


// custome time scheduling
const createCronExpr = () => {
  const q = quantity.value;
  return hourOrMin.selectedIndex == 0 ? `*/${q} * * * *` : `0 */${q} * * *`;
}


setInterval(() => {
  fetch('/api/log', {
    method: 'POST'
  }).then(response => response.json())
    .then(data => {
      if (data.running) {
        status.style.color = "#065c1d";
        status.innerHTML = "Scheduling running ✔️";
      } else {
        status.style.color = "#FF2009";
        status.innerHTML = "Scheduling not running ❌"
      }
    });
}, _interval);

// Events for handling requests.
requestBtns.forEach(requestBtn => {
  requestBtn.addEventListener('click', (e) => {
    fetch(`/admin/request/delete?id=${requestBtn.value.split(' ')[0]}`, {
      method: 'POST'
    })
    .then(res => {
      // Removing the whole element from DOM.
      requestBtn.parentElement.parentElement.removeChild(requestBtn.parentElement)
    })
    .catch(err => console.error(err));
  })
})

requestBtnsAccept.forEach(requestBtnAccept => {
  requestBtnAccept.addEventListener('click', e => {
    mainElement[0].classList.remove('hidden')
    mainElement[2].classList.add('hidden')
    newProductUrl.value = requestBtnAccept.value.split(' ')[1];
  });
})

