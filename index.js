'use strict';



// put your own value below!
const apiKey = 'DqQaqDEaGFy061RXp7zJnKOygmra43Wpc3e9TvrT'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';
const fields = 'addresses';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++){
    // for each object in the data array 
    // add a list item to the results 
    // display the park fullname, description, and website url
    // EXTRA: for each park, display the addresses
    
    let html_output = '';
    
    let addressItem = responseJson.data[i].addresses;
    let address = '';
    
    for (let x = 0 ; x < addressItem.length; x++){
    	address += `<p><strong>${addressItem[x].type} Address</strong><br>`;
    	address += (addressItem[x].line1 !== '') ? `${addressItem[x].line1}<br>` : '';
    	address += (addressItem[x].line2 !== '') ? `${addressItem[x].line2}<br>` : '';
    	address += (addressItem[x].line3 !== '') ? `${addressItem[x].line3}<br>` : '';
    	address += `${addressItem[x].city}, ${addressItem[x].stateCode} ${addressItem[x].postalCode}</p>`;
    }
      
      $('#results-list').append(`<li><h3>${responseJson.data[i].fullName} (${responseJson.data[i].states})</h3>
      <p><a href='${responseJson.data[i].url}' target="_blank">Website</a> | <a href="${responseJson.data[i].directionsUrl}" target="_blank">Directions</a></p>
      <p><strong>Description</strong><br>${responseJson.data[i].description}</p>
      ${address}
      </li>`);
    
    };
   
  //display the results section  
  $('#results').removeClass('hidden');
};

function getParks(searchTerm, limit=10) {
  const params = {
    api_key: apiKey,
    stateCode: searchTerm,
    limit: limit-1, /* without -1 returns 1 too many results */
    fields: fields
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    $('#results-list').empty();
     $('#results-list').html('<div id="loader"><img src="loader.gif" alt="loading..."></div>');
     
    const searchTerm = $('#js-search-term').val();
    const limit = $('#js-max-results').val();
    
    // console.log('limit = ' + limit);
    
    getParks(searchTerm, limit);
  });
}


/* for Select2 dropdown to select multiple states */
$(function() { 
    $('.js-example-basic-multiple').select2();
     $(document).on('click', '.js-reset', function(event){
     
     // clear results list
  	 $('#results-list').empty();
  	 
	//jide the results section  
	$('#results').addClass('hidden');
  	 
  	 // empty select2 dropdown
     $('#js-search-term').val(null).trigger('change'); 
     
     // focus on dropdown
	$('.js-example-basic-multiple').focus();

    });
})

$(watchForm);