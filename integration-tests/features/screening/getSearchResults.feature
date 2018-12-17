@all @getSearchResults
Feature: getSearchResults
    All scenarios for the 'getSearchResults' endpoint

    @inputs
    Scenario Outline: To verify match status in response for various inputs
        Given Create getSearchResults request <FULLNAME> <STREET> <CITY> <STATE> <COUNTRY> <DATEOFBIRTH> <POSTALCODE> <FILEIMG>
        When I hit endpoint with getSearchResults request
        Then I should get 200 responseStatus
        And I should get matchfound <STATUS> in response
        Examples:
            | FULLNAME        | STREET         | CITY       | STATE         | COUNTRY      | DATEOFBIRTH  | POSTALCODE | FILEIMG        | STATUS  |
            | 'Nancy Almeida' | 'Mumbai-India' | 'Mumbai'   | 'Maharashtra' | 'India'      | '12/12/1984' | '400064'   | 'PEPSD'        | 'false' |
            | 'Robert Mugabe' | 'Kandahar'     | 'Kandaher' | 'Kandaher'    | 'Agfanistan' | '01/01/1973' | ''         | 'PEPSD'        | 'true'  |
            | 'Nancy Almeida' | 'Mumbai-India' | 'Mumbai'   | 'Maharashtra' | 'India'      | '12/12/1984' | '400064'   | 'UKSANCTIONSD' | 'false' |
            | 'Robert Mugabe' | 'Kandahar'     | 'Kandaher' | 'Kandaher'    | 'Agfanistan' | '01/01/1973' | ''         | 'UKSANCTIONSD' | 'true'  |

    @missingInput
    Scenario: To verify invalid reponse if input is missed
        Given Get the request 'getSearchResults_cData_missing.xml'
        When I hit endpoint with getSearchResults request
        Then I should get 200 responseStatus
        And I should get '004' and 'xmlinput is empty or null'

    @missingValue
    Scenario Outline: To verify response if required parameter is set blank
        Given Get the request <requestXml>
        When I hit endpoint with getSearchResults request
        Then I should get 200 responseStatus
        And I should get <errorCode> and <errorDesc>
        Examples:
            | requestXml                                        | errorCode | errorDesc                                                                   |
            | 'getSearchResults_cData_missing_dateOfBirth.xml'  | '009'     | 'Date of Birth must be in dd/MM/yyyy format'                                |
            | 'getSearchResults_cData_missing_organization.xml' | '009'     | 'Missing organization'                                                      |
            | 'getSearchResults_cData_missing_branch.xml'       | '009'     | 'Missing branch'                                                            |
            | 'getSearchResults_cData_missing_source.xml'       | '009'     | 'SOURCE value null or empty'                                                |
            | 'getSearchResults_cData_missing_username.xml'     | '001'     | 'username is empty or null'                                                 |
            | 'getSearchResults_cData_missing_password.xml'     | '002'     | 'password is empty or null'                                                 |
            | 'getSearchResults_cData_missing_orgcode.xml'      | '003'     | 'orgCode is empty or null'                                                  |
            | 'getSearchResults_cData_missing_fullname.xml'     | '009'     | 'At least one of fullname, firstname, middlename, lastname must be present' |

    @invalidValue
    Scenario Outline: To verify response if invalid data is passed to required paramater
        Given Get the request <requestXml>
        When I hit endpoint with getSearchResults request
        Then I should get 200 responseStatus
        And I should get <errorCode> and <errorDesc>
        Examples:
            | requestXml                                       | errorCode | errorDesc                                    |
            | 'getSearchResults_cData_invalid_dateOfBirth.xml' | '009'     | 'Date of Birth must be in dd/MM/yyyy format' |