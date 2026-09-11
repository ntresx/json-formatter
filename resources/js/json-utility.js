const POSITION_PATTERN = /position\s+(\d+)/i;

function getLineColumn(input, position) {
    const before = input.slice(0, position);
    const line = before.split('\n').length;
    const lastLineBreak = before.lastIndexOf('\n');
    const column = position - lastLineBreak;

    return { line, column };
}

export function parseJson(input) {
    try {
        const value = JSON.parse(input);
        return { valid: true, value, error: null };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Invalid JSON.';
        const match = message.match(POSITION_PATTERN);
        const position = match ? Number(match[1]) : null;
        const location = position === null ? null : getLineColumn(input, position);

        return {
            valid: false,
            value: null,
            error: {
                message,
                position,
                line: location?.line ?? null,
                column: location?.column ?? null,
            },
        };
    }
}

export function formatJson(input, indent = 2) {
    const parsed = parseJson(input);

    if (!parsed.valid) {
        throw new Error(parsed.error?.message ?? 'Invalid JSON.');
    }

    return JSON.stringify(parsed.value, null, indent);
}

export function minifyJson(input) {
    const parsed = parseJson(input);

    if (!parsed.valid) {
        throw new Error(parsed.error?.message ?? 'Invalid JSON.');
    }

    return JSON.stringify(parsed.value);
}
