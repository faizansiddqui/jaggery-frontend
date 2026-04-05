export const sanitizeDescriptionHtml = (value: string) =>
    String(value || '')
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
        .replace(/\son\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
        .replace(/javascript:/gi, '');

export const toReviewDateTime = (value: unknown) => {
    const parsed = new Date(String(value || Date.now()));
    const timestamp = Number.isFinite(parsed.getTime()) ? parsed.getTime() : Date.now();
    return {
        timestamp,
        label: new Date(timestamp)
            .toLocaleString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            })
            .toUpperCase(),
    };
};
