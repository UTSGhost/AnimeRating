export const sumValues = (object) => Object.values(object).reduce((a, b) => a + b, 0);
export const round2decimals = (n) => Math.round(n * 100) / 100;

export const getObjectiveScore = (anime) => {
    return Object.values(anime.rating.objective).reduce((acc, cat) => acc + sumValues(cat), 0);
};

export const getSubjectiveScore = (anime) => {
    return Object.values(anime.rating.subjective).reduce((acc, cat) => acc + sumValues(cat), 0);
};

export const getScore = (anime) => {
    const totalObjective = getObjectiveScore(anime);
    const totalSubjective = getSubjectiveScore(anime);

    return round2decimals((totalObjective + totalSubjective) / 10);
};