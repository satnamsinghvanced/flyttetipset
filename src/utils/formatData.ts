export const formatData = (inputData: string | undefined | null): string => {
    if (!inputData) return "";

    const lines = inputData.split('\n');
    let htmlContent = '';
    let isInsideParagraph = false;
    const h2Regex = /^\s*##\s*(.*)/;
    const h3Regex = /^\s*#\s*(.*)/;

    lines.forEach(line => {
        const trimmedLine = line.trim();
        const h2Match = line.match(h2Regex);
        const h3Match = line.match(h3Regex);

        if (h2Match) {
            if (isInsideParagraph) {
                htmlContent += '</p>\n';
                isInsideParagraph = false;
            }
            htmlContent += `<h2>${h2Match[1].trim()}</h2>\n`;
        } else if (h3Match) {

            if (isInsideParagraph) {
                htmlContent += '</p>\n';
                isInsideParagraph = false;
            }
            htmlContent += `<h3>${h3Match[1].trim()}</h3>\n`;
        } else if (trimmedLine.length > 0) {
            if (!isInsideParagraph) {
                htmlContent += '<p>';
                isInsideParagraph = true;
            } else {
                htmlContent += '<br/>';
            }
            htmlContent += trimmedLine;
        } else if (isInsideParagraph) {
            htmlContent += '</p>\n';
            isInsideParagraph = false;
        }
    });

    if (isInsideParagraph) {
        htmlContent += '</p>\n';
    }

    return htmlContent;
}