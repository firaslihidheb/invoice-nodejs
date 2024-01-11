function getCustomers() {
    $.ajax({
        url: `${api_url}/customer/all`,
        type: 'get',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", auth);
        },
        success: function(data, textStatus, jqXHR){
            if(jqXHR.status === 200){

                $('#customers-table').dataTable({
                    data: data.data,
                    destroy: true,
                    columns: [
                        {data: 'raison_social'},
                        {data: 'client_number'},
                        {data: 'email'},
                        {data: 'interlocuteur'},
                        {data: 'email_interlocuteur'},
                        {data: 'NumeroEtVoie'},
                        
                        {data: 'CodePostal'},
                        {data: 'Commune'},
                        {data: 'tin_no'}

                    ],
                    responsive: true
                });
                $('.no_data_found').hide();
                $('#customers-table').show();
            }
            else if(jqXHR.status === 204){
                $('#customers-table').hide();
                $('.no_data_found').html('<h3 class="m-t-15">No Customer Found</h3>');
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseJSON.message);
            $(".login_alert_div").empty().hide().addClass('alert-danger').removeClass('alert-success');
            $(".login_alert_div").text(jqXHR.responseJSON.message).show().fadeTo(5000, 500).slideUp(500);
        }
    });
    return false;
}
getCustomers();

$(document).ready(function () {

    $(document).on('submit', '.add-customer-form', function () {
     

        const raison_social = $('input[name="raison_social"]').val();
        const client_number = $('input[name="client_number"]').val();
        const email = $('input[name="email"]').val();
       
        const interlocuteur = $('input[name="interlocuteur"]').val();
        const email_interlocuteur = $('input[name="email_interlocuteur"]').val();
        const NumeroEtVoie = $('input[name="NumeroEtVoie"]').val();
        const CodePostal = $('input[name="CodePostal"]').val();
        const Commune = $('input[name="Commune"]').val();
        const tin_no = $('input[name="tin_no"]').val();

        let form_data = {
            raison_social,
            client_number,
            email,
            
            interlocuteur,
            email_interlocuteur,
            NumeroEtVoie,
            CodePostal,
            Commune,
            tin_no
        };
        form_data = JSON.stringify(form_data);

        $.ajax({
            url: `${api_url}/customer/new`,
            type: 'POST',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", auth);
            },
            contentType :'application/json',
            data: form_data,
            success: function(data, textStatus, jqXHR){
                if(jqXHR.status == 200){
                    $('.customer_alert_div').removeClass('alert-danger').addClass('alert-success');
                    $(".customer_alert_div").html("Inserted successfully").show().fadeTo(2000, 500).slideUp(500).hide(0,function () {
                        getCustomers();
                        $('.add-customer-form').hide();
                        $('.add-customer-form').trigger("reset");
                        $('.remove_new_customer').hide();
                        $('.add_new_customer').show();
                    });
                }
                else{
                    $(".customer_alert_div").empty().hide().removeClass('alert-success').addClass('alert-danger');
                    $(".customer_alert_div").text("Something didn't work").show().fadeTo(2000, 500).slideUp(500);
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                $(".customer_alert_div").empty().hide().addClass('alert-danger').removeClass('alert-success');

                if(jqXHR.hasOwnProperty('responseJSON') && jqXHR.responseJSON.hasOwnProperty('message'))
                    $(".customer_alert_div").text(jqXHR.responseJSON.message).show().fadeTo(5000, 500).slideUp(500);
                else
                    $(".customer_alert_div").text("Something didn't work").show(0).delay(3000).hide(0);
            }
        });
        return false;
    });

    $(document).on('click', ".add_new_customer", function () {
        $('.remove_new_customer').show();
        $('.add_new_customer').hide();
    
        // Check if the table exists
        var tableExists = $.fn.DataTable.isDataTable('#customers-table');
        
        var highestClientNumber = tableExists ? getHighestClientNumber() + 1 : 1000;
        console.log(highestClientNumber);
    
        $('.add-customer-form').find('input[name="client_number"]').val(highestClientNumber);
        $('.add-customer-form').show();
    });
    function getHighestClientNumber() {
        var table = $('#customers-table').DataTable();
    
        // Get all client numbers without sorting
        var clientNumbers = table.column(1).data();
    
        console.log('Client Numbers:', clientNumbers.toArray());
        console.log('Data Type:', typeof clientNumbers.toArray());
    
        // Find the maximum client number
        var maxClientNumber = Math.max.apply(null, clientNumbers.toArray());
    
        console.log('Max Client Number:', maxClientNumber);
    
        return maxClientNumber;
    }
    
    
    
    

    $(document).on('click', ".remove_new_customer", function () {
        $('.add-customer-form').hide();
        $('.add-customer-form').trigger("reset");
        $('.remove_new_customer').hide();
        $('.add_new_customer').show();
    })
});