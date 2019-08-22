# The SOAPRestPassthrougth over lambda!

This project contains SAM template to deploy a AWS that works as Passthrougth to final SOAP or HTTP(Rest or not) services.



# RequestType: SOAP

To execute a SOAP use the 'soap\*' headers:
* **requesttype** (SOAP/http): if value is "SOAP" indicate that the internal request will be perform as SOAP.
* **soapservicewsdl**: The url that contains the webservice description
* **soapactionname**: The action to perform. Use "describe" to obtain a list of available operations on the service.
* **data**: The json data that will be transform and send to the final SOAP service action.


Request example using the free webservice [http://www.dneonline.com/calculator.asmx?WSDL](http://www.dneonline.com/calculator.asmx?WSDL):
```
curl -X POST -k -H 'soapservicewsdl: http://www.dneonline.com/calculator.asmx?WSDL' -H 'soapactionname: Multiply' -H 'requesttype: SOAP' -i 'https://b3fpk5gty7.execute-api.us-west-2.amazonaws.com/Prod/pass' --data '{"intA": 3, "intB": 4}'
```
Response:
```
{"MultiplyResult":12}
```

## Debugging options
Using the Header -H '**debugoutput: true**' the body will returns more info about the requested action from origin, like the original xml response from remote SOAP service.

Request:
```
curl -X POST -k -H 'soapservicewsdl: http://www.dneonline.com/calculator.asmx?WSDL' -H 'soapactionname: Multiply' -H 'requesttype: SOAP' -H 'debugoutput: true' -i 'https://b3fpk5gty7.execute-api.us-west-2.amazonaws.com/Prod/pass' --data '{"intA": 3, "intB": 4}'
```
Response:
```
{
  "result": {
    "MultiplyResult": 12
  },
  "rawResponse": "<?xml version=\"1.0\" encoding=\"utf-8\"?><soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"><soap:Body><MultiplyResponse xmlns=\"http://tempuri.org/\"><MultiplyResult>12</MultiplyResult></MultiplyResponse></soap:Body></soap:Envelope>"
}
```

# RequestType: HTTP (REST or NOT)

This example uses the [Swagger PetStore Rest Public Service](https://petstore.swagger.io/) to perform a GET over /inventory/store resource. Internally uses axios node lib [AXIOS](https://github.com/axios/axios)
* **requesttype** (SOAP/http (default)): if null or not send will be used HTTP(s) way.
* **url** : The final Url destination (supports query params.
> The original request Verb is inherit to perform the internal request.
> The query params will be get from "url" header not from the main request.

Request
```
curl -X GET -k -H 'url: https://petstore.swagger.io/v2/store/inventory' -i 'https://b3fpk5gty7.execute-api.us-west-2.amazonaws.com/Prod/pass'
```
Response:
```
{
   "1":1,
   "2334":1,
   "drtert":1,
   "sold":21,
   "string":20,
   "unavailable":1,
   "Nonavailable":1,
   "pending":22,
   "available":2230,
   "boidog":1,
   "AVAILABLE":2,
   "qqqq":1,
   "sols":1,
   "missing":1,
   "Available":1,
   "thth":1
}
```

Using **debugouput** header to get more info about the internal proccess

Request
```
curl -X GET -k -H 'url: https://petstore.swagger.io/v2/store/inventory' -H 'debugoutput: true' -i 'https://b3fpk5gty7.execute-api.us-west-2.amazonaws.com/Prod/pass'
```
Response:
```
{
   "data":{
      "1":1,
      "2334":1,
      "drtert":1,
      "sold":21,
      "string":19,
      "unavailable":1,
      "Nonavailable":1,
      "pending":22,
      "available":2230,
      "boidog":1,
      "AVAILABLE":2,
      "qqqq":1,
      "sols":1,
      "missing":1,
      "Available":1,
      "thth":1
   },
   "statusCode":200,
   "responseHeaders":{
      "date":"Wed, 21 Aug 2019 12:37:26 GMT",
      "access-control-allow-origin":"*",
      "access-control-allow-methods":"GET, POST, DELETE, PUT",
      "access-control-allow-headers":"Content-Type, api_key, Authorization",
      "content-type":"application/json",
      "connection":"close",
      "server":"Jetty(9.2.9.v20150224)"
   }
}
```

**PERFORM A POST REQUEST...**
In this way (using the free online REST PetStore Swagger Service:
Request
```
curl -X POST -k -H 'url: https://petstore.swagger.io/v2/store/order' -H 'debugoutput: false' -H 'Content-Type: application/json' -i 'https://b3fpk5gty7.execute-api.us-west-2.amazonaws.com/Prod/pass' --data '{
  "id": 0,
  "petId": 12,
  "quantity": 3,
  "shipDate": "2019-08-21T08:02:29.251Z",
  "status": "placed",
  "complete": false
}'
```
Response:
```
{
  "id": 0,
  "petId": 12,
  "quantity": 3,
  "shipDate": "2019-08-21T08:02:29.251+0000",
  "status": "placed",
  "complete": false
}
```

> All response internal headers add attached to the main response headers
```
1.  Status Code: 200 OK
2.  access-control-allow-headers: Content-Type, api_key, Authorization
3.  access-control-allow-methods: GET, POST, DELETE, PUT
4.  access-control-allow-origin: *
5.  content-length: 109
6.  content-type: application/json
7.  date: Thu, 22 Aug 2019 12:42:43 GMT
8.  via: 1.1 b797234d27f385a39f8a380c54637a5b.cloudfront.net (CloudFront)
9.  x-amz-apigw-id: e0sWbElkPHcFqAA=
10.  x-amz-cf-id: n2K_Y-VHSC3-aVC__rVE1sK8yZErjwCRBB-1Fwpj-1PmEEp3oUkx7Q==
11.  x-amz-cf-pop: MAD51-C1
12.  x-amzn-remapped-connection: close
13.  x-amzn-remapped-date: Thu, 22 Aug 2019 12:42:43 GMT
14.  x-amzn-remapped-server: Jetty(9.2.9.v20150224)
15.  x-amzn-requestid: 11d2914c-6dfc-42bb-83d7-90f34d585229
16.  x-amzn-trace-id: Root=1-5d5e8dc2-07d9cc00c533d8902d86b7c0;Sampled=0
17.  x-cache: Miss from cloudfront
18.  x-firefox-spdy: h2
```

**LETS try with the FAILED OPERATIONS MANAGEMENT**
This example send the before request but without the "Content-type:application/json" headers, so the service will fails (note that the debugoutput:true header is added):

Request
```
curl -X POST -k -H 'url: https://petstore.swagger.io/v2/store/order' -H 'debugoutput: true' -i 'https://b3fpk5gty7.execute-api.us-west-2.amazonaws.com/Prod/pass' --data '{
  "id": 0,
  "petId": 12,
  "quantity": 3,
  "shipDate": "2019-08-21T08:02:29.251Z",
  "status": "placed",
  "complete": false
}'
```
Response (the 415 error comes from the internal request)
```
1.  Status Code: 415 Unsupported Media Type
2.  content-length: 2322
3.  content-type: application/json
4.  date: Thu, 22 Aug 2019 12:46:29 GMT
5.  via: 1.1 40f375a15596f8d7b418a9c5dccce3d3.cloudfront.net (CloudFront)
6.  x-amz-apigw-id: e0s52F9UPHcF0CA=
7.  x-amz-cf-id: o-cfY9Z2HRcEGgqq6X78mSy0M2pR-_Gflft1bmnJ04Fj8gdZwh4npQ==
8.  x-amz-cf-pop: MAD51-C1
9.  x-amzn-requestid: 1990625b-d47e-448c-a8f5-1d90bffb8ec1
10.  x-amzn-trace-id: Root=1-5d5e8ea5-31625828417e0c9a4da605ee;Sampled=0
11.  x-cache: Error from cloudfront
12.  x-firefox-spdy: h2

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
```

And thats all..

