const url = "http://localhost:8080/api/users"

const allUsers = (url) => {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('.table-striped tbody');
            tbody.innerHTML = '';
            data.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.email}</td>
                <td>${user.name}</td>
                <td>${user.roles.map(role => role.name.replaceAll('ROLE_', '')).join(' ')}</td>
                <td><a href="/api/users/${user.id}" class="btn btn-primary eBtn">Edit</a></td>
                <td><a href="/api/users/${user.id}" class="btn btn-danger dBtn">Delete</a></td>
            `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Ошибка:', error));
}
allUsers(url)

$(document).ready(function () {
    const $table = $('.table');
    $table.on('click', '.eBtn', function (event) {
        event.preventDefault();
        const href = $(this).attr('href');
        $.get(href, function (user, status) {
            $('.editForm #edit-id').val(user.id);
            $('.editForm #edit-id-hidden').val(user.id);
            $('.editForm #edit-name').val(user.name);
            $('.editForm #edit-email').val(user.email);
            $('.editForm #edit-roles').val(user.roles);
            $('.editForm #userEditDialog').modal('show');
        });
    });

    $('.editForm').on('submit', function (event) {
        event.preventDefault();
        const formData = {
            id: $('#edit-id').val(),
            name: $('#edit-name').val(),
            email: $('#edit-email').val(),
            password: $('#edit-password').val(),
            roles: $('#edit-roles').val().map(roleId => ({id: roleId}))
        };
        console.log(JSON.stringify(formData))

        $.ajax({
            url: "http://localhost:8080/api/users",
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                console.log('Пользователь успешно обновлен:', response);

                $('.editForm #userEditDialog').modal('hide');

                allUsers(url);
            },
            error: function (error) {
                console.error('Ошибка при обновлении пользователя:', error);
            }
        });
    });

    $table.on('click', '.dBtn', function (event) {
        event.preventDefault();
        const href = $(this).attr('href');
        $.get(href, function (user, status) {
            $('.deleteForm #delete-id').val(user.id);
            $('.deleteForm #delete-id-hidden').val(user.id);

            $('.deleteForm #delete-name').val(user.name);
            $('.deleteForm #delete-email').val(user.email);
            $('.deleteForm #delete-roles').val(user.roles);

            $('.deleteForm #userDeleteDialog').modal('show');
        });
    });

    $('.deleteForm').on('submit', function (event) {
        event.preventDefault();
        const userId = $('#delete-id').val();
        $.ajax({
            url: `http://localhost:8080/api/users/${userId}`,
            type: 'DELETE',
            success: function (response) {
                console.log('Пользователь успешно удален:', response);

                $('.deleteForm #userDeleteDialog').modal('hide');

                allUsers(url);
            },
            error: function (error) {
                console.error('Ошибка при удалении пользователя:', error);
            }
        });
    });

    $('.addForm').on('submit', function (event) {
        event.preventDefault();

        const formData = {
            id: $('#add-id').val(),
            name: $('#add-name').val(),
            email: $('#add-email').val(),
            password: $('#add-password').val(),
            roles: $('#add-roles').val().map(roleId => ({id: roleId}))
        };
        console.log(formData)

        $.ajax({
            url: "http://localhost:8080/api/users",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                console.log('Пользователь успешно добавлен:', response);
                allUsers(url);
            },
            error: function (error) {
                console.error('Ошибка при обновлении пользователя:', error);
            }
        });
    });
})

