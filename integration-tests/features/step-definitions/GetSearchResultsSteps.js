const fs = require('fs');
const { Before, Given, When, Then, After, Status, setDefaultTimeout } = require('cucumber');
const api = require('../../../utils/CommonApiMethods');
const common = require('../../../utils/CommonMethods');
const requestXMLsDir = __dirname + '../../../requestXMLs/';
const replaceOpts = { "0": "&lt;|<", "1": "&gt;|>", "2": "&quot;|\"" };

var should = require('chai').should(), expect = require('chai').expect;

var _url = 'http://10.236.21.21:8001/wsdl?wsdl',
    _headers = { 'Content-Type': 'text/xml' },
    _body = '',
    _response;

Given('Create getSearchResults request {string} {string} {string} {string} {string} {string} {string} {string}',
    function (FULLNAME, STREET, CITY, STATE, COUNTRY, DATEOFBIRTH, POSTALCODE, FILEIMG) {
        _body = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ofac="http://www.primeassociates.com/ComplianceManager/OFACReporter/"><soapenv:Header/><soapenv:Body><ofac:getSearchResults><ofac:username>travelex1</ofac:username><ofac:password>travelex1</ofac:password>  <ofac:orgcode>TVX</ofac:orgcode>  <ofac:xmlinput><![CDATA[<ns1:GETSEARCHRESULTS xsi:schemaLocation="http://www.primeassociates.com/ComplianceManager/OFACReporter" xmlns:ns1="www.primeassociates.com/ComplianceManager/OFACReporter" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> <ns1:INPUT> <ns1:ORGANIZATION>TRAVELEX</ns1:ORGANIZATION> <ns1:BRANCH>CURRSERV</ns1:BRANCH> <ns1:DEPT>NAM</ns1:DEPT> <ns1:SOURCE>SALT</ns1:SOURCE> <ns1:FILEIMG>' + FILEIMG + '</ns1:FILEIMG> <ns1:USEDB>true</ns1:USEDB> <ns1:DELEGATED>false</ns1:DELEGATED> <ns1:RETURNORIGINALREQUEST>false</ns1:RETURNORIGINALREQUEST> <ns1:SEARCHDATA> <ns1:PARTYID>1</ns1:PARTYID> <ns1:PARTYNAME ns1:ALGORITHM="MatchText" ns1:MISSPELLING="true" ns1:USETEXTEXCLUDE="true" ns1:MUSTMATCHTYPE="PARTYNAME,Keyword"> <ns1:FULLNAME>' + FULLNAME + '</ns1:FULLNAME> </ns1:PARTYNAME> <ns1:PARTYADDRESS> <ns1:STREET ns1:ALGORITHM="None" ns1:MISSPELLING="true" ns1:USETEXTEXCLUDE="true" ns1:MUSTMATCHTYPE="STREETADDRESS" >' + STREET + '</ns1:STREET> <ns1:CITY ns1:ALGORITHM="None" ns1:MISSPELLING="true" ns1:USETEXTEXCLUDE="true" ns1:MUSTMATCHTYPE="CITY" >' + CITY + '</ns1:CITY> <ns1:STATE ns1:ALGORITHM="None" ns1:MISSPELLING="true" ns1:USETEXTEXCLUDE="true" >' + STATE + '</ns1:STATE> <ns1:POSTALCODE>' + POSTALCODE + '</ns1:POSTALCODE> <ns1:COUNTRY ns1:ALGORITHM="None" ns1:MISSPELLING="true" ns1:USETEXTEXCLUDE="true" ns1:MUSTMATCHTYPE="COUNTRY" >' + COUNTRY + '</ns1:COUNTRY> </ns1:PARTYADDRESS> <ns1:DATEOFBIRTH ns1:ALGORITHM="None" ns1:MISSPELLING="true" ns1:USETEXTEXCLUDE="true" >' + DATEOFBIRTH + '</ns1:DATEOFBIRTH><ns1:PARTYOTHERDETAILS ns1:ALGORITHM="None" ns1:MISSPELLING="true" ns1:USETEXTEXCLUDE="true">MH-43:1254678</ns1:PARTYOTHERDETAILS></ns1:SEARCHDATA> </ns1:INPUT> </ns1:GETSEARCHRESULTS>]]></ofac:xmlinput></ofac:getSearchResults></soapenv:Body></soapenv:Envelope>';
        console.log('------ REQUEST BODY -------\n' + _body);
        this.attach('Request :\n' + _body);
    });

Then('I should get matchfound {string} in response', function (STATUS, callback) {
    console.log('Match found result: ' + STATUS);
    cdata = common.extractFromXmlTag('getSearchResultsResult', _response.body);
    cdata = common.cdataToXmlConversion(cdata, replaceOpts);
    expect(cdata.length).to.be.greaterThan(1);
    if ('true' == STATUS) {
        MATCHNAME = common.extractFromXmlTag('n:MATCHNAME', cdata);
        expect(MATCHNAME.length).to.be.greaterThan(1);
        this.attach('<b>MATCHNAME: </b>' + MATCHNAME);
        ORIGINALSDNNAME = common.extractFromXmlTag('n:ORIGINALSDNNAME', cdata);
        this.attach('<b>ORIGINALSDNNAME: </b>' + ORIGINALSDNNAME);
    } else if ('false' == STATUS) {
        cdata = common.extractFromXmlTag('n:MATCHNAME', cdata);
        expect(cdata.length).to.be.lessThan(1);
    }
    callback();
});

Given('Get the request {string}', function (xmlFileName) {
    _body = '' + fs.readFileSync(requestXMLsDir + xmlFileName);
    console.log('------ REQUEST BODY -------\n' + _body);
    this.attach('Request :\n' + _body);
});

When('I hit endpoint with getSearchResults request', async function () {
    try {
        _response = await api.POST(_url, _headers, _body);
        console.log('------ RESPONSE BODY -------\n' + _response.body);
        this.attach('Response :\n' + _response.body);
    } catch (error) {
        console.log('--Error-- : ' + error);
        this.attach('--Error-- :\n' + error);
        throw new Error(error);
    }
});

Then('I should get {int} responseStatus', function (statusCode, callback) {
    expect(_response.statusCode).to.equal(statusCode);
    callback();
});

Then('I should get valid response for {string}', function (serviceCall, callback) {
    let responseName = ''
    if ('getSearchResults' === serviceCall) {
        responseName = 'getSearchResultsResult';
    } else if ('getSearchResultsStatus' === serviceCall) {
        responseName = 'statusResultXml';
    }

    cdata = common.extractFromXmlTag(responseName, _response.body);
    cdata = common.cdataToXmlConversion(cdata, replaceOpts);
    expect(cdata.length).to.be.greaterThan(1);
    this.attach('Response:\n' + cdata);
    callback();
});

Then('I should get error response {string} and {string}', function (errorNum, errorDesc, callback) {
    ERRORCODE = common.extractFromXmlTag('n:ERRORNUM', _response.body);
    ERRORDESC = common.extractFromXmlTag('n:ERRORDESC', _response.body);
    expect(ERRORCODE).to.equal(errorNum);
    expect(ERRORDESC).to.contains(errorDesc);
    callback();
});

Then('I should get {string} and {string}', function (errorCode, errorDesc, callback) {
    ERRORCODE = common.extractFromXmlTag('n:ERRORCODE', _response.body);
    ERRORDESC = common.extractFromXmlTag('n:ERRORDESC', _response.body);
    expect(ERRORCODE).to.equal(errorCode);
    expect(ERRORDESC).to.contains(errorDesc);
    callback();
});