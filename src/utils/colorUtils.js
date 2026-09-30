export const getDynamicHue = (score) => {
        const s = Math.max(0, Math.min(10, score));
        const colorMap = {
            0: 0, 1: 5, 2: 15, 3: 30, 4: 45, 
            5: 60, 6: 90, 7: 120, 8: 150, 9: 220, 10: 265
        };

        const lower = Math.floor(s);
        const upper = Math.ceil(s);
        const fraction = s - lower;

        const hue = colorMap[lower] + (colorMap[upper] - colorMap[lower]) * fraction;
        return `hsl(${hue}, 80%, 40%)`;
    };