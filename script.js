const allCountries = getAllCountries();
let itemsNumber = 1;
let scrollY = 0;
const searchbox = document.querySelector(".search-box");
const morebtn = document.querySelector(".more");
const toggleSwitch = document.querySelector(
  '.theme-switch input[type="checkbox"]'
);
const linkedln = document.querySelector(".linkedln");
const instagram = document.querySelector(".instagram");
const gmail = document.querySelector(".gmail");

window.onload = () => {
  setTimeout(function () {
    renderCountries();
    getTotalCases();
  }, 2500);
};

let cont = 0;

window.onscroll = function () {
  scrollY = window.scrollY;
  var scrollHeight = $(document).height();
  var scrollPosition = $(window).height() + $(window).scrollTop();
  if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
    morebtn.style.display = "none";
    document.querySelector(".loader-info").style.display = "block";
    setTimeout(function () {
      renderCountries();
    }, 1500);
  }
};

/* Social media redirect to */
linkedln.addEventListener("click", () => {
  window.open("https://www.linkedin.com/in/jose-luis-herrera-84b2b8195/");
});

instagram.addEventListener("click", () => {
  window.open("https://www.instagram.com/jose.lhm");
});

gmail.addEventListener("click", () => {
  window.open("https://mail.google.com/mail/u/0/#inbox?compose=new");
});

toggleSwitch.addEventListener("change", (e) => {
  if (e.target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
});

/*Show 12 more countries*/
morebtn.addEventListener("click", () => {
  morebtn.style.display = "none";
  document.querySelector(".loader-info").style.display = "block";
  setTimeout(function () {
    renderCountries();
  }, 1500);
});

/*@Purpose : call the function that obtains the information of a country getByCountry()
 * @param event : event of the searchbox
 */
searchbox.addEventListener("keypress", (event) => {
  if (event.keyCode == 13) {
    if (searchbox.value !== "") {
      getByCountry(searchbox.value);
    }
  }
});

//Verifing if the searchbox is empty
searchbox.addEventListener("keyup", () => {
  if (searchbox.value === "") {
    document.querySelector(".specificCountry").style.display = "none";
    document.querySelector(".AllCountries").style.display = "grid";
    morebtn.style.display = "block";
  }
});

/*
 * @Purpose : formatting a comma-separated number
 * @param : a number
 */
function formatNumber(number) {
  return new Intl.NumberFormat().format(number);
}

/*
 * @Purpose : call the methods to render
 */
function renderCountries() {
  let aux = itemsNumber;
  allCountries.then((data) => {
    for (let i = aux; i < 12 + aux; i++) {
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
  document.querySelector(".loader-info").style.display = "none";
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

  //Creating the div header that contains the country information
  var headerSpecificCountryElement = document.createElement("div");
  headerSpecificCountryElement.className = "header";

  //Creating the div footer that contains the country information
  var footerSpecificCountryElement = document.createElement("div");
  footerSpecificCountryElement.className = "footerDiv";

  //Calling the methods for inserting the information in the divs
  informationHeader(headerSpecificCountryElement, country);
  informationFooter(footerSpecificCountryElement, country);

  //Adding the elements to the father div
  specificCountryDiv.appendChild(headerSpecificCountryElement);
  specificCountryDiv.appendChild(footerSpecificCountryElement);
}

/*
 * @Purpose : insert the country info
 * @param element : html element
 * @param country : json Object with the country info
 */
function informationFooter(element, country) {
  element.innerHTML += `
    <h3>Total de casos activos : ${formatNumber(country.active)}</h3>
    <h3>Total de casos de hoy : ${formatNumber(country.todayCases)}</h3>
    <h3>Total de muertes de hoy : ${formatNumber(country.todayDeaths)}</h3>
    <h3>Total de cases criticos : ${formatNumber(country.critical)}</h3>
  `;
}

/*
 * @Purpose : insert the country info
 * @param element : html element
 * @param country : json Object with the country info
 */
function informationHeader(element, country) {
  element.innerHTML += `
    <h1>${country.country}</h1>
    <h3>Total de casos : ${formatNumber(country.cases)}</h3>
    <h3>Total de muertes : ${formatNumber(country.deaths)}</h3>
    <h3>Total de recuperados : ${formatNumber(country.recovered)}</h3>
  `;
}
