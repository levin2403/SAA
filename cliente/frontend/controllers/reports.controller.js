import ClassSessionService from '../services/classSession.service.js';

// --- INSTANCIAMOS EL SERVICIO ---
const classSessionService = new ClassSessionService();

// --- 1. VALIDACIÓN DE SESIÓN ---
const user = JSON.parse(localStorage.getItem('user'));
const classes = JSON.parse(sessionStorage.getItem('classes'));

if (!user || user.rol !== 'PROFESSOR') {
    window.location.replace('login.html');
}
if (!classes) {
    window.location.replace('dashboard.html');
}

// --- 2. REFERENCIAS DOM ---
const filterClassSelect = document.getElementById('filterClass');
const filterStartDate = document.getElementById('filterStartDate');
const filterEndDate = document.getElementById('filterEndDate');
const searchBtn = document.getElementById('searchBtn');
const exportCSVBtn = document.getElementById('exportCSV');
const reportsTable = document.getElementById('reportsTable');
const tableHeaderRow = document.getElementById('tableHeaderRow');
const reportsTableBody = document.getElementById('reportsTableBody');
const reportsArea = document.getElementById('reportsArea');
const reportsStats = document.getElementById('reportsStats');

// --- 3. INICIALIZACIÓN ---
classes.forEach(c => {
    const option = document.createElement('option');
    option.value = c._id || c.id;
    option.textContent = c.name;
    filterClassSelect.appendChild(option);
});

const today = new Date();
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(today.getDate() - 30);

const formatDateLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

filterStartDate.value = formatDateLocal(thirtyDaysAgo);
filterEndDate.value = formatDateLocal(today);

// --- 4. LÓGICA PRINCIPAL ---
async function generateReport() {
    const classId = filterClassSelect.value;
    const sDate = filterStartDate.value;
    const eDate = filterEndDate.value;

    if (!classId) return alert("Por favor selecciona una materia.");
    if (sDate > eDate) return alert("La fecha de inicio no puede ser mayor a la final.");

    try {
        searchBtn.disabled = true;
        searchBtn.textContent = "Cargando...";

        // Usamos la instancia creada arriba
        const sessions = await classSessionService.getAttendancesByDates(
            classId, 
            user.id, 
            sDate, 
            eDate
        );

        renderMatrixTable(sessions);

    } catch (error) {
        console.error(error);
        alert("Error al cargar reporte: " + error.message);
        reportsTableBody.innerHTML = `<tr><td colspan="100" style="text-align:center;padding:20px;">Error al cargar datos.</td></tr>`;
    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = "Buscar";
    }
}

function renderMatrixTable(sessions) {
    if (!sessions || sessions.length === 0) {
        tableHeaderRow.innerHTML = '<th>Estado</th>';
        reportsTableBody.innerHTML = '<tr><td style="text-align:center;padding:20px;color:#6b7280">No se encontraron registros en este rango.</td></tr>';
        reportsArea.style.display = 'none';
        return;
    }

    const dateSet = new Set();
    const dateObjMap = {};

    sessions.forEach(session => {
        const dStr = session.date.substring(0, 10); 
        dateSet.add(dStr);
        dateObjMap[dStr] = new Date(session.date);
    });
    const sortedDates = Array.from(dateSet).sort();

    const studentsMap = new Map();

    sessions.forEach(session => {
        const dStr = session.date.substring(0, 10);
        session.attendances.forEach(record => {
            const studentId = record.id;
            const studentName = record.name;
            const status = record.status;

            if (!studentsMap.has(studentId)) {
                studentsMap.set(studentId, { id: studentId, name: studentName, attendance: {} });
            }
            studentsMap.get(studentId).attendance[dStr] = status;
        });
    });

    const studentsArray = Array.from(studentsMap.values()).sort((a, b) => a.name.localeCompare(b.name));

    let headerHTML = '<th style="text-align:left; padding-left:12px; min-width: 200px;">Alumno / ID</th>';
    sortedDates.forEach(dStr => {
        const datePretty = new Date(dStr + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
        headerHTML += `<th class="date-col">${datePretty}</th>`;
    });
    headerHTML += '<th style="width:60px">%</th>';
    tableHeaderRow.innerHTML = headerHTML;

    reportsTableBody.innerHTML = '';

    studentsArray.forEach(st => {
        const tr = document.createElement('tr');
        let rowHTML = `
          <td style="text-align:left; padding-left:12px">
            <div style="display:flex; flex-direction:column;">
              <span style="font-weight:bold; color:#1f2937;">${st.name}</span>
              <span style="color:#64748b; font-size:0.8rem">${st.id}</span>
            </div>
          </td>
        `;
        
        let presents = 0;
        let totalSessions = 0;

        sortedDates.forEach(dStr => {
            const status = st.attendance[dStr];
            let content = '-';
            let cellClass = 'status-none';

            if (status === 'PRESENT') {
                content = 'P';
                cellClass = 'status-present';
                presents++;
                totalSessions++;
            } else if (status === 'ABSENT') {
                content = 'F';
                cellClass = 'status-absent';
                totalSessions++;
            }
            
            rowHTML += `<td class="${cellClass}" style="text-align:center;">${content}</td>`;
        });

        const percent = totalSessions > 0 ? Math.round((presents / totalSessions) * 100) : 0;
        const pColor = percent >= 80 ? '#16a34a' : percent >= 60 ? '#ca8a04' : '#dc2626';
        
        rowHTML += `<td style="font-weight:bold; color:${pColor}; text-align:center;">${percent}%</td>`;
        tr.innerHTML = rowHTML;
        reportsTableBody.appendChild(tr);
    });

    reportsStats.innerHTML = `Mostrando <strong>${studentsArray.length}</strong> alumnos a lo largo de <strong>${sortedDates.length}</strong> sesiones registradas en el servidor.`;
    reportsArea.style.display = 'block';
    window.currentReportData = { sortedDates, studentsArray };
}

// --- 5. EXPORTAR CSV ---
exportCSVBtn.addEventListener('click', () => {
    if (!window.currentReportData || window.currentReportData.studentsArray.length === 0) {
        return alert("Primero genera una búsqueda con resultados.");
    }

    const { sortedDates, studentsArray } = window.currentReportData;
    const className = filterClassSelect.options[filterClassSelect.selectedIndex].text;
    
    // Construir filas CSV
    const rows = [];
    rows.push(['REPORTE DE ASISTENCIA - SAA']);
    rows.push(['Materia:', className]);
    rows.push(['Generado:', new Date().toLocaleDateString()]);
    rows.push([]); // Espacio

    // Headers
    const header = ['Nombre', 'ID'];
    sortedDates.forEach(d => header.push(d)); // Fechas YYYY-MM-DD
    header.push('Asistencias', 'Faltas', 'Porcentaje');
    rows.push(header);

    // Datos
    studentsArray.forEach(st => {
        const row = [st.name, st.id];
        let p = 0, f = 0;
        
        sortedDates.forEach(dStr => {
            const s = st.attendance[dStr];
            if (s === 'PRESENT') { row.push('A'); p++; }
            else if (s === 'ABSENT') { row.push('F'); f++; }
            else { row.push('-'); }
        });

        const total = p + f;
        const pct = total > 0 ? Math.round((p/total)*100) + '%' : '0%';
        row.push(p, f, pct);
        rows.push(row);
    });

    // Función simple para descargar (sin depender de librerías externas si no quieres)
    const csvContent = rows.map(e => e.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Reporte_${className.replace(/\s/g,'_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

searchBtn.addEventListener('click', generateReport);