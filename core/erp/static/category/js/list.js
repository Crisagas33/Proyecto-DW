$(function () {
    $('#data').DataTable({
        responsive: true,
        autoWidth: false,
        destroy: true,
        deferRender: true,
        ajax: {
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'searchdata'
            },
            dataSrc: ""
        },
        columns: [
            {"data": "id"},
            {"data": "name"},
            {"data": "desc"},
            {"data": "desc"},
        ],
        columnDefs: [
            {
                targets: [-1],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    var buttons = '<a href="/erp/category/edit/'+row.id+'/" type="button" class="btn btn-warning btn-xs">' +
                        '<i class="fas fa-edit"></i>' +
                        '</a>';
                    buttons += '<a href="/erp/category/delete/'+row.id+'/" type="button" class="btn btn-danger btn-xs">' +
                        '<i class="fas fa-trash"></i></i>' +
                        '</a>';
                    return buttons;
                }
            },
        ],
        initComplete: function (settings, json) {
            // alert('Tabla Cargada');
        }
    });
});