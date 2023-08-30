//Metric values for UI
const metricUIvalues = {
  rain: "Rain",
  showers: "Showers",
  snowfall: "Snowfall",
  visibility: "Visibility",
  weathercode: "Weather Code",
  apparent_temperature: "Apparent Temperature",
};


export class TableController {

  _element;


  _selectedDay = "";

  //initializing so they are accessible throughout the controller file
  _processedData = {}; 

  _selectedMetrics = []; 

  constructor() {
    this._element = document.getElementById("table-container");
  }

  renderData(data, selectedMetrics) {
    this._selectedMetrics = selectedMetrics; 
    this._processedData = data.hourly.time.reduce((acc, cur, index) => {
      const dateTime = new Date(cur);
      const day = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(dateTime);
      const time = new Intl.DateTimeFormat("en-DB", {
        hour: "numeric",
        minute: "numeric",
      }).format(dateTime);
  
      const hourData = { time };
  
      hourData.temperature_2m = data.hourly.temperature_2m[index];
      hourData.precipitation_probability = data.hourly.precipitation_probability[index];
      hourData.precipitation = data.hourly.precipitation[index];
  
      selectedMetrics.forEach((metric) => {
        hourData[metric] = data.hourly[metric][index];
      });
  
      if (acc.hasOwnProperty(day)) {
        acc[day].push(hourData);
      } else {
        acc[day] = [hourData];
      }
      return acc;
    }, {});

    console.log(this._processedData)
  
    this._selectedDay = Object.keys(this._processedData)[0];
  
    const markup = this.generateMarkup(this._processedData, selectedMetrics);
    this._element.innerHTML = markup;
    this.bindEventListeners();

    //adding the metrics checkboxes along with the table response
    const checkboxContainer = document.getElementById("metric-checkboxes");
    checkboxContainer.style.display = "block";
  }

  
  selectDay(key) {
    this._selectedDay = key;
    this.updateTableContent(); 
    }

    //this will change the active class to the selected tab
    updateTabActivation(selectedTab) {
      const dateTabs = this._element.querySelectorAll(".nav-link");
  
      dateTabs.forEach((tab) => {
        tab.classList.remove("active");
      });
  
      selectedTab.classList.add("active");
    }

    //Once the tab is clicked it generates the table data alone
    updateTableContent() {
      const markup = this.generateTableContentMarkup(this._processedData, this._selectedMetrics);
      this._element.querySelector(".table").innerHTML = markup;
    }
    
    //event listener when there is click in the tab, update the content in the UI
    bindEventListeners() {
      const dateTab = this._element.querySelectorAll(".nav-link")
      dateTab.forEach((tab) => {
        tab.addEventListener("click", () => {
          const selectedDay = tab.getAttribute("data-day");
          console.log(selectedDay)
          this.selectDay(selectedDay);
          this.updateTabActivation(tab);
        });
      });
    }

    //Generate Markup without tabs, helps in tab selection
    generateTableContentMarkup(processedData, selectedMetrics) {
      let tableContentMarkup = "";
    
      if (processedData) {
        console.log(processedData)
        tableContentMarkup = `
          <table class="table">
            <tr>
              <th scope="col">
                Time
              </th>
              ${processedData[this._selectedDay]
                .map((item) => {
                  return `
                    <th>
                      ${item.time}
                    </th>
                  `;
                })
                .join("")}
            </tr>
            <tr>
              <th scope="col">
                Temperature (&deg;C)
              </th>
              ${processedData[this._selectedDay]
                .map((item) => {
                  return `
                    <td>
                      ${item.temperature_2m.toString()}
                    </td>
                  `;
                })
                .join("")}
            </tr>
            <tr>
              <th scope="col">
                Precipitation Probability (%)
              </th>
              ${processedData[this._selectedDay]
                .map((item) => {
                  return `
                    <td>
                      ${item.precipitation_probability}%
                    </td>
                  `;
                })
                .join("")}
            </tr>
            <tr>
              <th scope="col">
                Precipitation (mm)
              </th>
              ${processedData[this._selectedDay]
                .map((item) => {
                  return `
                    <td>
                      ${item.precipitation}
                    </td>
                  `;
                })
                .join("")}
            </tr>
            ${
              selectedMetrics && selectedMetrics.length > 0
                ? selectedMetrics
                    .map((metric) => {
                      return `
                        <tr>
                          <th scope="col">
                            ${metricUIvalues[metric]}
                          </th>
                          ${processedData[this._selectedDay]
                            .map((item) => {
                              return `
                                <td>
                                  ${item[metric] !== undefined ? item[metric] : "-"}
                                </td>
                              `;
                            })
                            .join("")}
                        </tr>`;
                    })
                    .join("")
                : ""
            }
          </table>
        `;
      }
    
      return tableContentMarkup;
    }
  

  //Generate Markup with tabs.
  generateMarkup(processedData, selectedMetrics) {
    console.log(processedData)
    let markup = `
    <ul class="nav nav-tabs">
    ${Object.keys(processedData)
      .map((key, index) => {
        return `
        <li class="nav-link ${index === 0 ? "active" : ""}" data-day="${key}">
        <p>${key}</p>
          </li>
        `;
      })
      .join("")}
  </ul>`;

    markup += `
    <table class="table">
      <tr>
        <th scope="col">
          Time
        </th>
        ${processedData[this._selectedDay]
          .map((item) => {
            return `
              <th>
                ${item.time}
              </th>
            `;
          })
          .join("")}
      </tr>`;
    markup += `
      <tr>
        <th scope="col">
          Temperature (&deg;C)
        </th>
        ${processedData[this._selectedDay]
          .map((item) => {
            return `
              <td>
                ${item.temperature_2m.toString()}
              </td>
            `;
          })
          .join("")}
      </tr>
      <tr>
        <th scope="col">
          Precipitation Probability (%)
        </th>
        ${processedData[this._selectedDay]
          .map((item) => {
            return `
              <td>
                ${item.precipitation_probability}%
              </td>
            `;
          })
          .join("")}
      </tr>
      <tr>
        <th scope="col">
          Precipitation (mm)
        </th>
        ${processedData[this._selectedDay]
          .map((item) => {
            return `
              <td>
                ${item.precipitation}
              </td>
            `;
          })
          .join("")}
      </tr>`;
    if (selectedMetrics && selectedMetrics.length > 0) {
      selectedMetrics.forEach((metric) => {
        markup += `
          <tr>
            <th scope="col">
              ${metricUIvalues[metric]}
            </th>
            ${processedData[this._selectedDay]
              .map((item) => {
                return `
                  <td>
                    ${item[metric] !== undefined ? item[metric] : "-"}
                  </td>
                `;
              })
              .join("")}
          </tr>`;
      });
    }

    markup += `
    </table>`;

    return markup;
  }
 }