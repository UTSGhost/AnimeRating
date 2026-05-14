import { useState } from 'react';

export default function AnimeCard({ anime }) {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    const obj = anime.rating.objective;
    const subj = anime.rating.subjective;

    const sumValues = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);

    const scoreCharacters = sumValues(obj.characters);
    const scoreWriting = sumValues(obj.writing);
    const scoreSound = sumValues(obj.music_sound);
    const scoreArt = sumValues(obj.animation_art);
    const totalObjective = scoreCharacters + scoreWriting + scoreSound + scoreArt;

    const scoreEmotions = sumValues(subj.emotions);
    const scoreStory = sumValues(subj.story);
    const scoreSubjChars = sumValues(subj.characters);
    const scoreMemory = sumValues(subj.memory);
    const totalSubjective = scoreEmotions + scoreStory + scoreSubjChars + scoreMemory;

    const malRate = Math.round(((totalObjective + totalSubjective) / 10) * 100) / 100;

    const objScores = {
        characters: { score: scoreCharacters, max: 15 },
        writing: { score: scoreWriting, max: 15 },
        music_sound: { score: scoreSound, max: 10 },
        animation_art: { score: scoreArt, max: 10 }
    };

    const subjScores = {
        emotions: { score: scoreEmotions, max: 15 },
        story: { score: scoreStory, max: 15 },
        characters: { score: scoreSubjChars, max: 10 },
        memory: { score: scoreMemory, max: 10 }
    };

    const renderSubCategory = (title, data, scoreMap) => {
        const info = scoreMap[title];

        return (
            <div className="sub-cat-block" key={title}>
                <h4>
                    {title.replace('_', ' ').toUpperCase()} 
                    <span className="cat-total-score">
                        ({info.score}/{info.max})
                    </span>
                </h4>
                <ul>
                    {Object.entries(data).map(([key, value]) => (
                        <li key={key}>
                            <span className="attr-name">{key.replace(/_/g, ' ')}:</span>
                            <span className="attr-value">{value}</span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const getDynamicHue = (score) => {
        const s = Math.max(0, Math.min(10, score));
        const colorMap = {
            0: 0, 1: 5, 2: 15, 3: 30, 4: 45, 
            5: 60, 6: 90, 7: 120, 8: 150, 9: 220, 10: 265
        };

        const lower = Math.floor(s);
        const upper = Math.ceil(s);
        const fraction = s - lower;

        return colorMap[lower] + (colorMap[upper] - colorMap[lower]) * fraction;
    };

    const hue = getDynamicHue(malRate);
    const dynamicColor = `hsl(${hue}, 80%, 40%)`;

    return (
    <div className={`anime-card ${isFlipped ? 'flipped' : ''} ${showAdvanced ? 'is-expanded' : ''}`}>
        {!isFlipped ? (
            <>
                <div className="card-header">
                    <img src={anime.img} alt={anime.name} className="card-img" />
                    <div className="title-area">
                        <span className="mal-id">
                            <a href={`https://myanimelist.net/anime/${anime.id}`} target="_blank" rel="noreferrer">
                                #{anime.id}
                            </a>
                        </span>
                        <h2>{anime.name}</h2>
                        <p className="alt-title">{anime.alt_name}</p>
                    </div>
                    <div className="main-score" style={{ backgroundColor: dynamicColor }}>
                        {malRate}
                    </div>
                </div>

                <div className="card-meta">
                    <span>{anime.season}</span> • <span>{anime.type}</span>
                </div>

                <div className="summary-scores">
                    <div className="score-block">
                        <strong>Objective:</strong> {totalObjective}/50
                    </div>
                    <div className="score-block">
                        <strong>Subjective:</strong> {totalSubjective}/50
                    </div>
                </div>

                <button className="toggle-btn" onClick={() => setShowAdvanced(!showAdvanced)}>
                    {showAdvanced ? 'Details ausblenden ▲' : 'Alle Kriterien anzeigen ▼'}
                </button>

                {showAdvanced && (
                    <div className="advanced-details">
                        <div className="full-criteria-list">
                            <div className="criteria-column">
                                <h3>OBJECTIVE DETAILS</h3>
                                {Object.entries(obj).map(([key, val]) => renderSubCategory(key, val, objScores))}
                            </div>
                            <div className="criteria-column">
                                <h3>SUBJECTIVE DETAILS</h3>
                                {Object.entries(subj).map(([key, val]) => renderSubCategory(key, val, subjScores))}
                            </div>
                        </div>
                    </div>
                )}

                <button className="flip-btn" onClick={() => setIsFlipped(true)}>
                    Review lesen
                </button>
            </>
        ) : (
            <>
                <div className="review-text">
                    <h3>Review: {anime.name}</h3>
                    <div dangerouslySetInnerHTML={{ __html: anime.rating.explain }} />
                </div>
                <button className="flip-btn" onClick={() => setIsFlipped(false)}>
                    Zurück zur Info
                </button>
            </>
        )}
    </div>
);
}