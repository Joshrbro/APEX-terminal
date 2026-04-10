const input = document.getElementById("input");
const output = document.getElementById("output");

let clearance = 1;

input.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    const command = input.value;
    input.value = "";

    if (command === "login") {
      clearance = 2;
      output.innerText = "ACCESS GRANTED\nCLEARANCE LEVEL 2";
    } 
    else if (command === "list") {
      output.innerText =
        "SCP-173 (Level 1)\nSCP-682 (Level 4)";
    }
    else if (command === "open 682") {
      if (clearance < 4) {
        output.innerText = "ACCESS DENIED";
      } else {
        output.innerText = "Opening SCP-682 file...";
      }
    }
    else {
      output.innerText = "Unknown command";
    }
  }
});