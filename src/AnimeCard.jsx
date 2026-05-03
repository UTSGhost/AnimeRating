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

    const renderSubCategory = (title, data) => (
        <div className="sub-cat-block" key={title}>
            <h4>{title.replace('_', ' ').toUpperCase()}</h4>
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

    const getDynamicHue = (score) => {
        const s = Math.max(0, Math.min(10, score));

        const colorMap = {
            0: 0,
            1: 5,
            2: 15,
            3: 30,
            4: 45,
            5: 60,
            6: 90,
            7: 120,
            8: 150,
            9: 220,
            10: 265
        };

        const lower = Math.floor(s);
        const upper = Math.ceil(s);
        const fraction = s - lower;

        const hueLower = colorMap[lower];
        const hueUpper = colorMap[upper];

        return hueLower + (hueUpper - hueLower) * fraction;
    };

    const hue = getDynamicHue(malRate);
    const dynamicColor = `hsl(${hue}, 80%, 40%)`;

    if (isFlipped) {
        return (
            <div className="anime-card flipped">
                <button className="back-btn" onClick={() => setIsFlipped(false)}>Zurück zur Info</button>
                <div className="review-text">
                    <h3>Review: {anime.name}</h3>
                    <div dangerouslySetInnerHTML={{ __html: anime.rating.explain }} />
                </div>
            </div>
        );
    }

    return (
        <div className={`anime-card ${showAdvanced ? 'is-expanded' : ''}`}>
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
                <div 
                    className="main-score" 
                    style={{ backgroundColor: dynamicColor }}>
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
                    <div className="category-summary">
                        <div className="detail-grid">
                            <div>Characters: {scoreCharacters}/15</div>
                            <div>Writing: {scoreWriting}/15</div>
                            <div>Sound: {scoreSound}/10</div>
                            <div>Art: {scoreArt}/10</div>
                        </div>
                        <div className="detail-grid subj">
                            <div>Emotions: {scoreEmotions}/15</div>
                            <div>Story: {scoreStory}/15</div>
                            <div>Subj. Chars: {scoreSubjChars}/10</div>
                            <div>Memory: {scoreMemory}/10</div>
                        </div>
                    </div>

                    <hr className="detail-divider" />

                    <div className="full-criteria-list">
                        <div className="criteria-column">
                            <h3>OBJECTIVE DETAILS</h3>
                            {Object.entries(obj).map(([key, val]) => renderSubCategory(key, val))}
                        </div>
                        <div className="criteria-column">
                            <h3>SUBJECTIVE DETAILS</h3>
                            {Object.entries(subj).map(([key, val]) => renderSubCategory(key, val))}
                        </div>
                    </div>
                </div>
            )}

            <button className="flip-btn" onClick={() => setIsFlipped(true)}>
                Review lesen
            </button>
        </div>
    );
}