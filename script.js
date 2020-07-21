const allCountries = getAllCountries();
let itemsNumber = 1;
let scrollY = 0;

window.onload = () => {
  setTimeout(function () {
    renderInitialCountries();
    getTotalCases();
  }, 3000);
};

window.onscroll = function () {
  scrollY = window.scrollY;
};

const searchbox = document.querySelector(".search-box");
const morebtn = document.querySelector(".more");

morebtn.addEventListener("click", () => {
  //document.querySelector(".loader-info").style.display = "block";
  morebtn.style.display = "none";
  document.querySelector('.loader-info').style.display = 'block';
  setTimeout(function () {
    renderInitialCountries();
  }, 1500);
});

searchbox.addEventListener("keypress", getCountryName);

//Verifing if the searchbox is empty
searchbox.addEventListener("keyup", () => {
  if (searchbox.value === "") {
    document.querySelector(".specificCountry").style.display = "none";
    document.querySelector(".AllCountries").style.display = "grid";
  }
});

/*
 * @Purpose : formatting a comma-separated number
 * @param : a number
 */
function formatNumber(number) {
  return new Intl.NumberFormat().format(number);
}

function renderInitialCountries() {

  let aux = itemsNumber;
  allCountries.then((data) => {
    for (let i = 0 + aux; i < 12 + aux; i++) {
      //Create components with a country information
      createComponents(data[i]);
      //Asign an image to each country component
      assignFlag(data[i].country);
      itemsNumber++;
    }
  });

  //Setting position 
  window.scrollTo(0, scrollY);
  //Hiding the show more button
  morebtn.style.display = "block";
  //Hiding login components loading page
  document.querySelector('.loader-info').style.display = 'none';
  //Hiding the loading page
  document.querySelector(".loader-wrapper").style.display = "none";
}

/*
 * @Purpose : get all countries
 */
async function getAllCountries() {
  var uri = "https://coronavirus-19-api.herokuapp.com/countries";
  let response = await fetch(uri);
  let data = await response.json();
  return data;
}

/*@Purpose : get the flag of a specific country
 * @param countryName : name of the country
 * @return : promise that contains the country's flag
 */
function getFlag(countryName) {
  var uri = `https://restcountries.eu/rest/v2/name/${countryName}`;

  return fetch(uri)
    .then(($country) => {
      return $country.json();
    })
    .then((data) => {
      return data[0].flag;
    })
    .catch((error) => {
      var messageError = "Error when trying to get the image";
      console.log(messageError);
    });
}

/*@Purpose : get the value of the getFlag() function and assign the image to the country component
 * @param countryName : name of the country
 */
function assignFlag(countryName) {
  getFlag(countryName).then((imageFlag) => {
    if (countryName === "World") {
      document.getElementById(countryName).src = "assets/world_image.png";
    } else {
      document.getElementById(countryName).src = imageFlag;
    }
  });
}

/*@Purpose : create a component (div) with the country information
 * @param country : json object with the country information
 */
function createComponents(country) {
  //Creating a div that contains the information of the country
  var div = document.createElement("div");
  div.className = "style";
  div.id = `container${country.country}`;

  //Creating the image
  var countryImageElement = document.createElement("img");
  countryImageElement.id = country.country;

  //Creating the title that contains the name of the country
  var countryNameElement = document.createElement("h2");
  countryNameElement.innerHTML = country.country;

  //Creating a paragraph that contains the total cases number
  var totalCasesElement = document.createElement("p");
  totalCasesElement.innerText = `Total de casos : ${formatNumber(
    country.cases
  )}`;

  //Creating a paragraph that contains the total deaths number
  var totalDeathsElement = document.createElement("p");
  totalDeathsElement.innerText = `Total de muertes : ${formatNumber(
    country.deaths
  )}`;

  //Creating a paragraph that contains the total recovered number
  var totalRecoveredElement = document.createElement("p");
  totalRecoveredElement.innerText = `Total de recuperados : ${formatNumber(
    country.recovered
  )}`;

  //Adding the div to the father div
  document.getElementById("Countries").appendChild(div);

  //Adding the elements to the div
  div.appendChild(countryImageElement);
  div.appendChild(countryNameElement);
  div.appendChild(totalCasesElement);
  div.appendChild(totalDeathsElement);
  div.appendChild(totalRecoveredElement);
}

/*@Purpose : call the function that obtains the information of a country getByCountry()
 * @param event : event of the searchbox
 */
function getCountryName(event) {
  if (event.keyCode == 13) {
    if (searchbox.value !== "") {
      getByCountry(searchbox.value);
    }
  }
}

/*
 * @Purpose : get the information of the world
 */
function getTotalCases() {
  var uri = "https://coronavirus-19-api.herokuapp.com/all";

  fetch(uri)
    .then((total) => {
      return total.json();
    })
    .then(renderTotal)
    .catch(() => {
      var messageError =
        "Error when trying to get the information from all the world";
      console.log(messageError);
    });
}

/*@Purpose : rendering the world information on the dom
 * @param total : json Object with the total cases
 */
function renderTotal(total) {
  var totalCasesElement = document.getElementById("_totalCases");
  var totalDeathsElement = document.getElementById("_totalDeaths");
  var totalRecoveredElement = document.getElementById("_totalRecovered");

  totalCasesElement.innerText = formatNumber(total.cases);
  totalDeathsElement.innerText = formatNumber(total.deaths);
  totalRecoveredElement.innerText = formatNumber(total.recovered);
}

/*@Purpose : get the information to the specific country
 * @param country : name of the country
 */
function getByCountry(country) {
  var uri = `https://coronavirus-19-api.herokuapp.com/countries/${country}`;
  fetch(uri)
    .then((totalCountry) => {
      return totalCountry.json();
    })
    .then(renderTotalCountry)
    .catch(() => {
      var messageError =
        "Error when trying to get the information to the specific country";
      console.log(messageError);
    });
}

/*@Purpose : remove all childs of the element
 * @param total : element of the dom
 */
function deleteChilds(element) {
  if (element.hasChildNodes()) {
    while (element.childNodes.length >= 1) {
      element.removeChild(element.firstChild);
    }
  }
}

/*@Purpose : rendering the specific conuntry information on the dom
 * @param total : json Object with the country information
 */
function renderTotalCountry(country) {
  //Showing the element that contains the information of a specific country
  var specificCountryDiv = document.querySelector(".specificCountry");
  deleteChilds(specificCountryDiv);
  specificCountryDiv.style.display = "flex";

  //Hiding the element that contains all countries
  document.querySelector(".AllCountries").style.display = "none";
  document.querySelector(".more").style.display = "none";

  //Creating all the elements that contains the country information
  var footerSpecificCountryElement = document.createElement("div");
  footerSpecificCountryElement.className = "footer";

  var totalActiveCasesElement = document.createElement("h3");
  totalActiveCasesElement.innerText = `Total de casos activos : ${formatNumber(
    country.active
  )}`;

  var todayCasesElement = document.createElement("h3");
  todayCasesElement.innerText = `Total de casos de hoy : ${formatNumber(
    country.todayCases
  )}`;

  var todayDeathsElement = document.createElement("h3");
  todayDeathsElement.innerText = `Total de muertes de hoy : ${formatNumber(
    country.todayDeaths
  )}`;

  var CriticalElement = document.createElement("h3");
  CriticalElement.innerText = `Pacientes en estado critico : ${formatNumber(
    country.critical
  )}`;

  //adding the elements in the footer element(div)
  footerSpecificCountryElement.appendChild(totalActiveCasesElement);
  footerSpecificCountryElement.appendChild(todayCasesElement);
  footerSpecificCountryElement.appendChild(todayDeathsElement);
  footerSpecificCountryElement.appendChild(CriticalElement);

  //Adding the information to the father div
  var headerSpecificCountryElement = cloneElement(
    `container${country.country}`
  );
  specificCountryDiv.appendChild(headerSpecificCountryElement);
  specificCountryDiv.appendChild(footerSpecificCountryElement);
}
/*@Purpose : clone an existing element
 * @param total : id of the element to be removed
 */
function cloneElement(name) {
  var c = document.getElementById(name);
  var clon = c.cloneNode(name);
  return clon;
}
