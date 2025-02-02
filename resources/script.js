document.addEventListener("DOMContentLoaded", function() {
    fetchIssues();

    const closeButton = document.querySelector('.close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            document.getElementById('issueModal').style.display = "none";
        });
    }
});

async function fetchIssues() {
    try {
        const response = await fetch('/api/issues');
        const issues = await response.json();
        const tableBody = document.querySelector('#issuesTable tbody');
        tableBody.innerHTML = '';

        issues.forEach(issue => {
            const row = `
                <tr>
                    <td>${issue.issue_id}</td>
                    <td>${issue.title}</td>
                    <td>${issue.related_topic}</td>
                    <td>${issue.closed_at}</td>
                    <td><button class="view-issue" data-issue-id="${issue.issue_id}">mais</button></td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        $('#issuesTable').DataTable({
            paging: true,
            pageLength: 10,
            searching: true,
            language: {
                url: "/assets/language/pt-BR.json"
            }
        });

        document.querySelectorAll('.view-issue').forEach(button => {
            button.addEventListener('click', function() {
                const issueId = this.getAttribute('data-issue-id');
                const issue = issues.find(i => i.issue_id === issueId);
                if (issue) {
                    openModal(issue);
                }
            });
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

function openModal(issue) {
    document.getElementById('modal-issue-id').innerText = issue.issue_id;
    document.getElementById('modal-title').innerText = issue.title;
    document.getElementById('modal-body').innerText = issue.body;
    document.getElementById('modal-related-topic').innerText = issue.related_topic;
    document.getElementById('modal-closed-at').innerText = issue.closed_at;
    document.getElementById('modal-created-at').innerText = issue.created_at;
    document.getElementById('modal-resolution-time').innerText = issue.resolution_time;
    document.getElementById('modal-author').innerText = issue.author;
    document.getElementById('modal-analysis').innerText = issue.analysis;
    document.getElementById('issueModal').style.display = "block";
}