let incidents = JSON.parse(localStorage.getItem("incidents")) || [];
let sortAsc = true;

const form = document.getElementById("incidentForm");
const tableBody = document.querySelector("#incidentTable tbody");
const statusFilter = document.getElementById("statusFilter");
const priorityFilter = document.getElementById("priorityFilter");
const search = document.getElementById("search");

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
  const date = new Date().toLocaleString();

  incidents.push({ user, issue, priority, status: "Otvoren", date });
  saveIncidents();
  form.reset();
});

function renderTable() {
  tableBody.innerHTML = "";
  let filtered = incidents.filter((i) => {
    return (
      (statusFilter.value === "All" || i.status === statusFilter.value) &&
      (priorityFilter.value === "All" || i.priority === priorityFilter.value) &&
      (i.user.toLowerCase().includes(search.value.toLowerCase()) ||
       i.issue.toLowerCase().includes(search.value.toLowerCase()))
    );
  });

  document.getElementById("totalCount").textContent = filtered.length;

  filtered.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.date}</td>
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
  const counts = { Otvoren: 0, Rešen: 0 };

  incidents.forEach((i) => counts[i.status]++);

  if (window.myChart) window.myChart.destroy();

  window.myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Otvoreni", "Rešeni"],
      datasets: [
        {
          label: "Broj incidenata",
          data: [counts.Otvoren, counts.Rešen],
          backgroundColor: ["orange", "green"],
        },
      ],
    },
  });
}

function sortByDate() {
  incidents.sort((a, b) => {
    const da = new Date(a.date), db = new Date(b.date);
    return sortAsc ? da - db : db - da;
  });
  sortAsc = !sortAsc;
  saveIncidents();
}

function exportCSV() {
  let csv = "Datum,Korisnik,Opis,Prioritet,Status\n";
  incidents.forEach(i => {
    csv += `${i.date},${i.user},${i.issue},${i.priority},${i.status}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "incidenti.csv";
  link.click();
}

search.addEventListener("input", renderTable);
statusFilter.addEventListener("change", renderTable);
priorityFilter.addEventListener("change", renderTable);

renderTable();
renderChart();

// Init
renderTable();
renderChart();
