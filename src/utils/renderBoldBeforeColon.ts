export const renderBoldBeforeColon = (text: string) => {
    const [beforeColon, afterColon] = text.split(':', 2);

    return `<b>${beforeColon}</b>:${afterColon}`;
}

