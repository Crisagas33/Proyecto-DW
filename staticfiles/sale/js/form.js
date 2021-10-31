var tbProductss;
var vents = {
    items: {
        cli: '',
        date_joined: '',
        subtotal: 0.00,
        iva: 0.00,
        total: 0.00,
        products: [],
    },
    calculos: function () {
        var sumasub = 0.00;
        var ivacalc = $('input[name="iva"]').val();
        $.each(this.items.products, function (pos, dict) {
            dict.subtotal = dict.cant * parseFloat(dict.pv);
            sumasub += dict.subtotal;
        });
        this.items.subtotal = sumasub;
        this.items.iva = this.items.subtotal * ivacalc;
        this.items.total = this.items.subtotal + this.items.iva;
        $('input[name="subtotal"]').val(this.items.subtotal.toFixed(2));
        $('input[name="ivacalc"]').val(this.items.iva.toFixed(2));
        $('input[name="total"]').val(this.items.total.toFixed(2));
    },
    add: function (item) {
        this.items.products.push(item);
        this.list();
    },
    list: function () {
        this.calculos();
        tbProductss = $('#tbProducts').DataTable({
            responsive: true,
            autoWidth: false,
            destroy: true,
            data: this.items.products,
            columns: [
                {"data": "id"},
                {"data": "name"},
                {"data": "cate.name"},
                {"data": "pv"},
                {"data": "cant"},
                {"data": "subtotal"},
            ],
            columnDefs: [
                {
                    targets: [0],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<a rel="remove" class="btn btn-danger btn-xs" style="color: white"><i class="fas fa-trash"></i></a>';
                    }
                },
                {
                    targets: [-3],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return 'Q' + parseFloat(data).toFixed(2);
                    }
                },
                {
                    targets: [-2],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<input type="text" name="cant" class="form-control form-control-sm input-sm" autocomplete="off" value="' + row.cant + '">';
                    }
                },
                {
                    targets: [-1],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return 'Q' + parseFloat(data).toFixed(2);
                    }
                },
            ],
            rowCallback(row, data, displayNum, displayIndex, dataIndex) {
                $(row).find('input[name="cant"]').TouchSpin({
                    min: 1,
                    max: 10000,
                    step: 1,
                });
            },
            initComplete: function (settings, json) {

            }
        });
    },

}

$(function () {
    $('.select2').select2({
        theme: "bootstrap4",
        language: 'es'
    });
    $('#date_joined').datetimepicker({
        format: 'YYYY-MM-DD',
        date: moment().format("YYYY-MM-DD"),
        locale: 'es',
        minDate: moment().format("YYYY-MM-DD"),
    });
    $("input[name='iva']").TouchSpin({
        min: 0,
        max: 100,
        step: 0.01,
        decimals: 2,
        boostat: 5,
        maxboostedstep: 10,
        postfix: '%'
    }).on('change', function () {
        vents.calculos();
    }).val(0.12);
    //Busqueda de productos
    $('input[name="search"]').autocomplete({
        source: function (request, response) {
            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                data: {
                    'action': 'search_products',
                    'term': request.term
                },
                dataType: 'json',
            }).done(function (data) {
                response(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                //alert(textStatus + ': ' + errorThrown);
            }).always(function (data) {

            });
        },
        delay: 500,
        minLength: 1,
        select: function (event, ui) {
            event.preventDefault();
            ui.item.cant = 1;
            ui.item.subtotal = 0.00;
            vents.add(ui.item);
            $(this).val('');
        }
    });

    //Cantidad Producto
    $('#tbProducts tbody')
        .on('click', 'a[rel="remove"]', function () {
            var tr = tbProductss.cell($(this).closest('td, li')).index();
            vents.items.products.splice(tr.row, 1);
            vents.list();
        })
        .on('change', 'input[name="cant"]', function () {
            var cant = parseInt($(this).val());
            var tr = tbProductss.cell($(this).closest('td, li')).index();
            vents.items.products[tr.row].cant = cant;
            vents.calculos();
            $('td:eq(5)', tbProductss.row(tr.row).node()).html('Q' + vents.items.products[tr.row].subtotal.toFixed(2));
        });
    //Eliminar Lista
    $('.btnEliminarLista').on('click', function () {
        if (vents.items.products.length === 0) return false;
        alertaXD(function () {
            vents.items.products = [];
            vents.list();
        });
    });

    //BtnLimpiarBusqueda
    $('.btnLimpiarB').on('click', function () {
        $('input[name="search"]').val('').focus();
    });
    //Facturar
    $('form').on('submit', function (e) {
            e.preventDefault();

            if(vents.items.products.length === 0){
                message_error('Debe tener almenos un producto en la venta');
                return false;
            }

            vents.items.date_joined = $('input[name="date_joined"]').val();
            vents.items.cli = $('select[name="cli"]').val();
            var parameters = new FormData();
            parameters.append('action', $('input[name="action"]').val());
            parameters.append('vents', JSON.stringify(vents.items));
            submitConAjax(window.location.pathname, parameters, function () {
            location.href = '/erp/sale/list/';
            });
        });
    //Presentar data table
    vents.list();
});