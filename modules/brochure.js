// import * as rest from "/modules/rest.js";
export { getData };

document.addEventListener("DOMContentLoaded", start);
let databaseData = [];
let storageData;

function start() {
  storageData = JSON.parse(window.localStorage.getItem("form"));
  console.log(storageData);
  //rest.get();
}

function getData(data) {
  databaseData = data;
  getPerson();
}

function getPerson() {
  databaseData.forEach((data) => {
    if (data.first_name === storageData.first_name && data.email === storageData.email) {
      const person = data;
      person.times_visited = storageData.times_visited;
      //console.log("Data in Database", person);
      rest.put(person._id, person);
    }
  });
}
