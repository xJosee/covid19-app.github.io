
window.onload = function () {
  getAllCountries();
  getTotalCases();
};

const searchbox = document.querySelector(".search-box");
searchbox.addEventListener("keypress", getCountryName);

//Verifing if the searchbox is empty
searchbox.addEventListener("keyup", function () {
  if (searchbox.value === "") {
    document.querySelector(".specificCountry").style.display = "none";
    document.querySelector(".AllCountries").style.display = "grid";
  }
});

/* 
 * @Purpose : formatting a comma-separated number
 * @param : a number
*/
function formatNumber(number){
  return new Intl.NumberFormat().format(number);
}

/* 
 * @Purpose : get all countries
*/
function getAllCountries() {
  var uri = "https://coronavirus-19-api.herokuapp.com/countries";

  fetch(uri)
    .then((allCountries) => {
      return allCountries.json();
    })
    .then((countries) =>
    countries.forEach((country) => {
        //Create components with a country information
        createComponents(country);

        //Asign an image to each country component
        assignFlag(country.country);

        //Hiding the loading page
        document.querySelector(".loader-wrapper").style.display = "none";
      })
    )
    .catch(() => {
      var messageError = 'Error when trying to get the information from all the countries';
      console.log(messageError);
    });
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
      var messageError = 'Error when trying to get the image';
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
  var div = document.createElement('div');
  div.className = 'style';

  //Creating the image 
  var countryImageElement = document.createElement('img');
  countryImageElement.id = country.country;

  //Creating the title that contains the name of the country
  var countryNameElement = document.createElement('h2');
  countryNameElement.innerHTML = country.country;

  //Creating a paragraph that contains the total cases number
  var totalCasesElement = document.createElement('p');
  totalCasesElement.innerText = `Total de casos : ${formatNumber(country.cases)}`;
  
  //Creating a paragraph that contains the total deaths number
  var totalDeathsElement = document.createElement('p');
  totalDeathsElement.innerText = `Total de muertes : ${formatNumber(country.deaths)}`;

  //Creating a paragraph that contains the total recovered number
  var totalRecoveredElement = document.createElement('p');
  totalRecoveredElement.innerText = `Total de recuperados : ${formatNumber(country.recovered)}`;
  
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
    getByCountry(searchbox.value);
  }
}

/*
* @Purpose : get the information of the world 
*/
function getTotalCases() {

  var uri = 'https://coronavirus-19-api.herokuapp.com/all';

  fetch(uri)
    .then((total) => {
      return total.json();
    })
    .then(renderTotal)
    .catch(() => {
      var messageError = 'Error when trying to get the information from all the world';
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
      var messageError = 'Error when trying to get the information to the specific country'
      console.log(messageError);
    });
}

/*@Purpose : rendering the specific conuntry information on the dom
* @param total : json Object with the country information
*/
function renderTotalCountry(country) {

  //Showing the element that contains the information of a specific country
  document.querySelector(".specificCountry").style.display = "flex"
  //Hiding the element that contains all countries
  document.querySelector(".AllCountries").style.display = "none";

  
  var headerSpecificCountryDiv = document.querySelector('.header');
  var footerSpecificCountryDiv = document.querySelector('.footer');

  var countryNameElement = document.createElement('h2');
  countryNameElement.innerText = country.country;

  var totalCasesElement = document.createElement('h3');
  totalCasesElement.innerText = `Total de casos : ${formatNumber(country.cases)}`;

  var totalDeathsElement = document.createElement('h3');
  totalDeathsElement.innerText = `Total de muertes : ${formatNumber(country.deaths)}`;

  var totalRecoveredElement = document.createElement('h3');
  totalRecoveredElement.innerText = `Total de recuperados : ${formatNumber(country.recovered)}`;

  var totalActiveCasesElement = document.createElement('h3');
  totalActiveCasesElement.innerText = `Total de casos activos : ${formatNumber(country.active)}`;

  var todayCasesElement = document.createElement('h3');
  todayCasesElement.innerText = `Total de casos de hoy : ${formatNumber(country.todayCases)}`;

  var todayDeathsElement = document.createElement('h3');
  todayDeathsElement.innerText = `Total de muertes de hoy : ${formatNumber(country.todayDeaths)}`;

  var CriticalElement = document.createElement('h3');
  CriticalElement.innerText = `Pacientes en estado critico : ${formatNumber(country.critical)}`;

  //adding the elements in the header element(div)
  headerSpecificCountryDiv.appendChild(countryNameElement);
  headerSpecificCountryDiv.appendChild(totalCasesElement);
  headerSpecificCountryDiv.appendChild(totalDeathsElement);
  headerSpecificCountryDiv.appendChild(totalRecoveredElement);
  //adding the elements in the footer element(div)
  footerSpecificCountryDiv.appendChild(totalActiveCasesElement);
  footerSpecificCountryDiv.appendChild(todayCasesElement);
  footerSpecificCountryDiv.appendChild(todayDeathsElement);
  footerSpecificCountryDiv.appendChild(CriticalElement);

}
