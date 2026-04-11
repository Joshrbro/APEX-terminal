let clearance = 0;
let data = [];
let personnel = [];

const APEX_USER = "https://opensheet.elk.sh/1m6_gEFaYBRO-BhacApVayO5qAZJMuWN2LBnv7H4zK4U/Users";
const APEX_ARTI = "https://opensheet.elk.sh/1m6_gEFaYBRO-BhacApVayO5qAZJMuWN2LBnv7H4zK4U/Artifacts";
const APEX_ENTI = "https://opensheet.elk.sh/1m6_gEFaYBRO-BhacApVayO5qAZJMuWN2LBnv7H4zK4U/Entities";
const APEX_SITE = "https://opensheet.elk.sh/1m6_gEFaYBRO-BhacApVayO5qAZJMuWN2LBnv7H4zK4U/Sites";

function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    fetch(APEX_USER).then(res => res.json()).then(rows => {
        personnel = rows;

        const found = rows.find(p => p.username === user && p.password === pass);

        if (found) {
            clearance = parseInt(found.clearance);
            document.getElementById("clearnaceDisplay").innerText = clearance;
            document.getElementById("agentName").innerText = found.last;
            switchScreen("menuScreen");
        }
        else {
            document.getElementById("loginMsg").innerText = "ACCESS DENIED";
        }
    });
    /*
    if (pass === "containment") {
        clearance = 3; // change per player if you want
        switchScreen("menuScreen");
        document.getElementById("clearanceDisplay").innerText = clearance;
    } else {
        document.getElementById("loginMsg").innerText = "ACCESS DENIED";
    }
    */
}

function switchScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

function showDatabase() {
    switchScreen("dbScreen");

    fetch(APEX_ARTI)
        .then(res => res.json())
        .then(rows => {
            data = rows;
            const list = document.getElementById("dbList");
            list.innerHTML = "";

            rows.forEach((row, i) => {
                if (parseInt(row.clearance) <= clearance) {
                    const div = document.createElement("div");
                    div.innerHTML = `<button onclick="openReport(${i})">${row.discovery} | ${row.name} | CONTAINED:${row.contained}</button>`;
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
    <h2>${row.discovery} - ${row.name}</h2>
    <p><strong>IDENTIFIERS:</strong> ${row.identifiers}</p>
    <p><strong>CONTAINED:</strong> ${row.contained}</p>

    <h3>PLACE OF ORIGIN</h3>
    <p>${row.origin}</p>

    <h3>DESCRIPTION</h3>
    <p>${row.description}</p>
  `;
}

function goMenu() {
    switchScreen("menuScreen");
}
