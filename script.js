let clearance = 0;
let data = [];

const API_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQb-Q0KvwVyi_-QP6huF9_EEp_fV85t44zQyxeKrr60zcigUOVbOPIgUPXSwtTazvVqYWNOmg_asynX/pubhtml#gid=262187708";

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (pass === "containment") {
    clearance = 3; // change per player if you want
    switchScreen("menuScreen");
    document.getElementById("clearanceDisplay").innerText = clearance;
  } else {
    document.getElementById("loginMsg").innerText = "ACCESS DENIED";
  }
}

function switchScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function showDatabase() {
  switchScreen("dbScreen");

  fetch(API_URL)
    .then(res => res.json())
    .then(rows => {
      data = rows;
      const list = document.getElementById("dbList");
      list.innerHTML = "";

      rows.forEach((row, i) => {
        if (parseInt(row.clearance) <= clearance) {
          const div = document.createElement("div");
          div.innerHTML = `
            <button onclick="openReport(${i})">
              ${row.id} | ${row.class} | ${row.status}
            </button>
          `;
          list.appendChild(div);
        }
      });
    });
}

function openReport(i) {
  const row = data[i];

  if (parseInt(row.clearance) > clearance) {
    alert("ACCESS DENIED");
    return;
  }

  switchScreen("reportScreen");

  document.getElementById("reportContent").innerHTML = `
    <h2>${row.id} - ${row.name}</h2>
    <p><strong>CLASS:</strong> ${row.class}</p>
    <p><strong>STATUS:</strong> ${row.status}</p>

    <h3>CONTAINMENT PROCEDURES</h3>
    <p>${row.containment}</p>

    <h3>DESCRIPTION</h3>
    <p>${row.description}</p>
  `;
}

function goMenu() {
  switchScreen("menuScreen");
}
