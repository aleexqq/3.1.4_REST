const urlUsers = "http://localhost:8080/api/admin/users";
const urlRoles = "http://localhost:8080/api/admin/roles";

const allUsers = () => {
    fetch(urlUsers)
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
                <td>${user.roles.map(role => role.name.replace('ROLE_', '')).join(' ')}</td>
                <td><a href="/api/admin/users/${user.id}" class="btn btn-primary eBtn">Edit</a></td>
                <td><a href="/api/admin/users/${user.id}" class="btn btn-danger dBtn">Delete</a></td>
            `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Ошибка:', error));
}

const loadRoles = () => {
    fetch(urlRoles)
        .then(response => response.json())
        .then(data => {
            const addRolesSelect = $('#add-roles');
            const editRolesSelect = $('#edit-roles');

            addRolesSelect.empty();
            editRolesSelect.empty();

            data.forEach(role => {
                const option = `<option value="${role.id}">${role.name.replace('ROLE_', '')}</option>`;
                addRolesSelect.append(option);
                editRolesSelect.append(option);
            });
        })
        .catch(error => console.error('Ошибка при загрузке ролей:', error));
}

$(document).ready(function () {
    allUsers();
    loadRoles();

    const $table = $('.table');

    $table.on('click', '.eBtn', function (event) {
        event.preventDefault();
        loadRoles();
        const href = $(this).attr('href');
        $.get(href, function (user) {
            $('.editForm #edit-id').val(user.id);
            $('.editForm #edit-id-hidden').val(user.id);
            $('.editForm #edit-name').val(user.name);
            $('.editForm #edit-email').val(user.email);
            $('.editForm #edit-password').val(null)

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

        $.ajax({
            url: urlUsers,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                console.log('Пользователь успешно обновлен:', response);
                $('.editForm #userEditDialog').modal('hide');
                allUsers(urlUsers);
            },
            error: function (error) {
                console.error('Ошибка при обновлении пользователя:', error);
            }
        });
    });

    $table.on('click', '.dBtn', function (event) {
        event.preventDefault();
        loadRoles();
        const href = $(this).attr('href');
        $.get(href, function (user) {
            $('.deleteForm #delete-id').val(user.id);
            $('.deleteForm #delete-id-hidden').val(user.id);
            $('.deleteForm #delete-name').val(user.name);
            $('.deleteForm #delete-email').val(user.email);

            const deleteRolesSelect = $('#delete-roles');
            deleteRolesSelect.empty();

            user.roles.forEach(role => {
                const option = `<option value="${role.id}">${role.name.replace('ROLE_', '')}</option>`;
                deleteRolesSelect.append(option);
            });
            $('.deleteForm #userDeleteDialog').modal('show');
        });
    });

    $('.deleteForm').on('submit', function (event) {
        event.preventDefault();
        const userId = $('#delete-id').val();
        $.ajax({
            url: `${urlUsers}/${userId}`,
            type: 'DELETE',
            success: function (response) {
                console.log('Пользователь успешно удален:', response);
                $('.deleteForm #userDeleteDialog').modal('hide');
                allUsers(urlUsers);
            },
            error: function (error) {
                console.error('Ошибка при удалении пользователя:', error);
            }
        });
    });

    $('.addForm').on('submit', function (event) {
        event.preventDefault();

        const formData = {
            name: $('#add-name').val(),
            email: $('#add-email').val(),
            password: $('#add-password').val(),
            roles: $('#add-roles').val().map(roleId => ({id: roleId}))
        };

        $.ajax({
            url: urlUsers,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                console.log('Пользователь успешно добавлен:', response);
                allUsers(urlUsers);
                document.querySelector('.addForm form').reset();
            },
            error: function (error) {
                console.error('Ошибка при добавлении пользователя:', error);
            }
        });
    });
});
