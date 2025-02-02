async function fetchIssues() {
    try {
        const response = await fetch('/api/issues');
        const issues = await response.json();
        
        // Preencher a tabela
        fillTable(issues);
        
        // Gerar gráfico de pizza
        generatePieChart(issues);
        
        // Gerar gráfico de linha
        generateLineChart(issues);
        
    } catch (error) {
        console.error('Erro ao carregar issues:', error);
    }
}

// Método para preencher a tabela
function fillTable(issues) {
    const tableBody = document.getElementById('issuesTable');
    tableBody.innerHTML = '';

    issues.forEach(issue => {
        const row = `
            <tr>
                <td>${issue.issue_id}</td>
                <td>${issue.title}</td>
                <td>${issue.body}</td>
                <td>${issue.status}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Método para gerar o gráfico de pizza
function generatePieChart(issues) {
    let regressionTests = issues.filter(issue => issue.related_topic === 'Regression Testing').length;
    let refactoring = issues.filter(issue => issue.related_topic === 'Refactoring').length;
    let both = issues.filter(issue => issue.related_topic === 'Both').length;
    let none = issues.filter(issue => issue.related_topic === 'None').length;

    const ctx = document.getElementById('all-Issues').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Teste de Regressão', 'Refatoração', 'Ambas', 'Outros'],
            datasets: [{
                label: 'Quantidade de Issues',
                data: [regressionTests, refactoring, both, none],
                backgroundColor: ['#fed10a', '#343741', '#00bfb3', '#0077cc'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Método para gerar o gráfico de linha
function generateLineChart(issues) {
    const weeklyData = { regressionTests: [], refactoring: [], labels: [] };

    issues.forEach(issue => {
        const createdAt = new Date(issue.created_at);
        const closedAt = new Date(issue.closed_at);
        
        // Início da semana para a data de criação
        const weekStart = new Date(createdAt.setDate(createdAt.getDate() - createdAt.getDay())); 
        
        // Formatar a data no formato dd/mm/yyyy
        const day = String(weekStart.getDate()).padStart(2, '0');
        const month = String(weekStart.getMonth() + 1).padStart(2, '0'); // Meses começam de 0
        const year = weekStart.getFullYear();
        const weekLabel = `${day}/${month}/${year}`;

        if (!weeklyData.labels.includes(weekLabel)) {
            weeklyData.labels.push(weekLabel);
        }

        const weekIndex = weeklyData.labels.indexOf(weekLabel);

        // Contar issues para Teste de Regressão e Refatoração
        if (issue.related_topic === 'Regression Testing' || issue.related_topic === 'Both') {
            weeklyData.regressionTests[weekIndex] = (weeklyData.regressionTests[weekIndex] || 0) + 1;
        }
        if (issue.related_topic === 'Refactoring' || issue.related_topic === 'Both') {
            weeklyData.refactoring[weekIndex] = (weeklyData.refactoring[weekIndex] || 0) + 1;
        }
    });

    // Gerar o gráfico
    const ctxLine = document.getElementById('weekly-Issues').getContext('2d');
    new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: weeklyData.labels,
            datasets: [
                {
                    label: 'Teste de Regressão',
                    data: weeklyData.regressionTests,
                    borderColor: '#fed10a',
                    fill: false,
                    borderWidth: 2
                },
                {
                    label: 'Refatoração',
                    data: weeklyData.refactoring,
                    borderColor: '#343741',
                    fill: false,
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Semana' } },
                y: { title: { display: true, text: 'Quantidade de Issues' } }
            }
        }
    });
}




document.addEventListener("DOMContentLoaded", fetchIssues);
