export function parseGPTResponse(formattedString) {
    const dataChunks = formattedString.split("data:");
    const responseObjectText = dataChunks[dataChunks.length - 2].trim();
    const responseObject = JSON.parse(responseObjectText);
    return responseObject.message.content.parts[0];
}