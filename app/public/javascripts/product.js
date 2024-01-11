function getContracts() {
    $.ajax({
        url: `${api_url}/product/all`,
        type: 'get',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", auth);
        },
        success: function(data, textStatus, jqXHR){
            if(jqXHR.status === 200){
                const collaborateurPromises = data.data.map(contract => (
                    new Promise(resolve => {
                        fetchCollaborateurName(contract.collaborateur_id, collaborateurName => {
                            resolve({ id: contract.collaborateur_id, name: collaborateurName });
                        });
                    })
                ));

                const raisonSocialePromises = data.data.map(contract => (
                    new Promise(resolve => {
                        fetchRaisonSocialeName(contract.customer_id, raisonSocialeName => {
                            resolve({ id: contract.customer_id, name: raisonSocialeName });
                        });
                    })
                ));

                Promise.all(collaborateurPromises)
                    .then(collaborateurResults => {
                        const collaborateurNamesMap = new Map(collaborateurResults.map(result => [result.id, result.name]));

                        return Promise.all(raisonSocialePromises)
                            .then(raisonSocialeResults => {
                                const raisonSocialeNamesMap = new Map(raisonSocialeResults.map(result => [result.id, result.name]));

                                const contractsWithData = data.data.map(contract => ({
                                    ...contract,
                                    collaborateur_name: collaborateurNamesMap.get(contract.collaborateur_id) || 'Unknown Collaborateur',
                                    raison_sociale_name: raisonSocialeNamesMap.get(contract.customer_id) || 'Unknown Raison Sociale',
                                    start_date: moment(contract.start_date).format('DD-MM-YYYY'),
                                    end_date: moment(contract.end_date).format('DD-MM-YYYY'),
                                }));

                                $('#contract-table').dataTable({
                                    data: contractsWithData,
                                    destroy: true,
                                    columns: [
                                        { data: 'numero_contrat', defaultContent: '' },
                                        { data: 'raison_sociale_name', defaultContent: '' },
                                        { data: 'collaborateur_name', defaultContent: '' },
                                        { data: 'tjm', defaultContent: '' },
                                        { data: 'start_date', defaultContent: '' },
                                        { data: 'end_date', defaultContent: '' },
                                        { data: 'client_order_number', defaultContent: '' },
                                    ],
                                    responsive: true
                                });

                                $('.no_data_found').hide();
                                $('#contract-table').show();
                            });
                    })
                    .catch(error => {
                        console.error(error);
                        $('.no_data_found').html('<h3 class="m-t-15">Error fetching names</h3>');
                    });
            } else if(jqXHR.status === 204){
                $('#contract-table').hide();
                $('.no_data_found').html('<h3 class="m-t-15">No contract Found</h3>');
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




// Function to fetch collaborateur name based on ID
function fetchCollaborateurName(collaborateurId, callback) {
     $.ajax({
        url: `${api_url}/user/${collaborateurId}`,
        type: 'get',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", auth);
        },
        success: function (data, textStatus, jqXHR) {
            if (jqXHR.status === 200) {
                callback(data.data.name);
            } else {
                callback('Unknown Collaborateur');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseJSON.message);
            callback('Unknown Collaborateur');
        }
    });
}


// Function to fetch raison sociale name based on ID
function fetchRaisonSocialeName(raisonSocialeId, callback) {
    $.ajax({
        url: `${api_url}/customer/${raisonSocialeId}`,
        type: 'get',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", auth);
        },
        success: function (data, textStatus, jqXHR) {
            if (jqXHR.status === 200) {
                callback(data.data.raison_social);
            } else {
                callback('Unknown Raison Sociale');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseJSON.message);
            callback('Unknown Raison Sociale');
        }
    });
}



getContracts()





$(document).ready(function () {

    $(document).on('submit', '.add-product-form', function () {
        const customer_id = $('select[name="customer_id"]').val().trim();
        const collaborateur_id = $('select[name="collaborateur_id"]').val().trim();
        const start_date = $('input[name="start_date"]').val().trim();
        const end_date = $('input[name="end_date"]').val().trim();
        const numero_contrat = $('input[name="numero_contrat"]').val().trim();
        const tjm = $('input[name="tjm"]').val().trim();
        const client_order_number = $('input[name="client_order_number"]').val().trim();

        console.log('hi', customer_id);

        let contractData = {
            customer_id,
            collaborateur_id,
            start_date,
            end_date,
            numero_contrat,
            client_order_number,
            tjm
        };

       

        let form_data = JSON.stringify(contractData);

        $.ajax({
            url: `${api_url}/product/new`,
            type: 'POST',
            contentType: 'application/json',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", auth);
            },
            data: form_data,
            success: function (data, textStatus, jqXHR) {
                if (jqXHR.status == 200) {
                    $('.product_alert_div').removeClass('alert-danger').addClass('alert-success');
                    $(".product_alert_div").html("Inserted successfully").show().fadeTo(2000, 500).slideUp(500).hide(0, function () {
                        getProducts();
                        $('.add-product-form').hide();
                        $('.add-product-form').trigger("reset");
                        $('.remove_new_product').hide();
                        $('.add_new_product').show();
                    });
                }
                else {
                    $(".product_alert_div").empty().hide().removeClass('alert-success').addClass('alert-danger');
                    $(".product_alert_div").text("Something didn't work").show().fadeTo(2000, 500).slideUp(500);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $(".product_alert_div").empty().hide().addClass('alert-danger').removeClass('alert-success');

                if (jqXHR.hasOwnProperty('responseJSON') && jqXHR.responseJSON.hasOwnProperty('message'))
                    $(".product_alert_div").text(jqXHR.responseJSON.message).show().fadeTo(5000, 500).slideUp(500);
                else
                    $(".product_alert_div").text("Something didn't work").show(0).delay(3000).hide(0);
            }
        });
        return false;
    });
    $.ajax({
        url: `${api_url}/customer/all`,
        type: 'get',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", auth);
        },
        success: function (data, textStatus, jqXHR) {
            if (jqXHR.status === 200) {
                $('#customer_id').append(`<option value="">choisir un client</option>`);
                data.data.forEach(i => {
                    $('#customer_id').append(`<option value="${i.id}">${i.raison_social}</option>`);
                });
            }
            else if (jqXHR.status === 204) {
                $('#customer_id').append(`<option value="">No customer exist. Add new customer via Customer Tab above</option>`);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseJSON.message);
            $(".login_alert_div").empty().hide().addClass('alert-danger').removeClass('alert-success');
            $(".login_alert_div").text(jqXHR.responseJSON.message).show().fadeTo(5000, 500).slideUp(500);
        }
    });
    $.ajax({
        url: `${api_url}/user/register/all`,
        type: 'get',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", auth);
        },
        success: function (data, textStatus, jqXHR) {
            if (jqXHR.status === 200) {
                $('#collaborateur_id').append(`<option value="">choisir un Collaborateur</option>`);
                data.data.forEach(i => {
                    $('#collaborateur_id').append(`<option value="${i.id}">${i.name}</option>`);
                });
            }
            else if (jqXHR.status === 204) {
                $('#collaborateur_id').append(`<option value="">No collaborator exist. Add new collaborator via Collaborator Tab above</option>`);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseJSON.message);
            $(".login_alert_div").empty().hide().addClass('alert-danger').removeClass('alert-success');
            $(".login_alert_div").text(jqXHR.responseJSON.message).show().fadeTo(5000, 500).slideUp(500);
        }
    });

    $(document).on('click', ".add_new_product", function () {
        $('.add-product-form').show();
        $('.remove_new_product').show();
        $('.add_new_product').hide();
    })

    $(document).on('click', ".remove_new_product", function () {
        $('.add-product-form').hide();
        $('.add-product-form').trigger("reset");
        $('.remove_new_product').hide();
        $('.add_new_product').show();
    })
});