var redirect_url = 'http://2.bp.blogspot.com/mTGn0Ri2HHrMQbEzkFKI0V_b2SYA1tSpReV1vYj21Q=m36';
var response_url;
$.ajax({
        type: "GET",
        url: redirect_url,
        success : function( data, textStatus, jqXHR){
              response_url = jqXHR.getResponseHeader('location');
        }
    });
 		console.log(response_url);
