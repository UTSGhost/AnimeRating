import { useState } from 'react';

const kategorien = {
    objective: {
        characters: ["protagonist", "antagonist", "side_characters", "realistic"],
        writing: ["ending", "logical", "plot"],
        music_sound: ["ost_bgm", "voiceacting", "op_ed", "soundeffects"],
        animation_art: ["fight_scenes_general_smooth_movement", "character_design", "world_building"]
    },
    subjective: {
        emotions: ["comedic_sad_thrilling", "vibe", "climax"],
        story: ["satisfying_ending", "no_unnecessary_scenes", "enjoyable_content"],
        characters: ["likeable", "waifus", "relationships"],
        memory: ["aftertaste", "addictive", "nostalgia"]
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
                    <option value="title">Titel</option>
                    <option value="alt_name">Alternativer Titel</option>
                    <option value="season">Season</option>
                    <option value="type">Typ (TV, Movie...)</option>
                    <option value="mal_rating">MAL Rating (Gesamt-Score)</option>
                    <option value="review_length">Review Länge</option>
                </optgroup>

                <optgroup label="Rating details">
                    <option value="objective">Objective (Objektiv)</option>
                    <option value="subjective">Subjective (Subjektiv)</option>
                </optgroup>
            </select>

            {(ebene1 === 'objective' || ebene1 === 'subjective') && (
                <select value={ebene2} onChange={handleEbene2} style={{ marginLeft: '10px' }}>
                    <option value="all">🏆 Gesamten {ebene1}-Score</option>
                    {Object.keys(kategorien[ebene1]).map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                    ))}
                </select>
            )}

            {ebene2 !== 'all' && (ebene1 === 'objective' || ebene1 === 'subjective') && (
                <select value={ebene3} onChange={handleEbene3} style={{ marginLeft: '10px' }}>
                    <option value="all">📝 Gesamten {ebene2}-Score</option>
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