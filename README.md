SOAP
---------
To execute a SOAP use the 'soap\*' headers:

Example:

Normal use:

Request:

curl -X POST -H 'soapServiceWSDL: http://www.dneonline.com/calculator.asmx?WSDL' -H 'soapActionName: Multiply' -H 'requesttype: SOAP' -i ' https://b3fpk5gty7.execute-api.us-west-2.amazonaws.com/Prod/hola/caracola' --data '{"intA": 3, "intB": 4}'

Response:

{"MultiplyResult":12}


Debug Options:


Using the Header -H 'soapdebugoutput: true' the body will returns more info about the requested action from origin

Request:

curl -X POST -H 'soapServiceWSDL: http://www.dneonline.com/calculator.asmx?WSDL' -H 'soapActionName: Add' -H 'soapdebugoutput: true' -H 'requesttype: SOAP' -i ' https://b3fpk5gty7.execute-api.us-west-2.amazonaws.com/Prod/hola/caracola' --data '{"intA": 3, "intB": 4}'

Response
{
  "result": {
    "AddResult": 7
  },
  "rawResponse": "<?xml version=\"1.0\" encoding=\"utf-8\"?><soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"><soap:Body><AddResponse xmlns=\"http://tempuri.org/\"><AddResult>7</AddResult></AddResponse></soap:Body></soap:Envelope>"
}



REST
---------
To execute a REST request use:

curl -X GET -H 'url: https://petstore.swagger.io/v2/store/inventory' -i ' https://b3fpk5gty7.execute-api.us-west-2.amazonaws.com/Prod/pass'



curl -X POST -H 'url: https://petstore.swagger.io/v2/store/order' -H 'Accept: application/json' -H 'Content-Type: application/json' -i ' https://b3fpk5gty7.execute-api.us-west-2.amazonaws.com/Prod/pass' --data '{
  "id": 0,
  "petId": 12,
  "quantity": 3,
  "shipDate": "2019-08-21T08:02:29.251Z",
  "status": "placed",
  "complete": false
}'



curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'url: https://petstore.swagger.io/v2/user' -H 'httpMethod: post' -i ' https://b3fpk5gty7.execute-api.us-west-2.amazonaws.com/Prod/pass' --data '{
  "id": 0,
  "username": "Daniel",
  "firstName": "Rocking",
  "lastName": "Rockstar",
  "email": "danielus2@gmail.com ",
  "password": "123456",
  "phone": "77788990",
  "userStatus": 0
}'




