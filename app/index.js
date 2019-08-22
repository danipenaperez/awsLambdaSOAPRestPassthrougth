
const axios = require('axios');
const soap = require('soap');
const url = require("url");

/**
*  Main Handler ANY Method and PATH
**/
exports.handler = (event, context, callback) => {
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
		          		if(requestInfo.debugOutput){
		          			_err.body.rawResponse = rawResponse;
		          			_err.body.rawRequest = rawRequest;
		          		}
		          		callback(null, {statusCode:500, body: JSON.stringify(_err)});	
		          	}

		          	var _result = result;
		          	if(requestInfo.debugOutput){
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

/**
* Execute non SOAP HTTP request (REST or simple request)
**/
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
		    var data = response.data;
		    if(requestInfo.debugOutput){
		    	data = {
		    				data: response.data,
		    				statusCode: response.status,
		    				responseHeaders: response.headers
		    				//,request: response.request
		    			};
		    }
		    callback(null ,  {
							body: JSON.stringify(data),
							statusCode: response.status,
							headers: response.headers
						});
	  })
	  .catch(function (error) {
		  	console.log('Error on the Requested Operation. Details:');
		    console.log(error);
		    var data = {
							body: error.response.data,
							statusCode: error.response.status,
							//headers: error.response.headers, 
							
						};
		    if(requestInfo.debugOutput){
		    	/**
		    	Object.keys(error.response.request).forEach(function(key) {
		    		console.log('----------START---------');
				  var val = error.response.request[key];
				  console.log(key);
				  console.log(val);
				  console.log('----------END---------');
				});
				**/
		    	data.requestInfo = {
								headers: error.response.request._header,
								method: error.response.request.method,
								data: error.response.request.data
						};
		    }
		    callback(null ,   {
							body: JSON.stringify(data),
							statusCode: error.response.status
							
						});



	  })
	  .then(function () {
	     console.log('The job has been done.');
	  }); 

}



/**
* Read Request headers and body and generate the RequestInfo object that contains the info for the requested execution.
**/
function parseToRequestInfo(event){

	const options = {
		requestType: event.headers.requesttype ? event.headers.requesttype : 'http',
		soapServiceWSDL : event.headers.soapservicewsdl , 
		soapActionName: event.headers.soapactionname ,
		debugOutput: 'true' == event.headers.debugoutput? true: null  ,
		url: event.headers.url,
		httpMethod: event.headers.httpmethod ? event.headers.httpmethod: event.httpMethod, 
		headers: {
			"Accept" : event.headers.Accept ? event.headers.Accept: 'application/json',
			"Content-Type" : event.headers['content-type'] ? event.headers['content-type']: 'application/json',
		}, 
		body: JSON.parse(event.body)

	};

	//Credentials headers management
	event.headers['Authorization'] ? headers["Authorization"] = event.headers['Authorization']: console.log('Not added any Authorization header.') ;
	
	console.log('Configuration Options assembled: ');
	console.log(options);
	return options;
}
