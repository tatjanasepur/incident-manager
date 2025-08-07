let incidents = JSON.parse(localStorage.getItem("incidents")) || [];

const form = document.getElementById("incidentForm");
const tableBody = document.querySelector("#incidentTable tbody");

function saveIncidents() {
  localStorage.setItem("incidents", JSON.stringify(incidents));
  renderTable();
  renderChart();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = document.getElementById("user").value;
  const issue = document.getElementById("issue").value;
  const priority = document.getElementById("priority").value;

  incidents.push({ user, issue, priority, status: "Otvoren" });
  saveIncidents();
  form.reset();
});

function renderTable() {
  tableBody.innerHTML = "";
  incidents.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.user}</td>
      <td>${item.issue}</td>
      <td>${item.priority}</td>
      <td>${item.status}</td>
      <td>
        <button class="done" onclick="markDone(${index})">Rešen</button>
        <button class="delete" onclick="deleteIncident(${index})">Obriši</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function markDone(index) {
  incidents[index].status = "Rešen";
  saveIncidents();
}

function deleteIncident(index) {
  incidents.splice(index, 1);
  saveIncidents();
}

function renderChart() {
  const ctx = document.getElementById("chart").getContext("2d");
  const statusCounts = {
    Otvoren: 0,
    Rešen: 0,
  };

  incidents.forEach((i) => statusCounts[i.status]++);

  if (window.myChart) window.myChart.destroy();

  window.myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Otvoreni", "Rešeni"],
      datasets: [
        {
          label: "Broj incidenata",
          data: [statusCounts.Otvoren, statusCounts.Rešen],
          backgroundColor: ["orange", "green"],
        },
      ],
    },
  });
}

// Init
renderTable();
renderChart();
