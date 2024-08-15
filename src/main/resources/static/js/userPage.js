const url = "http://localhost:8080/api/user";

const getLoggedUser = () => {
    fetch(url)
        .then(response => response.json())
        .then(user => {
            const tbody = document.querySelector('.table-striped tbody');
            tbody.innerHTML = '';
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.email}</td>
            <td>${user.name}</td>
            <td>${user.roles.map(role => role.name.replace('ROLE_', '')).join(' ')}</td>
            `
            tbody.appendChild(row);
        })
        .catch(error => console.error('Ошибка:', error));
}

$(document).ready(function () {
    getLoggedUser();
});