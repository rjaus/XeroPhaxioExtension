// new invoicing
//https://invoicing.xero.com/view/cf4972a1-b2fb-4585-a1c5-e8000c10c744
// old invoicing
//https://go.xero.com/AccountsReceivable/View.aspx?InvoiceID=cf4972a1-b2fb-4585-a1c5-e8000c10c744

chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
    console.log(url);

    // check domain for invoice / InvoiceID
    if (url.match("^https://go.xero.com") && url.match("AccountsReceivable/View")) {

        invoiceId = /\?InvoiceID=([A-Za-z0-9-]{36})/.exec(url)
        console.log("Old Invoicing: "+invoiceId[1])
        // Set invoiceId for Phaxio button
        $("#phaxio").val(invoiceId[1])

    }

    // create similar function for new invoicing
    // check domain for invoice / InvoiceID
    if (url.match("^https://invoicing.xero.com")) {
        invoiceId = /\/view\/([A-Za-z0-9-]{36})\?/.exec(url)
        console.log("New Invoicing: "+invoiceId[1])
        // Set invoiceId for Phaxio button
        $("#phaxio").val(invoiceId[1])
                
    }
});

// Trigger button to kick off lambda
$(document).ready(function() {
    $('button#phaxio').click(function() {
        console.log('clicked fax button')
        $.ajax({
            type: 'POST',
            url: 'https://4ok3hn46ib.execute-api.us-east-1.amazonaws.com/prod/phaxio',
            crossDomain: true,
            data: '{"invoiceId":$(this).val()}',
            dataType: 'json',
            success: function(responseData, textStatus, jqXHR) {
                $('p.response').text('Success: '+responseData)
            },
            error: function (responseData, textStatus, errorThrown) {
                $('p.response').text('Failed: '+responseData)
            }
        });
    });
});