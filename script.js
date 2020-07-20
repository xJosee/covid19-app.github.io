
window.onload = function () {
  getAllCountries();
  getTotalCases();
};

const searchbox = document.querySelector(".search-box");
searchbox.addEventListener("keypress", getCountryName);
searchbox.addEventListener("keyup", function () {
  if (searchbox.value === "") {
    document.querySelector(".contentCountry").style.display = "none";
    document.querySelector(".byCountry").style.display = "grid";
  }
});

/*  @Purpose : get all countries
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
    .catch((error) => {
      console.log("Algo ha salido mal " + error);
    });
}

/*  @Purpose : get the flag of a specific country
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
      console.log("Algo ha salido mal " + error);
    });
}

/*  @Purpose : get the value of the getFlag() function and assign the image to the country component
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

/*  @Purpose : create a component (div) with the country information
 	* @param country : json object with the country information
	*/
function createComponents(country) {

  //Creating a div that contains the information of the country
  var div = document.createElement('div');
  div.className = 'style';

  //Creating the image 
  var img = document.createElement('img');
  img.id = country.country;

  //Creating the title that contains the name of the country
  var h2 = document.createElement('h2');
  h2.innerHTML = country.country;

  //Creating a paragraph that contains the total cases number
  var totalCases = document.createElement('p');
  totalCases.innerText = 'Total de casos : '+ country.cases;
  
  //Creating a paragraph that contains the total deaths number
  var totalDeaths = document.createElement('p');
  totalDeaths.innerText = 'Total de muertes : '+ country.deaths;

  //Creating a paragraph that contains the total recovered number
  var totalRecovered = document.createElement('p');
  totalRecovered.innerText = 'Total de recuperados : '+ country.recovered;
  
  //Adding the div to the father div
  document.getElementById("Countries").appendChild(div);
  
  //Adding the elementos the the div
  div.appendChild(img);
  div.appendChild(h2);
  div.appendChild(totalCases);
  div.appendChild(totalDeaths);
  div.appendChild(totalRecovered);

}


function getCountryName(event) {
  if (event.keyCode == 13) {
    getByCountry(searchbox.value);
  }
}

function getTotalCases() {

  var uri = 'https://coronavirus-19-api.herokuapp.com/all';

  fetch(uri)
    .then((total) => {
      return total.json();
    })
    .then(renderTotal)
    .catch((error) => console.log("Algo ha salido mal "+error));
}

function renderTotal(total) {
  document.getElementById("_totalCases").innerText = new Intl.NumberFormat().format(total.cases);
  document.getElementById("_totalDeaths").innerText = new Intl.NumberFormat().format(total.deaths);
  document.getElementById("_totalRecovered").innerText = new Intl.NumberFormat().format(total.recovered);
}

function getByCountry(country) {
  var uri = `https://coronavirus-19-api.herokuapp.com/countries/${country}`;
  fetch(uri)
    .then((totalCountry) => {
      return totalCountry.json();
    })
    .then(renderTotalCountry)
    .catch((error) => {
      console.log("Algo ha salido mal.");
    });
}

function renderTotalCountry(totalCountry) {
  document.querySelector(".contentCountry").style.display = "flex";
  document.querySelector(".byCountry").style.display = "none";
  document.querySelector(".CountryName").innerText = totalCountry.country;
  document.querySelector(".TotalCases").innerText =
    "Total de casos : " + totalCountry.cases;
  document.querySelector(".TotalDeaths").innerText =
    "Total de muertes : " + totalCountry.deaths;
  document.querySelector(".TotalRecovered").innerText =
    "Total de recuperados : " + totalCountry.recovered;
  document.querySelector(".TotalCasesActive").innerText =
    "Total de casos activos : " + totalCountry.active;
  document.querySelector(".TodayCases").innerText =
    "Total de casos el día de hoy : " + totalCountry.todayCases;
  document.querySelector(".TodayDeaths").innerText =
    "Total de muertes el día de hoy : " + totalCountry.todayDeaths;
  document.querySelector(".Critical").innerText =
    "Pacientes en estado critico : " + totalCountry.critical;
}
