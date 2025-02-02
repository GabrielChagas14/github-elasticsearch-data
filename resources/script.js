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
    } catch (error) {
        console.error('Erro ao carregar issues:', error);
    }
}

document.addEventListener("DOMContentLoaded", fetchIssues);