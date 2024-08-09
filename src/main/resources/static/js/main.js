$(document).ready(function () {
    $('.table .eBtn').on('click', function(event) {
        event.preventDefault();
        var href = $(this).attr('href');
        $.get(href, function (user, status) {
            $('.editForm #edit-id').val(user.id);
            $('.editForm #edit-id-hidden').val(user.id);


            $('.editForm #edit-name').val(user.name);
            $('.editForm #edit-email').val(user.email);
            $('.editForm #edit-roles').val(user.roles);
            $('.editForm #userEditDialog').modal('show');
        });
    });

    $('.table .dBtn').on('click', function(event) {
        event.preventDefault();
        var href = $(this).attr('href');
        $.get(href, function (user, status) {
            $('.deleteForm #delete-id').val(user.id);
            $('.deleteForm #delete-id-hidden').val(user.id);

            $('.deleteForm #delete-name').val(user.name);
            $('.deleteForm #delete-email').val(user.email);
            $('.deleteForm #delete-roles').val(user.roles);

            $('.deleteForm #userDeleteDialog').modal('show');
        });
    });
})