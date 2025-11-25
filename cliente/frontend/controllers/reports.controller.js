import ClassSessionService from '../services/classSession.service.js' //this is the import youll get the attendances

//first validation
const user = JSON.parse(localStorage.getItem('user'));
const classes = JSON.parse(sessionStorage.getItem('classes'))
if(!user || user.rol !== 'PROFESSOR') window.location.replace('login.html')
if(!classes) window.location.replace('dashboard.html')


const filterClassSelect = document.getElementById('filterClass')
const filterStartDate = document.getElementById('filterStartDate')
const filterEndDate = document.getElementById('filterEndDate')
const searchBtn = document.getElementById('searchBtn')
const exportCSVBtn = document.getElementById('exportCSV')
const reportsTable = document.getElementById('reportsTable')
const reportsTableBody = document.getElementById('reportsTableBody')
const reportsArea = document.getElementById('reportsArea')
const reportsStats = document.getElementById('reportsStats')


console.log(classes)
 // Populate class filter
classes.forEach(c => {
    const option = document.createElement('option')
    option.value = c.id
    option.textContent = c.name
    filterClassSelect.appendChild(option)
})

// Set default date range (last 31 days)
const today = new Date()
const thirtyOneDaysAgo = new Date(today.getTime() - (31 * 24 * 60 * 60 * 1000))
filterEndDate.value = window.SCREENS.formatDateForInput(today)
filterStartDate.value = window.SCREENS.formatDateForInput(thirtyOneDaysAgo)

function generateReport(){
    const selectedClassId = filterClassSelect.value ? Number(filterClassSelect.value) : null
    const startDate = new Date(filterStartDate.value)  
    const endDate = new Date(filterEndDate.value)

    // Get records within date range
    let records = window.SCREENS.getAttendanceRecordsByDateRange(startDate, endDate, selectedClassId)

    if(selectedClassId){
        records = records.filter(r => r.classId === selectedClassId)
    }

    // Generate table
    if(records.length === 0){
        reportsTableBody.innerHTML = '<tr><td colspan="100" style="text-align:center;padding:20px;color:#6b7280">No hay registros en este rango</td></tr>'
        reportsArea.style.display = 'none'
        return
    }

    // Get unique dates and generate columns
    const uniqueDates = [...new Set(records.map(r => new Date(r.date).toLocaleDateString()))].sort()
      
    // Limit to 31 columns max
    const datesToShow = uniqueDates.slice(0, 31)

    // Rebuild table header
    const thead = reportsTable.querySelector('thead tr')
    thead.innerHTML = '<th>Materia</th><th>Fecha</th>'
    datesToShow.forEach(date => {
        const th = document.createElement('th')
        th.textContent = new Date(date).toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit'})
        th.style.minWidth = '50px'
        th.style.textAlign = 'center'
        thead.appendChild(th)
    })

    // Group by class and date
    const groupedByClass = {}
    records.forEach(r => {
        if(!groupedByClass[r.className]) groupedByClass[r.className] = {}
        groupedByClass[r.className][new Date(r.date).toLocaleDateString()] = r
    })

      // Generate table body
      reportsTableBody.innerHTML = ''
      Object.entries(groupedByClass).forEach(([className, dateMap]) => {
        const tr = document.createElement('tr')
        tr.innerHTML = `<td><strong>${className}</strong></td><td></td>`
        
        datesToShow.forEach(date => {
            const td = document.createElement('td')
            td.style.textAlign = 'center'
            
            const record = dateMap[date]
            if(record){
                const presentCount = record.records.filter(s => s.present).length
                const totalCount = record.records.length
                const percentage = Math.round((presentCount / totalCount) * 100)
                td.innerHTML = `<strong>${presentCount}/${totalCount}</strong><br><small>${percentage}%</small>`
                td.style.color = percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444'
            } else {
                td.textContent = '-'
                td.style.color = '#d1d5db'
            } 
        tr.appendChild(td)
    })
        reportsTableBody.appendChild(tr)
    })

    // Show stats
    const totalRecords = records.length
    const totalStudents = records.reduce((sum, r) => sum + r.records.length, 0)
    const totalPresent = records.reduce((sum, r) => sum + r.records.filter(s => s.present).length, 0)
    const avgAttendance = Math.round((totalPresent / totalStudents) * 100)

    reportsStats.innerHTML = `
    <strong>Resumen:</strong> ${totalRecords} registro(s), 
    ${totalStudents} asistencias totales, 
    ${totalPresent} presente(s), 
    Promedio: ${avgAttendance}%
    `
    reportsArea.style.display = 'block'
}

searchBtn.addEventListener('click', generateReport)

exportCSVBtn.addEventListener('click', ()=>{
    const selectedClassId = filterClassSelect.value ? Number(filterClassSelect.value) : null
    const startDate = new Date(filterStartDate.value)
    const endDate = new Date(filterEndDate.value)

    let records = window.SCREENS.getAttendanceRecordsByDateRange(startDate, endDate, selectedClassId)
    if(selectedClassId) records = records.filter(r => r.classId === selectedClassId)

    if(records.length === 0){
        alert('No hay registros para exportar')
        return
    }

    const rows = [['Materia','Fecha','ID Estudiante','Nombre','Presente']]
    records.forEach(r => {
        r.records.forEach(student => {
          const studentId = student.student.id || 'N/A'
          const studentName = student.student.name || student.student
          rows.push([r.className, r.date, studentId, studentName, student.present ? 'Sí' : 'No'])
        })
    })

    window.SCREENS.exportCSV(rows, 'reporte_asistencia.csv')
})

// Load initial report
generateReport()