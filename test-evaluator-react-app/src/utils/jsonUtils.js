export function convertObjectStringToSingleQuotesString(objectString) {

    console.log(`Attempting conversion of ${objectString} to single quotes`)
    try {
        const jsonObject = JSON.parse(objectString);
        const singleQuotedString = JSON.stringify(jsonObject) // Convert to a JSON string
            .replace(/"([^"]+)":/g, "'$1': ") // Replace keys with single-quoted keys
            .replace(/: "([^"]+)"/g, ": '$1'") // Replace values with single-quoted values
            .replace(/"/g, "\'")
            .replace(/,/g, ', ');

        console.log(`Successful conversion to single quotes: ${singleQuotedString}`)
        return singleQuotedString
    } catch (error) {
        console.log(`Not a json string, skip parsing to json`)
        return objectString
    }
}