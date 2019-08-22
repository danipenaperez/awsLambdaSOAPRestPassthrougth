SOAP
---------
To execute a SOAP use the 'soap\*' headers:

Example:

Normal use:

This example execute the action 'Multiply' of the webservice defined at http://www.dneonline.com/calculator.asmx?WSDL using the body Parameters.
Notice that the service is SOAP, but our request is payload JSON. Internally is transformed and executed using the lib (https://github.com/vpulim/node-soap):

curl -X POST -k -H 'soapservicewsdl: http://www.dneonline.com/calculator.asmx?WSDL' -H 'soapactionname: Multiply' -H 'requesttype: SOAP' -i 'https://b3fpk5gty7.execute-api.us-west-2.amazonaws.com/Prod/pass' --data '{"intA": 3, "intB": 4}'

Response:

{"MultiplyResult":12}


Debug Options:


Using the Header -H 'debugoutput: true' the body will returns more info about the requested action from origin, like the original xml response from remote SOAP service.

Request:

curl -X POST -k -H 'soapservicewsdl: http://www.dneonline.com/calculator.asmx?WSDL' -H 'soapactionname: Multiply' -H 'requesttype: SOAP' -H 'debugoutput: true' -i 'https://b3fpk5gty7.execute-api.us-west-2.amazonaws.com/Prod/pass' --data '{"intA": 3, "intB": 4}'

Response
{
  "result": {
    "MultiplyResult": 12
  },
  "rawResponse": "<?xml version=\"1.0\" encoding=\"utf-8\"?><soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"><soap:Body><MultiplyResponse xmlns=\"http://tempuri.org/\"><MultiplyResult>12</MultiplyResult></MultiplyResponse></soap:Body></soap:Envelope>"
}



REST
---------

This example uses the "Swagger PetStore Rest Public Service" to perform a GET over /inventory/store resource. Internally uses axios node lib (https://github.com/axios/axios)
The original request Verb is inherit to perform the internal request.

Request: 

'''
curl -X GET -k -H 'url: https://petstore.swagger.io/v2/store/inventory' -i 'https://b3fpk5gty7.execute-api.us-west-2.amazonaws.com/Prod/pass'

{"1":1,"2334":1,"drtert":1,"sold":21,"string":20,"unavailable":1,"Nonavailable":1,"pending":22,"available":2230,"boidog":1,"AVAILABLE":2,"qqqq":1,"sols":1,"missing":1,"Available":1,"thth":1}
'''

Debug options, if you want more info add the header "debugoutput.true"

'''
curl -X GET -k -H 'url: https://petstore.swagger.io/v2/store/inventory' -H 'debugoutput: true' -i 'https://b3fpk5gty7.execute-api.us-west-2.amazonaws.com/Prod/pass'

{"data":{"1":1,"2334":1,"drtert":1,"sold":21,"string":19,"unavailable":1,"Nonavailable":1,"pending":22,"available":2230,"boidog":1,"AVAILABLE":2,"qqqq":1,"sols":1,"missing":1,"Available":1,"thth":1},"statusCode":200,"responseHeaders":{"date":"Wed, 21 Aug 2019 12:37:26 GMT","access-control-allow-origin":"*","access-control-allow-methods":"GET, POST, DELETE, PUT","access-control-allow-headers":"Content-Type, api_key, Authorization","content-type":"application/json","connection":"close","server":"Jetty(9.2.9.v20150224)"}}
'''


To perform a POST,  :
'''
curl -X POST -H 'url: https://petstore.swagger.io/v2/store/order' -H 'Accept: application/json' -H 'Content-Type: application/json' -i ' https://b3fpk5gty7.execute-api.us-west-2.amazonaws.com/Prod/pass' --data '{
  "id": 0,
  "petId": 12,
  "quantity": 3,
  "shipDate": "2019-08-21T08:02:29.251Z",
  "status": "placed",
  "complete": false
}'
'''


This an example with a request that fails caused by not set content-type correctly (the debugoutput:true adds the "requestInfo" to the response with info about the internal request).
So the internal is not sending the application/json contentype correctly.

'''
curl -X POST -k -H 'url: https://petstore.swagger.io/v2/store/order' -H 'debugoutput: true' -i 'https://b3fpk5gty7.execute-api.us-west-2.amazonaws.com/Prod/pass' --data '{
  "id": 0,
  "petId": 12,
  "quantity": 3,
  "shipDate": "2019-08-21T08:02:29.251Z",
  "status": "placed",
  "complete": false
}'

Response

{
  "body": {
    "code": 415,
    "type": "unknown",
    "message": "com.sun.jersey.api.MessageException: A message body reader for Java class io.swagger.sample.model.Order, and Java type class io.swagger.sample.model.Order, and MIME media type text/plain; charset=UTF-8 was not found.\nThe registered message body readers compatible with the MIME media type are:\n*/* ->\n  com.sun.jersey.core.impl.provider.entity.FormProvider\n  com.sun.jersey.core.impl.provider.entity.StringProvider\n  com.sun.jersey.core.impl.provider.entity.ByteArrayProvider\n  com.sun.jersey.core.impl.provider.entity.FileProvider\n  com.sun.jersey.core.impl.provider.entity.InputStreamProvider\n  com.sun.jersey.core.impl.provider.entity.DataSourceProvider\n  com.sun.jersey.core.impl.provider.entity.XMLJAXBElementProvider$General\n  com.sun.jersey.core.impl.provider.entity.ReaderProvider\n  com.sun.jersey.core.impl.provider.entity.DocumentProvider\n  com.sun.jersey.core.impl.provider.entity.SourceProvider$StreamSourceReader\n  com.sun.jersey.core.impl.provider.entity.SourceProvider$SAXSourceReader\n  com.sun.jersey.core.impl.provider.entity.SourceProvider$DOMSourceReader\n  com.sun.jersey.json.impl.provider.entity.JSONJAXBElementProvider$General\n  com.sun.jersey.json.impl.provider.entity.JSONArrayProvider$General\n  com.sun.jersey.json.impl.provider.entity.JSONObjectProvider$General\n  com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider\n  com.sun.jersey.core.impl.provider.entity.XMLRootElementProvider$General\n  com.sun.jersey.core.impl.provider.entity.XMLListElementProvider$General\n  com.sun.jersey.core.impl.provider.entity.XMLRootObjectProvider$General\n  com.sun.jersey.core.impl.provider.entity.EntityHolderReader\n  com.sun.jersey.json.impl.provider.entity.JSONRootElementProvider$General\n  com.sun.jersey.json.impl.provider.entity.JSONListElementProvider$General\n  com.sun.jersey.json.impl.provider.entity.JacksonProviderProxy\ntext/plain; charset=UTF-8 ->\n  com.sun.jersey.core.impl.provider.entity.StringProvider\n  com.sun.jersey.core.impl.provider.entity.ReaderProvider\n"
  },
  "statusCode": 415,
  "requestInfo": {
    "headers": "POST /v2/store/order HTTP/1.1\r\nAccept: */*\r\nContent-Type: text/plain;charset=UTF-8\r\nUser-Agent: axios/0.19.0\r\nContent-Length: 105\r\nHost: petstore.swagger.io\r\nConnection: close\r\n\r\n",
    "method": "POST"
  }
}


'''

