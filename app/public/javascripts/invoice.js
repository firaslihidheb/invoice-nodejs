
(() => {
    $.ajax({
        url: `${api_url}/customer/all`,
        type: 'get',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", auth);
        },
        success: function(data, textStatus, jqXHR){
            if(jqXHR.status === 200){
                $('#customer_id').append(`<option value="">Select Customer</option>`);
                data.data.forEach(i=>{
                    $('#customer_id').append(`<option value="${i.customer_id}">${i.name}</option>`);
                })
            }
            else if(jqXHR.status === 204){
                $('#customer_id').append(`<option value="">No customer exist. Add new customer via Customer Tab above</option>`);
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseJSON.message);
            $(".login_alert_div").empty().hide().addClass('alert-danger').removeClass('alert-success');
            $(".login_alert_div").text(jqXHR.responseJSON.message).show().fadeTo(5000, 500).slideUp(500);
        }
    });
    return false;
})();
(() => {
$.ajax({
    url: `${api_url}/invoice/mois_facturation`,
    type: 'get',
    dataType: 'json',
    beforeSend: function (request) {
        request.setRequestHeader("Authorization", auth);
    },
    success: function(data, textStatus, jqXHR) {
        if (jqXHR.status === 200) {
            const billingMonthDropdown = $('#billingMonth');
            data.forEach(month => {
                billingMonthDropdown.append(`<option value="${month.value}">${month.label}</option>`);
               
            });
        } else if (jqXHR.status === 204) {
            
            console.log('No billing months exist.');
        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseJSON);
   
    }
});
return false;
})();
(() => {
    $.ajax({
        url: `${api_url}/product/all`,
        type: 'get',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", auth);
        },
        contentType: 'application/json',
        success: function(data, textStatus, jqXHR){
            if(jqXHR.status === 200){
                productsArr = data.data;
                $('#product_id').append(`<option value="">choisir un Contrat</option>`);
                data.data.forEach(i => {
                    $('#product_id').append(`<option value="${i.id}">${i.numero_contrat}</option>`);
                });
            }
            else if (jqXHR.status === 204) {
                $('#product_id').append(`<option value="">No collaborator exist. Add new collaborator via Collaborator Tab above</option>`);
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseJSON);
            $('#products-table').hide();
            $('.no_data_found').html('<h3 class="m-t-15">No Product Found</h3>');
        }
    });
    return false;
})();

function addProductsToSelect(row_id){
    productsArr.forEach(i=>{
        $('.product.'+row_id).append(`<option value="${i.id}">${i.name}</option>`);
    })
}
$(document).ready(function () {

    // Handle the submit event for the invoice form
    $(document).on('submit', '.add-invoice-form', function (e) {
        e.preventDefault(); // Prevent the default form submission

        // Extract form data
        const product_id = $('select[name="product_id"]').val().trim();
        const quantity = $('input[name="quantity"]').val().trim();
        const billingMonth = $('select[name="billingMonth"]').val().trim();

        // Create FormData to handle file upload
        let formData = new FormData();
        formData.append('product_id', product_id);
        formData.append('quantity', quantity);
        formData.append('billingMonth', billingMonth);
        formData.append('pdfFile', $('#pdfFile')[0].files[0]); // Add the selected PDF file

        // Perform AJAX request
        $.ajax({
            url: `${api_url}/invoice/upload`,
            type: 'POST',
            contentType: false, // Set to false for FormData
            processData: false, // Set to false for FormData
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", auth);
            },
            data: formData,
            success: function (data, textStatus, jqXHR) {
                // Handle success response
                if (jqXHR.status == 200) {
                    $('.invoice_alert_div').removeClass('alert-danger').addClass('alert-success');
                    $(".invoice_alert_div").html("Inserted successfully").show().fadeTo(2000, 500).slideUp(500).hide(0, function () {
                        // Additional logic after successful upload
                    });
                } else {
                    $(".invoice_alert_div").empty().hide().removeClass('alert-success').addClass('alert-danger');
                    $(".invoice_alert_div").text("Something didn't work").show().fadeTo(2000, 500).slideUp(500);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle error response
                $(".invoice_alert_div").empty().hide().addClass('alert-danger').removeClass('alert-success');

                if (jqXHR.hasOwnProperty('responseJSON') && jqXHR.responseJSON.hasOwnProperty('message'))
                    $(".invoice_alert_div").text(jqXHR.responseJSON.message).show().fadeTo(5000, 500).slideUp(500);
                else
                    $(".invoice_alert_div").text("Something didn't work").show(0).delay(3000).hide(0);
            }
        });

        return false;
    });

    // Additional logic for other functionalities

    
    

    $(document).on("click", ".add_new_invoice_product", function () {
        const count = $(".product_parent > div").length + 1;
        const html = `<div class="row ${count} m-t-15"> <div class="col-md-6 "> <label>Name</label> <select class="form-control product ${count}" required> <option>Select Product</option> </select> </div><div class="col-md-1 "> <label>Quantity</label> <input type="number" step="1" min="1" max="9999" class="form-control quantity ${count}" placeholder="Qty" name="quantity" required> </div><div class="col-md-2 "> <label>Rate (in $)</label> <input type="number" step="0.01" min="0.01" max="9999" class="form-control rate ${count}" placeholder="Rate" name="rate" required> </div><div class="col-md-2 "> <label>Amount (in $)</label> <div></div></div><div class="col-md-1 remove_product_row" data-rowid="${count}"><i class="fa fa-times" aria-hidden="true" ></i></div></div>`;
        $(".product_parent").append(html);
    });

    $(document).on('click', ".add_new_invoice", function () {
        $('.add-invoice-form').show();
        $('.remove_new_invoice').show();
        $('.add_new_invoice').hide();
    })

    $(document).on('click', ".remove_new_invoice", function () {
        $('.add-invoice-form').hide();
        $('.add-invoice-form').trigger("reset");
        $('.remove_new_invoice').hide();
        $('.add_new_invoice').show();
    })

    $(document).on("keyup", ".quantity,.rate", function (event) {
        determineRateQty();
    });

    $(document).on("change", ".quantity,.rate", function (event) {
        determineRateQty();
    });
    $(document).on("keyup", ".discount", function (event) {
        determineDiscount();
    });
    $(document).on("change", ".discount", function (event) {
        determineDiscount();
    });

    $(document).on("change", ".tax_val", function (event) {
        determineTaxVal();
    });

    $(document).on("keyup", ".tax_val", function (event) {
        determineTaxVal();
    });
    $(document).on("change", ".amt_paid", function (event) {
        determineAmtPaid();
    });

    $(document).on("keyup", ".amt_paid", function (event) {
        determineAmtPaid();
    });
    $(document).on("change", ".shipping_charge", function (event) {
        determineShipping();
    });

    $(document).on("keyup", ".shipping_charge", function (event) {
        determineShipping();
    });

   
});
