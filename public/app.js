var countries = [];
var inputElem = null;
var resultsElem = null;

function init() {
  fetch("https://restcountries.com/v3.1/all")
    .then((response) => response.json())
    .then((data) => (countries = data));

  resultsElem = document.querySelector("ul");
  inputElem = document.querySelector("input");

  resultsElem.addEventListener("click", (event) => {
    handleResultClick(event);
  });

  inputElem.addEventListener("input", (event) => {
    autocomplete(event);
  });

  inputElem.addEventListener("keyup", (event) => {
    handleResultKeyDown(event);
  });
}

function autocomplete(event) {
  const value = inputElem.value;
  if (!value) {
    hideResults();
    inputElem.value = "";
    return;
  }

  let arrayPaises = []
  countries.forEach(e => {
    if(e.name.common.toLowerCase().startsWith(value.toLowerCase())){
      arrayPaises.unshift(e)
    }else if(e.name.common.toLowerCase().includes(value.toLowerCase())){
      arrayPaises.push(e)
    }
  });

  
  resultsElem.innerHTML = arrayPaises
    .map((result, index) => {
      const isSelected = index === 0;


      let paisFormateado = result.name.common.toLowerCase().replace(value.toLowerCase(), `<span>${value}</span>`)
      
      if(result.name.common.toLowerCase().startsWith(value.toLowerCase())){
        let valueEnMayuscula = value.replace(value[0],value[0].toUpperCase())
        paisFormateado = result.name.common.toLowerCase().replace(value.toLowerCase(), `<span>${valueEnMayuscula}</span>`)
        
      }
      
      return `
        <li
          id='autocomplete-result-${index}'
          class='autocomplete-result${isSelected ? " selected" : ""}'
          role='option'
          ${isSelected ? "aria-selected='true'" : ""}
        >
        ${paisFormateado}
        </li>
      `;
    })
    .join("");
  resultsElem.classList.remove("hidden");
}


function handleResultClick(event) {
  if (event.target && event.target.nodeName === "LI") {
    selectItem(event.target);
  }
}
function handleResultKeyDown(event) {
  const { key } = event;
  switch (key) {
    case "Backspace":
      return;
    default:
      // selectFirstResult();
  }
}

function selectFirstResult() {
  const value = inputElem.value;
  const autocompleteValue = resultsElem.querySelector(".selected");
  if (!value || !autocompleteValue) {
    return;
  }
  if (value !== autocompleteValue.innerText) {
    inputElem.value = autocompleteValue.innerText;
    inputElem.setSelectionRange(
      value.length,
      autocompleteValue.innerText.length
    );
  }
}
function selectItem(node) {
  if (node) {
    inputElem.value = node.innerText;
    hideResults();
  }
}

function hideResults() {
  this.resultsElem.innerHTML = "";
  this.resultsElem.classList.add("hidden");
}

init();