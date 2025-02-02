async function fetchIssues() {
    try {
        const response = await fetch('/api/issues');
        const issues = await response.json();
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



        let regressionTests = issues.filter(issue => issue.related_topic === 'Regression Testing').length;
        let refactoring = issues.filter(issue => issue.related_topic === 'Refactoring').length;
        let both = issues.filter(issue => issue.related_topic === 'Both').length;
        let none = issues.filter(issue => issue.related_topic === 'None').length;

        const ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie', // Pode ser 'bar', 'line', 'doughnut', etc.
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

    } catch (error) {
        console.error('Erro ao carregar issues:', error);
    }
}

document.addEventListener("DOMContentLoaded", fetchIssues);