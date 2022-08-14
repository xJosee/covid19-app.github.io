/**
 *  DECLARATIONS
 */

const morebtn = document.querySelector(".more");
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const linkedln = document.querySelector(".linkedln");
const instagram = document.querySelector(".instagram");
const gmail = document.querySelector(".gmail");

let itemsNumber = 1;
let scrollY = 0;

/**
 *  WINDOWS PROPERTIES
 */

window.onload = async () => {
    await renderCountries();
    await getTotalCases();
};
/**
 * EVENT LISTENERS
 */

/* Social media redirect to */
linkedln.addEventListener("click", () => {
    //window.open("https://www.linkedin.com/in/jose-luis-herrera-84b2b8195/");
});

instagram.addEventListener("click", () => {
    window.open("https://www.instagram.com/jose.lhm");
});

gmail.addEventListener("click", () => {
    window.open("mailto:josemherrera1923@gmail.com");
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
    setTimeout(function() {
        renderCountries();
    }, 1500);
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
async function renderCountries() {
    let aux = itemsNumber;
    const countries = await getAllCountries();
    for (let i = aux; i < 12 + aux; i++) {
        //Create components with a country information
        createComponents(countries[i]);
        //Asign an image to each country component
        await assignFlag(countries[i].country);
        itemsNumber++;
    }

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
async function getFlag(countryName) {
    const uri = `https://restcountries.com/v3.1/name/${countryName}`;
    const response = await fetch(uri);
    const data = await response.json();
    return Array.isArray(data) && data[0] && data[0].flags.svg;
}

/*@Purpose : get the value of the getFlag() function and assign the image to the country component
 * @param countryName : name of the country
 */
async function assignFlag(countryName) {
    const flag = await getFlag(countryName);
    document.getElementById(countryName).src = flag;
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

    
    /* Adding event listener */
    div.addEventListener(('click'),()=>{
        getFlag(`${country.country}`).then((imageFlag) => {
            const totalCases = `Total de Casos : ${formatNumber(country.cases)}`;
            const totalDeaths = `Total de muertes : ${formatNumber(country.deaths)}`;
            const totalRecovered = `Total de recuperados : ${formatNumber(country.recovered)}`;
            const todayCases = `Casos del día de hoy : ${formatNumber(country.todayCases)}`;
            const todayDeaths = `Total de muertes de hoy : ${formatNumber(country.todayDeaths)}`;
            swal({
                title: `${country.country}`,
                text: `${totalCases}\n${totalDeaths}\n${totalRecovered}\n${todayCases}\n${todayDeaths}`,
                icon: `${imageFlag}`,
                button: "close",
            });
        });
    });
}

/*
 * @Purpose : get the information of the world
 */
async function getTotalCases() {
    var uri = "https://coronavirus-19-api.herokuapp.com/all";
    const response = await fetch(uri);
    const data = await response.json();
    renderTotal(data);
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

    var flag = document.createElement('img');
    flag.id = country.country + "_";
    flag.className = 'specificCountryImg';

    getFlag(country.country).then((flag) => {
        document.getElementById(country.country + "_").src = flag;
    });
    //Creating the div footer that contains the country information
    var footerSpecificCountryElement = document.createElement("div");
    footerSpecificCountryElement.className = "footerDiv";

    //Calling the methods for inserting the information in the divs
    headerSpecificCountryElement.appendChild(flag);
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
    <h3>Total de casos criticos : ${formatNumber(country.critical)}</h3>
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
