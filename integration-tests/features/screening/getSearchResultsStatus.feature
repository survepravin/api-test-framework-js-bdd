@all @getSearchResultsStatus
Feature: getSearchResultsStatus
    All scenarios for the 'getSearchResultsStatus' endpoint

    @CDATAStatus
    Scenario: To verify positive response
        Given Get the request 'getSearchResultsStatus_cData_valid.xml'
        When I hit endpoint with getSearchResults request
        Then I should get 200 responseStatus
        And I should get valid response for 'getSearchResultsStatus'

    @missingInputStatus
    Scenario: To verify invalid reponse if input is missed
        Given Get the request 'getSearchResultsStatus_cData_invalid.xml'
        When I hit endpoint with getSearchResults request
        Then I should get 200 responseStatus
        And I should get error response '004' and 'xmlinput is empty or null'

    @missingValueStatus
    Scenario Outline: To verify response if required parameter is set blank
        Given Get the request <requestXml>
        When I hit endpoint with getSearchResults request
        Then I should get 200 responseStatus
        And I should get error response <errorNum> and <errorDesc>
        Examples:
            | requestXml                                          | errorNum | errorDesc                   |
            | 'getSearchResultsStatus_cData_missing_username.xml' | '001'    | 'username is empty or null' |
            | 'getSearchResultsStatus_cData_missing_password.xml' | '002'    | 'password is empty or null' |
            | 'getSearchResultsStatus_cData_missing_orgcode.xml'  | '003'    | 'orgCode is empty or null'  |

    @invalidValueStatus
    Scenario Outline: To verify response if invalid data is passed to required paramater
        Given Get the request <requestXml>
        When I hit endpoint with getSearchResults request
        Then I should get 200 responseStatus
        And I should get error response <errorNum> and <errorDesc>
        Examples:
            | requestXml                                               | errorNum | errorDesc                                                |
            | 'getSearchResultsStatus_cData_invalid_TransactionId.xml' | '010'    | 'Webservice Error :  Error while calling Duedil Service' |