/**
 * Function to extract text from XML document using tags.
 * @param xmlTag - xml tag for which text needs to be extracted
 * @param xmlText - complete xml string
 */
function extractFromXmlTag(xmlTag, xmlText) {
    try {
        var xmlTagname = xmlTag;
        var text = xmlText;
        var exp = '<' + xmlTagname + '>([^<]*)</' + xmlTagname + '>';
        var extractedText = text.match(exp);
        return extractedText[1];
    } catch (Exception) {
        console.log('++++ error ++++ : extractFromXmlTag() : ' + Exception);
        return "";
    }
}

/**
 *  Function to replace strings within cdata section or any other text.
 * @param cdataString - cdata text
 * @param opts - specify the characters that you want to replace inside cdataString 
 * e.g: {"0":"&lt;|<", "1":"&gt;|>", "2":"&quot;|\""}
 */
function cdataToXmlConversion(cdataString, opts) {
    var options = opts;
    var xmlString = cdataString;
    try {
        var cnt = 0;
        for (option in options) {
            var exprString = options[cnt].split("|")[0];
            var regex = new RegExp(exprString, 'g');
            xmlString = xmlString.replace(regex, options[cnt].split("|")[1]);
            cnt++;
        }
        return xmlString;
    } catch (Exception) {
        console.log('++++ error ++++ : cdataToXmlConversion() : ' + Exception);
        return "";
    }
}

module.exports = { extractFromXmlTag, cdataToXmlConversion }