import { getScore } from './scoreUtils';
export const sortAnimes = (animeList, layers, isAscending) => {
    const listCopy = [...animeList];
        
        const e1 = layers[0];
        const e2 = layers[1];
        const e3 = layers[2];

        if (e1 === 'id') {
            listCopy.sort((a, b) => isAscending ? a.id - b.id : b.id - a.id);
        } 
        else if (e1 === 'title') {
            listCopy.sort((a, b) => isAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
        }
        else if (e1 === 'alt_name') {
            listCopy.sort((a, b) => isAscending ? a.alt_name.localeCompare(b.alt_name) : b.alt_name.localeCompare(a.alt_name));
        }
        else if (e1 === 'season') {
            const seasonWeights = { 'Winter': 1, 'Spring': 2, 'Summer': 3, 'Fall': 4 };

            listCopy.sort((a, b) => {
                const getSeasonData = (seasonStr) => {
                    if (!seasonStr) return { year: 0, weight: 0 };
                    
                    const parts = seasonStr.split(' ');
                    const season = parts[0]; 
                    const year = parseInt(parts[1]) || 0; 
                    
                    return { year: year, weight: seasonWeights[season] || 0 };
                };
                const dataA = getSeasonData(a.season);
                const dataB = getSeasonData(b.season);
                if (dataA.year !== dataB.year) {
                    return isAscending ? dataA.year - dataB.year : dataB.year - dataA.year;
                }
                return isAscending ? dataA.weight - dataB.weight : dataB.weight - dataA.weight;
            });
        }
        else if (e1 === 'type') {
            listCopy.sort((a, b) => isAscending ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type));
        }
        else if (e1 === 'review_length') {
            listCopy.sort((a, b) => {
                const lenA = a.rating.explain.length;
                const lenB = b.rating.explain.length;
                return isAscending ? lenA - lenB : lenB - lenA;
            });
        }
        else if (e1 === 'mal_rating') {
            listCopy.sort((a, b) => {
                let scoreA = getScore(a);
                let scoreB = getScore(b);
                
                return isAscending ? scoreA - scoreB : scoreB - scoreA;
            });
        }
        else if (e1 === 'objective' || e1 === 'subjective') {
            listCopy.sort((a, b) => {
                let scoreA = 0;
                let scoreB = 0;

                if (e3 !== 'all') {
                    scoreA = a.rating[e1][e2][e3];
                    scoreB = b.rating[e1][e2][e3];
                } else if (e2 !== 'all') {
                    scoreA = Object.values(a.rating[e1][e2]).reduce((sum, val) => sum + val, 0);
                    scoreB = Object.values(b.rating[e1][e2]).reduce((sum, val) => sum + val, 0);
                } else {
                    Object.values(a.rating[e1]).forEach(sub => scoreA += Object.values(sub).reduce((s, w) => s + w, 0));
                    Object.values(b.rating[e1]).forEach(sub => scoreB += Object.values(sub).reduce((s, w) => s + w, 0));
                }
                return isAscending ? scoreA - scoreB : scoreB - scoreA;
            });
        }

        return listCopy;
    };
