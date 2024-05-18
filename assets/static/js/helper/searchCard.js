$('#searchInput-card').on('input', function() {
    console.log('clicked');
    var searchTerm = $(this).val().trim().toLowerCase();
    $('.card').each(function() {
        var personId = $(this).find('.card-body .card-text:first').text().trim().toLowerCase();
        var bedroomId = $(this).find('.card-body .card-text:nth-child(3)').text().trim().toLowerCase();
        var time = $(this).find('.card-body .card-text:contains("Time:")').text().trim().toLowerCase();
        
        if (personId.includes(searchTerm) || bedroomId.includes(searchTerm) || time.includes(searchTerm)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
 });