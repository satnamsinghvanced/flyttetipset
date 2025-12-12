export const formatData = (inputData: string | undefined | null): string => {
    if (!inputData) return "";

    // Normalize newlines and split into individual lines
    const lines = inputData.split('\n');
    let htmlContent = '';
    let isInsideParagraph = false; // To handle continuous paragraph lines

    // Regex to detect headers: ^\s* checks for optional leading whitespace
    const h2Regex = /^\s*##\s*(.*)/;
    const h3Regex = /^\s*#\s*(.*)/;

    lines.forEach(line => {
        const trimmedLine = line.trim();
        const h2Match = line.match(h2Regex);
        const h3Match = line.match(h3Regex);

        if (h2Match) {
            // End the previous paragraph if one was open
            if (isInsideParagraph) {
                htmlContent += '</p>\n';
                isInsideParagraph = false;
            }
            // Start a new H2 heading
            htmlContent += `<h2>${h2Match[1].trim()}</h2>\n`;
        } else if (h3Match) {
            // End the previous paragraph if one was open
            if (isInsideParagraph) {
                htmlContent += '</p>\n';
                isInsideParagraph = false;
            }
            // Start a new H3 heading
            htmlContent += `<h3>${h3Match[1].trim()}</h3>\n`;
        } else if (trimmedLine.length > 0) {
            // This is a non-empty paragraph line
            if (!isInsideParagraph) {
                // If not inside a paragraph, start one
                htmlContent += '<p>';
                isInsideParagraph = true;
            } else {
                // If inside a paragraph, add a <br> for a line break
                htmlContent += '<br/>';
            }
            // Add the line content
            htmlContent += trimmedLine;
        } else if (isInsideParagraph) {
            // This is an empty line acting as a paragraph break
            htmlContent += '</p>\n';
            isInsideParagraph = false;
        }
    });

    // Close any remaining open paragraph tag at the end of the file
    if (isInsideParagraph) {
        htmlContent += '</p>\n';
    }

    return htmlContent;
}