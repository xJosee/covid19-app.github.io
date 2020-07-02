const totalCases = document.getElementById("_totalCases");
const totalDeaths = document.getElementById("_totalDeaths");
const totalRecovered = document.getElementById("_totalRecovered");

window.onload = function () {
  getAllCountries();
  getTotalCases();
};

const searchbox = document.querySelector(".search-box");
searchbox.addEventListener("keypress", getCountryName);
searchbox.addEventListener("keyup", function () {
  if (searchbox.value === "") {
    document.querySelector(".contentCountry").style.display = "none";
    document.querySelector(".byCountry").style.display = "flex";
  }
});

function getAllCountries() {
  fetch("https://coronavirus-19-api.herokuapp.com/countries")
    .then((all) => {
      return all.json();
    })
    .then(data=> data.forEach((country)=>{

      var $country = country.country;
      document.getElementById("Countries").innerHTML +=
      '<div class="a1" id="a1">' +
      '<h2>' + $country +'</h2>'+
      '<p> Total de casos : '+country.cases+'</p>'+
      '<p> Total de muertes : '+country.deaths+'</p>'+
      '<p> Total de recuperados : '+country.recovered+'</p>'+
      '</div>';

    }))
    .catch((error) => {
      console.log("Algo ha salido mal " + error);
    });
}

function getFlag(country) {
  return fetch("https://restcountries.eu/rest/v2/name/" + country)
    .then(($country) => {
      return $country.json();
    })
    .then((data)=>{
      document.getElementById("a1").innerHTML +=
      '<img src='+data[0].flag+'>';
    })
    .catch((error) => {
      console.log("Algo ha salido mal " + error);
    });
}


function getCountryName(event) {
  if (event.keyCode == 13) {
    getByCountry(searchbox.value);
  }
}

function getTotalCases() {
  fetch(" https://coronavirus-19-api.herokuapp.com/all")
    .then((total) => {
      return total.json();
    })
    .then(renderTotal)
    .catch((error) => console.log("Algo ha salido mal"));
}

function renderTotal(total) {
  totalCases.innerText = new Intl.NumberFormat().format(total.cases);
  totalDeaths.innerText = new Intl.NumberFormat().format(total.deaths);
  totalRecovered.innerText = new Intl.NumberFormat().format(total.recovered);
}

function getByCountry(country) {
  fetch(`https://coronavirus-19-api.herokuapp.com/countries/${country}`)
    .then((totalCountry) => {
      return totalCountry.json();
    })
    .then(renderTotalCountry)
    .catch((error) => {
      console.log("Algo ha salido mal.");
    });
}

function renderTotalCountry(totalCountry) {
  document.querySelector(".contentCountry").style.display = "block";
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
