import { useState } from 'react';

const kategorien = {
    objective: {
        Characters: ["Protagonist", "Antagonist", "Side Characters", "Realistic"],
        Writing: ["Ending", "Logical", "Plot"],
        Sound: ["OST/BGM", "Voiceacting", "OP/ED", "SFX"],
        Animation: ["Animation", "Character Design", "Worldbuilding"]
    },
    subjective: {
        Emotions: ["Strong emotions", "Vibe", "Climax"],
        Story: ["Satisfying Ending", "No unnecessary scenes", "Enjoyable Content"],
        Characters: ["Likeable", "Waifus", "Relationships"],
        Memory: ["Aftertaste", "Addictiveness", "Nostalgia"]
    }
};

export default function SortMenu({ onSort, meanScore }) {
    const [ebene1, setEbene1] = useState('id');
    const [ebene2, setEbene2] = useState('all');
    const [ebene3, setEbene3] = useState('all');
    const [isAscending, setIsAscending] = useState(false);

    const handleDirectionToggle = () => {
        const neueRichtung = !isAscending;
        setIsAscending(neueRichtung);
        onSort([ebene1, ebene2, ebene3], neueRichtung);
    };

    const handleEbene1 = (e) => {
        const wahl = e.target.value;
        setEbene1(wahl);
        setEbene2('all');
        setEbene3('all');
        onSort([wahl, 'all', 'all'], isAscending);
    };

    const handleEbene2 = (e) => {
        const wahl = e.target.value;
        setEbene2(wahl);
        setEbene3('all');
        onSort([ebene1, wahl, 'all'], isAscending);
    };

    const handleEbene3 = (e) => {
        const wahl = e.target.value;
        setEbene3(wahl);
        onSort([ebene1, ebene2, wahl], isAscending);
    };

    return (
        <div className="sort-menu">
            
            <label>Sort:</label>
            
            <button onClick={handleDirectionToggle} className="direction-toggle">
                {isAscending ? '⬆️' : '⬇️'} {isAscending ? 'Asc' : 'Desc'}
            </button>

            <select value={ebene1} onChange={handleEbene1}>
                <optgroup label="Info">
                    <option value="id">MAL ID</option>
                    <option value="title">Title</option>
                    <option value="alt_name">Alternative title</option>
                    <option value="season">Season</option>
                    <option value="type">Type (TV, Movie...)</option>
                    <option value="mal_rating">MAL Score</option>
                    <option value="review_length">Review length</option>
                </optgroup>

                <optgroup label="Rating details">
                    <option value="objective">Objective</option>
                    <option value="subjective">Subjective</option>
                </optgroup>
            </select>

            {(ebene1 === 'objective' || ebene1 === 'subjective') && (
                <select value={ebene2} onChange={handleEbene2} style={{ marginLeft: '10px' }}>
                    <option value="all">Full {ebene1} score</option>
                    {Object.keys(kategorien[ebene1]).map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                    ))}
                </select>
            )}

            {ebene2 !== 'all' && (ebene1 === 'objective' || ebene1 === 'subjective') && (
                <select value={ebene3} onChange={handleEbene3} style={{ marginLeft: '10px' }}>
                    <option value="all">Full {ebene2} score</option>
                    {kategorien[ebene1][ebene2].map((krit) => (
                        <option key={krit} value={krit}>{krit}</option>
                    ))}
                </select>
            )}

            <div className="mean-score-box">
                <span className="label">Mean Score:</span>
                <span className="value">{meanScore}</span>
            </div>
        </div>
    );
}