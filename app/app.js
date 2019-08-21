
const axios = require('axios');
const soap = require('soap');
const url = require("url");


exports.handle = (event, context, callback) => {
	var requestInfo = parseToRequestInfo(event);
	if(requestInfo.requestType == 'SOAP'){
		executeSOAP(requestInfo, callback);
	}else {
		return executeRest(requestInfo, callback);
	}

}



/**
* Execute SOAP Request
*
**/
function executeSOAP (requestInfo, callback){

	try{
		var url = requestInfo.soapServiceWSDL ;
	  	var args = requestInfo.body;
	  	soap.createClient(url, function(err, client) {

	      	if(requestInfo.soapActionName == 'describe'){
	      		callback(null ,  {
						body: JSON.stringify(client.describe()),
						statusCode: 200
					});
	      	}else{
	      		client[requestInfo.soapActionName](args, function(err, result, rawResponse, rawRequest) {

		          	if(err){
		          		console.log(err);
		          		var _err= err;
		          		if(requestInfo.soapDebugOutput){
		          			_err.body.rawResponse = rawResponse;
		          			_err.body.rawRequest = rawRequest;
		          		}
		          		callback(null, {statusCode:500, body: JSON.stringify(_err)});	
		          	}

		          	var _result = result;
		          	if(requestInfo.soapDebugOutput){
		          		_result = {
		          			result: result, 
		          			rawResponse: rawResponse,
		          			rawRequest: rawRequest
		          		}
		          	}
		          	callback(null ,  {
						body: JSON.stringify(_result),
						statusCode: 200
					});
		      	});
	      	}
	      	
	  	});
	  }catch(err){
		console.log(err);
		callback(null, {statusCode:500, body: JSON.stringify(err)});	  	
	  }

}


function executeRest(requestInfo, callback){


	const destination = url.parse(requestInfo.url);

	const domainURL = destination.protocol+'//'+destination.host;
	const instance = axios.create({
	  baseURL: domainURL, 
	  //timeout: 1000,
	  headers: requestInfo.headers
	});

	const payload = requestInfo.body? requestInfo.body: null;

	console.log('Payload to send Details: ');
	console.log(payload);

	const response = instance[requestInfo.httpMethod.toLowerCase()](destination.path, payload)
	  .then(function (response) {
	  	console.log('Success Execution. Details :');
	  	console.log(response);
	  	console.log('Data Returned');
	    console.log(response.data);
	    callback(null ,  {
						body: JSON.stringify(response.data),
						statusCode: response.status
					});
	  })
	  .catch(function (error) {
	  	console.log('Error on the Requested Operation. Details:');
	    console.log(error);
	    callback(null ,  {
						body: JSON.stringify(error),
						statusCode: 500
					});
	  })
	  .then(function () {
	    console.log('aqui ejecutando');
	  }); 

}




function parseToRequestInfo(event){

	const options = {
		requestType: event.headers.requesttype ? event.headers.requesttype : 'http',
		soapServiceWSDL : event.headers.soapservicewsdl , 
		soapActionName: event.headers.soapactionname ,
		soapDebugOutput: event.headers.soapdebugoutput ,
		url: event.headers.url,
		httpMethod: event.headers.httpmethod ? event.headers.httpmethod: event.httpMethod, 
		headers: {
			"Accept" : event.headers.Accept ? event.headers.Accept: 'application/json',
			"Content-Type" : event.headers['content-type'] ? event.headers['content-type']: 'application/json'
		}, 
		body: JSON.parse(event.body)

	};
	console.log('las options montadas son ');
	console.log(options);
	return options;
}
