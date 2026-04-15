let clearance = 0;
let data = [];
let personnel = [];

/*convert sheets images from https://drive.google.com/file/d/FILE_ID/... to https://drive.google.com/uc?export=view&id=FILE_ID *//*it doesn't work with sheets 'image' function*/

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
            document.getElementById("clearanceDisplay").innerText = clearance;
            document.getElementById("agentName").innerText = found.last;
            switchScreen("menuScreen");
        }
        else {
            document.getElementById("loginMsg").innerText = "ACCESS DENIED";
        }
    });
}

function switchScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

function idtoint(id) {
    return parseInt(id.replace("#", "").replace("-", ""));
}

function fixDriveUrl(url) {
    if (!url) return "";

    url = url.trim();

    // Extract FILE_ID from any drive link
    const match = url.match(/[-\w]{25,}/);
    if (match) {
        return `https://drive.google.com/thumbnail?id=${match[0]}&sz=w1000`;
    }

    return url;
}

function showDatabase() {
    switchScreen("dbScreen");

    fetch(APEX_ARTI).then(res => res.json()).then(rows => {
        //console.log("ARTIFACTS:", rows);
        data = rows;
        const list = document.getElementById("dbList");
        list.innerHTML = "";

        rows.forEach((row, i) => {
            if (parseInt(row.clearance) <= clearance) {
                const div = document.createElement("div");
                div.innerHTML = `
                    <button onclick="openReport(${i})">${row.discovery} | ${row.name} | CONTAINED: ${row.contained}</button>
                `;
                list.appendChild(div);
            }
        });
    }).catch(err => console.error("FETCH ERROR:", err));
}

function openReport(i) {
    const row = data[i];

    if (parseInt(row.clearance) > clearance) {
        alert("ACCESS DENIED");
        return;
    }

    switchScreen("reportScreen");

    const tags = row.tags
        ? row.tags.split(",").map(t => t.trim()).filter(t => t !== "")
        : [];
    const tagHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join("");

    const imageUrl = fixDriveUrl(row.url);
    console.log("IMAGE URL:", imageUrl);
//${imageUrl ? `<img src="${row.url}" style="max-width:300px;"><br>` : ""}
    document.getElementById("reportContent").innerHTML = `
        <h2>${row.discovery} - ${row.name}</h2>
        ${row.url ? `<img src="${imageUrl}" style="max-width:300px;"><br>` : ""}
        <p><strong>IDENTIFIERS:</strong> ${row.identifiers}</p>
        <p><strong>CONTAINED:</strong> ${row.contained}</p>

        <h3>PLACE OF ORIGIN</h3>
        <p>${row.origin}</p>

        <h3>DESCRIPTION</h3>
        <p>${row.description}</p>

        <h3>TAGS</h3>
        <div>${tagHTML}</div>
    `;
}

function goMenu() {
    switchScreen("menuScreen");
}
