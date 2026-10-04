const SUB_WEIGHTS = {
    // "Protagonist": 1.2, etc
};

const CATEGORY_MULTIPLIERS = {
    objective: {
        Characters: 1.5,
        Writing: 1.5,
        Sound: 1.0,
        Animation: 1.0
    },
    subjective: {
        Emotions: 1.5,
        Story: 1.5,
        Characters: 1.0,
        Memory: 1.0
    }
};

/**
 * rounds a number to 2 decimal places
 * @param {number} n number to round
 * @returns {number} rounded number
 */
export const round2decimals = (n) => Math.round(n * 100) / 100;

/**
 * all layer3 subscores will be squared, then multiplied with optional weight
 * then divided by all weights, and finally the root is taken
 * @param {*} categoryData object with layer3 data
 * @returns weighted score for layer2 from 1 to 10 
 */
export const getWeightedRMS = (categoryData) => {
    // filters invalid data like 0 and null
    const validEntries = Object.entries(categoryData).filter(([_, value]) => value !== null && value !== undefined && value !== 0);
    if (validEntries.length === 0) return 0;

    // for each score, the value is squared then multiplied with a weight
    // and the weight is added to keep track
    const { sumOfSquares, sumOfWeights } = validEntries.reduce((acc, [key, value]) => {
        // considers subweights if defined
        const weight = SUB_WEIGHTS[key] || 1.0;
        
        return {
            sumOfSquares: acc.sumOfSquares + (weight * Math.pow(value, 2)),
            sumOfWeights: acc.sumOfWeights + weight
        };
    }, { sumOfSquares: 0, sumOfWeights: 0 });
    
    // should be score between 1 and 10
    return Math.sqrt(sumOfSquares / sumOfWeights);
};

/**
 * calculates the weighted rms score and scales it up with the category multiplier
 * @param {*} categoryData object with layer3 subscores
 * @param {string} sectionType 'objective' or 'subjective'
 * @param {string} categoryName name of the category (e.g. 'Characters')
 * @returns {number} scaled score for the category
 */
export const getCategoryScaledScore = (categoryData, sectionType, categoryName) => {
    // calculates rms and scales it up with the category multiplier
    const rmsScore = getWeightedRMS(categoryData);
    const multiplier = CATEGORY_MULTIPLIERS[sectionType][categoryName] || 1.0;
    
    return rmsScore * multiplier;
};

/**
 * folds through all categories in a section to get the total section score
 * @param {*} sectionData object containing all layer2 categories (eg either the objective or subjective object)
 * @param {string} sectionType 'objective' or 'subjective'
 * @returns {number} total section score
 */
export const getSectionScore = (sectionData, sectionType) => {
    // folds through all categories and calls function to calculate individual weighted scores before adding
    return Object.entries(sectionData).reduce((total, [categoryName, categoryData]) => { 
        return total + getCategoryScaledScore(categoryData, sectionType, categoryName);
    }, 0);
};

export const getObjectiveScore = (anime) => getSectionScore(anime.rating.objective, 'objective');
export const getSubjectiveScore = (anime) => getSectionScore(anime.rating.subjective, 'subjective');

/**
 * combines objective and subjective scores, leaves the center (5.5) 
 * mostly untouched, and stretches outwards towards the extremes
 * @param {*} anime anime object containing ratings
 * @returns {number} final smart-stretched and rounded score on a 1-10 scale
 */
export const getScore = (anime) => {
    const totalObjective = getObjectiveScore(anime);
    const totalSubjective = getSubjectiveScore(anime);
    
    const rawScore = (totalObjective + totalSubjective) / 10;
    
    // --- SMART-STRETCH
    const center = 5.5;
    const deviation = rawScore - center;
    
    const strength = 0.02; 

    const stretchBoost = strength * deviation * (rawScore - 1) * (10 - rawScore);
    
    const stretchedScore = rawScore + stretchBoost;

    return round2decimals(Math.max(1, Math.min(10, stretchedScore)));
};