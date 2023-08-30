import { TableController } from "./controllers/tableController.js";

const tableController = new TableController();

const LOCS = {
  London: { lat: 51.5085, long: -0.1257 },
  Cardiff: { lat: 51.48, long: -3.18 },
  Birmingham: { lat: 52.4814, long: -1.8998 },
  Nottingham: { lat: 52.9536, long: -1.1505 },
  Manchester: { lat: 53.4809, long: -2.2374 },
  Wakefield: { lat: 53.6833, long: -1.4977 },
  Leeds: { lat: 53.7965, long: -1.5478 },
};

function getLocationSelect() {
  return document.getElementById("locations");
}

function setLocations() {
  const locationSelect = getLocationSelect();

  for (const [key, value] of Object.entries(LOCS)) {
    const newOption = new Option(key, key);
    locationSelect.add(newOption, undefined);
  }
  locationSelect.value = "";
}

//function to get the select metrics
function getSelectedMetrics() {
  const metricCheckboxes = document.querySelectorAll("#metric-checkboxes input[type='checkbox']");
  const selectedMetrics = [];
  metricCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedMetrics.push(checkbox.value);
    }
  });
  return selectedMetrics;
}

function onSelectChange(e) {
  const locationSelect = e.target;
  const coords = LOCS[e.target.value];

  //Display the spinner when API call is made
  const loadingSpinner = document.getElementById("loading-spinner");
  loadingSpinner.classList.remove("d-none");

  ApiCall(coords, loadingSpinner);
}

//function that makes the API call by considering the metrics(if user selects)
function ApiCall(coords, loadingSpinner) {
  let apiEndpoint = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.long}&hourly=temperature_2m,precipitation,precipitation_probability`;

  const MetricstoAPI = getSelectedMetrics();
  if (MetricstoAPI.length > 0) {
    apiEndpoint += `,${MetricstoAPI.join(',')}`;
  }

  console.log(apiEndpoint)

  fetch(apiEndpoint)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
     // console.log(data)
      tableController.renderData(data, MetricstoAPI);
      loadingSpinner.classList.add("d-none");
    });
}

function init() {
  setLocations();

  const locationSelect = getLocationSelect();
  locationSelect.addEventListener("change", onSelectChange);

  //event listener for metrics checkbox
  const metricCheckboxes = document.querySelectorAll("#metric-checkboxes input[type='checkbox']");
  metricCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const selectedLocation = getLocationSelect().value;
      console.log("update code is getting executed")
      ApiCall(LOCS[selectedLocation], document.getElementById("loading-spinner"));   
     });
  });
}

init();
