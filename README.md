# Morphologic Interview Tasks

Completed version - Siva Kumar Pasupuleti

This repo contains solution for the below tasks.

## Task 1

A bug has been introduced that's preventing the content from loading, can you identify the issue and fix it?

## Task 2

Currently the date tabs are non-functional. We'd like users to be able to click on the tab to show data for the corresponding day.

- Clicking a tab should apply the active class to the selected tab
- The active class should be removed from any non selected tabs
- The table contents should be updated to display the correct hourly data for the selected day

## Task 3

There is no feedback to the user when they have selected a location until the data is rendered. We'd like to let them know their input is being processed by displaying a loading spinner.

- While any api requests are being made display a loading spinner in place of the main content
- Should be removed when the request is finished
- Correct data should be displayed on request complete

## Task 4

There has been a request from ours users that we display precipitation data in addition to temperature. We'd like you to fetch this data and display it in a new row of the table.

- Should update the api call to fetch precipitation data as well as temperature data
- Should be displayed in a new row in the table alongside temperature

## Task 5

Our users would like to customise their weather metric view.

- Pick at least 5 metrics from the open-meteo api
- Display these as checkboxes in a row under the location select box
- Refetch the table data as needed to get the selected metrics
