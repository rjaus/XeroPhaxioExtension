// Example of new invoicing url format
//https://invoicing.xero.com/view/cf4972a1-b2fb-4585-a1c5-e8000c10c744
// Example of old invoicing url format
//https://go.xero.com/AccountsReceivable/View.aspx?InvoiceID=cf4972a1-b2fb-4585-a1c5-e8000c10c744

chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;

    // Xero Old Invoicing
    // check domain for invoice / InvoiceID
    if (url.match("^https://go.xero.com") && url.match("AccountsReceivable/View")) {
        // Parse the InvoiceID from the url & store it
        invoiceUrlId = /\?InvoiceID=([A-Za-z0-9-]{36})/.exec(url)
        xero_invoice_id = invoiceUrlId[1]
        console.log("Old Invoicing: "+xero_invoice_id)
    }

    // Xero New Invoicing
    // check domain for invoice / InvoiceID
    if (url.match("^https://invoicing.xero.com")) {
        // Parse the InvoiceID from the url & store it
        invoiceUrlId = /\/view\/([A-Za-z0-9-]{36})\?/.exec(url)
        xero_invoice_id = invoiceUrlId[1]
        console.log("New Invoicing: "+xero_invoice_id)    
    }
});

// Trigger the fax button to kick off the lambda function (via the API Gateway)
$(document).ready(function() {
    $('button#phaxio').click(function() {
        
        console.log('Fax Button Click Event')
        $('p.response').text('Please wait...')

        // Create payload to send (converted JSON prior to sending)
        data = { invoice_id: xero_invoice_id }

        // Send the request via AJAX
        $.ajax({
            type: 'POST',
            url: 'https://4ok3hn46ib.execute-api.us-east-1.amazonaws.com/prod/phaxio',
            crossDomain: true,
            data: JSON.stringify(data),
            dataType: 'json',
            success: function(responseData, textStatus, jqXHR) {
                $('p.response').text('Success: '+responseData.body)
            },
            error: function (responseData, textStatus, errorThrown) {
                $('p.response').text('Failed: '+responseData.body)
            }
        });
    });
});