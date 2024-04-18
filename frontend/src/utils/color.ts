export function lightenColor(color: string, amount: number) {
    return color.replace(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, (_, r, g, b) => {
        const rInt = parseInt(r, 16);
        const gInt = parseInt(g, 16);
        const bInt = parseInt(b, 16);
        return `#${Math.min(255, Math.round(rInt * (1 + amount))).toString(16)}${Math.min(255, Math.round(gInt * (1 + amount))).toString(16)}${Math.min(255, Math.round(bInt * (1 + amount))).toString(16)}`;
    });
}

export function darkenColor(color: string, amount: number) {
    return lightenColor(color, -amount);
}