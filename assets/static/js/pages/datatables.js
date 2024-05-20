let jquery_datatable = $("#table1").DataTable({
    responsive: true
})
let customized_datatable = $("#table2").DataTable({
    responsive: true,
    pagingType: 'simple',
    dom:
		"<'row'<'col-3'l><'col-9'f>>" +
		"<'row dt-row'<'col-sm-12'tr>>" +
		"<'row'<'col-4'i><'col-8'p>>",
    "language": {
        "info": "Page _PAGE_ of _PAGES_",
        "lengthMenu": "_MENU_ ",
        "search": "",
        "searchPlaceholder": "Search.."
    }
})

const setTableColor = () => {
    document.querySelectorAll('.dataTables_paginate .pagination').forEach(dt => {
        dt.classList.add('pagination-primary')
    })
}
setTableColor()
jquery_datatable.on('draw', setTableColor)

 
$('#searchInput').on('input', function() {
    var searchText = $(this).val().toLowerCase();
    // Loop through each row in the table
    $('#table1 tbody tr').each(function() {
        var rowText = $(this).text().toLowerCase();
        // Check if the row contains the search text
        if (rowText.includes(searchText)) {
            $(this).show(); // Show the row if it matches
        } else {
            $(this).hide(); // Hide the row if it doesn't match
        }
    });
});

// for showing dropdown above table and not hidden in cell

// $('.table-responsive').on('show.bs.dropdown', function () {
//     $('.table-responsive').css( "overflow", "inherit" );
// });

// $('.table-responsive').on('hide.bs.dropdown', function () {
//     $('.table-responsive').css( "overflow", "auto" );
// })

