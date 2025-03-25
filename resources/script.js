async function fetchIssues() {
    try {
        const issuesResponse = await fetch('/api/issues');
        const issues = await issuesResponse.json();

        const commentsResponse = await fetch('/api/comments');
        const comments = await commentsResponse.json();
        
        // Preencher a tabela
        fillTable(issues, comments);
        
        // Gerar gráfico de pizza
        generatePieChart(issues);
        
        // Gerar gráfico de linha
        generateLineChart(issues);
        
    } catch (error) {
        console.error('Erro ao carregar issues:', error);
    }
}

function openModal(issue, comments) {
    const closedAtDate = new Date(issue.closed_at);
    const formattedClosedDate = closedAtDate.toLocaleDateString('pt-BR');
    const createdAtDate = new Date(issue.created_at);
    const formattedCreatedDate = createdAtDate.toLocaleDateString('pt-BR');

    document.getElementById('modal-issue-id').innerText = issue.issue_id;
    document.getElementById('modal-title').innerText = issue.title;
    document.getElementById('modal-body').innerText = issue.body;
    document.getElementById('modal-related-topic').innerText = issue.related_topic;
    document.getElementById('modal-closed-at').innerText = formattedClosedDate;
    document.getElementById('modal-created-at').innerText = formattedCreatedDate;
    document.getElementById('modal-resolution-time').innerText = issue.resolution_time;
    document.getElementById('modal-author').innerText = issue.author;
    document.getElementById('modal-analysis').innerText = issue.analysis;
    document.getElementById('issueModal').style.display = "block";

    let html = "";
    comments.forEach(comment => {
        const closedAtDate = new Date(comment.created_at);
        const formattedClosedDate = closedAtDate.toLocaleDateString('pt-BR');

        let bodyContent = comment.body;

        // Remover links (URLs começando com http:// ou https://)
        bodyContent = bodyContent.replace(/https?:\/\/[^\s]+/g, '');

        // Remover imagens (tags <img>)
        bodyContent = bodyContent.replace(/<img[^>]*>/g, '');

        // Remover caracteres especiais, exceto os permitidos (/ ( ) [ ])
        bodyContent = bodyContent.replace(/[^a-zA-Z0-9áéíóúàèìòùãõçÁÉÍÓÚÀÈÌÒÙÃÕÇ/\(\)\s]/g, '');
        
        html += `
            <div class="comment-section">
                <div class="row">
                    <p class="column">
                        <strong>Id do comentário:</strong> ${comment.comment_id}
                    </p>
                    <p class="column">
                        <strong>Autor:</strong> ${comment.author}
                    </p>
                    <p class="column">
                        <strong>Data de criação:</strong> ${formattedClosedDate}
                    </p>
                </div>
                <div class="row">
                    <p class="column">
                        <strong>Comentário:</strong> ${bodyContent}
                    </p>
                </div>
            </div>
        `;
    });
    document.getElementById('modal-comment-section').innerHTML = html;
}

function fillTable(issues, comments) {
    const table = $('#issuesTable');
    if ($.fn.DataTable.isDataTable(table)) {
        table.DataTable().destroy();
    }

    const tableBody = document.querySelector('#issuesTable tbody');
    tableBody.innerHTML = '';

    issues.forEach(issue => {
                const closedAtDate = new Date(issue.closed_at);
                const formattedClosedDate = closedAtDate.toLocaleDateString('pt-BR');
        const row = `
            <tr>
                <td>${issue.issue_id}</td>
                <td>${issue.title}</td>
                <td>${issue.related_topic}</td>
                <td>${formattedClosedDate}</td>
                <td><button class="view-issue" data-issue-id="${issue.issue_id}"><i class="fa-solid fa-magnifying-glass"></i></button></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    table.DataTable({
        paging: true,
        pageLength: 10,
        searching: true,
        destroy: true,
        language: {
            url: "/assets/language/pt-BR.json"
        }
    });

    document.querySelectorAll('.view-issue').forEach(button => {
        button.addEventListener('click', function() {
            const issueId = this.getAttribute('data-issue-id');
            const issue = issues.find(i => i.issue_id === issueId);
            if (issue) {
                const filteredComments = comments.filter(comment => comment.issue_id === issue.issue_id);
                console.log(filteredComments);
                openModal(issue, filteredComments);
            }
        });
    });
}

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

function generateColumnChart(classification) {
    const classificationCounts = classification.reduce((acc, item) => {
        acc[item.classification] = (acc[item.classification] || 0) + 1;
        return acc;
    }, {});

    // Extraindo rótulos e valores
    const labels = Object.keys(classificationCounts);
    const data = Object.values(classificationCounts);

    // Configuração do gráfico
    const ctx = document.getElementById('classificationChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar', // Gráfico de colunas
        data: {
            labels: labels,
            datasets: [{
                label: 'Número de Colaboradores',
                data: data,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}

async function fetchClassification() {
    try {
        const classificationResponse = await fetch('/api/classification');
        const classification = await classificationResponse.json();
        
        generateColumnChart(classification)
        
    } catch (error) {
        console.error('Erro ao carregar classificações:', error);
    }
}


// document.addEventListener("DOMContentLoaded", fetchIssues);
document.addEventListener("DOMContentLoaded", function() {
    fetchIssues();
    fetchClassification();

    const closeButton = document.querySelector('.close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            document.getElementById('issueModal').style.display = "none";
        });
    }
});
