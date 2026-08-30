export const getScore = (anime) => {
        let total = 0;

        Object.values(anime.rating.objective).forEach(sub => {
            if (typeof sub === 'object') {
                total += Object.values(sub).reduce((s, w) => s + w, 0);
            }
        });

        Object.values(anime.rating.subjective).forEach(sub => {
            if (typeof sub === 'object') {
                total += Object.values(sub).reduce((s, w) => s + w, 0);
            }
        });

        return total / 10;
    };