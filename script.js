const totalCases = document.getElementById("_totalCases");
const totalDeaths = document.getElementById("_totalDeaths");
const totalRecovered = document.getElementById("_totalRecovered");

$(window).on("load",function(){
  $(".loader-wrapper").fadeOut("slow");
});

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

function getAllCountries() {
  fetch("https://coronavirus-19-api.herokuapp.com/countries")
    .then((all) => {
      return all.json();
    })
    .then(data => data.forEach((country)=>{

      var $country = country.country;
      document.getElementById("Countries").innerHTML +=
      '<div class="style">' +
      '<img src="" id="'+$country+'">'+
      '<h2>' + $country +'</h2>'+
      '<p> <span>Total de casos</span> : '+new Intl.NumberFormat().format(country.cases)+'</p>'+
      '<p> <span>Total de muertes</span> : '+new Intl.NumberFormat().format(country.deaths)+'</p>'+
      '<p> <span>Total de recuperados</span> : '+new Intl.NumberFormat().format(country.recovered)+'</p>'+
      '</div>';

      getFlag($country).then((data)=>{
        if($country === 'World'){
          document.getElementById($country).src = 'https://3.bp.blogspot.com/-HAHIYkwxoqc/UkHfRet_AgI/AAAAAAAADF8/JSkVDcTNlJE/s1600/banderas+mundo.png';
        }
        else{
          document.getElementById($country).src = data;
        } 
      })
    }))
    .catch((error) => {
      console.log("Algo ha salido mal " + error);
    });
}

function getFlag(country) {
  return fetch("https://restcountries.eu/rest/v2/name/"+country)
    .then(($country) => {
      return $country.json();
    })
    .then((data)=>{
        return data[0].flag;
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
