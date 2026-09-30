import { useState } from 'react';
import DOMPurify from 'dompurify';

export default function AnimeCard({ anime, showAdvanced, onToggle, activeSort, config }) {

    const [isFlipped, setIsFlipped] = useState(false);



    const json_objective_data = anime.rating.objective;
    const json_subjective_data = anime.rating.subjective;

    // adds all values in an object and instantly round everything
    const sumValues = (object) => Math.round(Object.values(object).reduce((a, b) => a + b, 0) * 100) / 100;

    const scoreCharacters = sumValues(json_objective_data.Characters);
    const scoreWriting = sumValues(json_objective_data.Writing);
    const scoreSound = sumValues(json_objective_data.Sound);
    const scoreArt = sumValues(json_objective_data.Animation);
    const totalObjective = Math.round((scoreCharacters + scoreWriting + scoreSound + scoreArt) * 100) / 100;

    const scoreEmotions = sumValues(json_subjective_data.Emotions);
    const scoreStory = sumValues(json_subjective_data.Story);
    const scoreSubjChars = sumValues(json_subjective_data.Characters);
    const scoreMemory = sumValues(json_subjective_data.Memory);
    const totalSubjective = Math.round((scoreEmotions + scoreStory + scoreSubjChars + scoreMemory) * 100) / 100;

    const malRate = Math.round(((totalObjective + totalSubjective) / 10) * 100) / 100;

    const renderSubCategory = (title, data, type) => {
        const isHeaderHighlighted = 
        activeSort && 
        activeSort[0] === type && 
        activeSort[1] === title && 
        activeSort[2] === "all";

        return (
            <div className="sub-cat-block" key={title}>
                <h4 className={isHeaderHighlighted ? 'highlight' : ''}>
                    {title.replace('_', ' ').toUpperCase()} 
                    <span className="cat-total-score">
                        ({sumValues(data)}/{config[type][title].max_score})
                    </span>
                </h4>
                <ul>
                    {Object.entries(data).map(([key, value]) => {
                        const isItemHighlighted = 
                        activeSort && 
                        activeSort[0] === type && 
                        activeSort[1] === title && 
                        activeSort[2] === key;
                        return (
                            <li key={key} className={isItemHighlighted ? 'highlight subcategory-row' : 'subcategory-row'}>
                                <span className="attr-name">{key.replace(/_/g, ' ')}:</span>
                                <span className="attr-value">{value}</span>
                            </li>
                        );
                    })}
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
        
        {/*Front side, card always uses this height*/}
        <div className="card-front">
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

            <button className="toggle-btn" onClick={onToggle}>
                {showAdvanced ? 'Hide details ▲' : 'Show all criteria ▼'}
            </button>

            {showAdvanced && (
                <div className="advanced-details">
                    <div className="full-criteria-list">
                        <div className="criteria-column">
                            <h3>OBJECTIVE DETAILS</h3>
                            {Object.entries(json_objective_data).map(([key, val]) => renderSubCategory(key, val, 'objective'))}
                        </div>
                        <div className="criteria-column">
                            <h3>SUBJECTIVE DETAILS</h3>
                            {Object.entries(json_subjective_data).map(([key, val]) => renderSubCategory(key, val, 'subjective'))}
                        </div>
                    </div>
                </div>
            )}

            <button className="flip-btn" onClick={() => setIsFlipped(true)}>
                Read review
            </button>
        </div>

        {/*flipped side, might overflow auto with scroll bar*/}
        <div className="card-back">
            <div className="review-text">
                <h3>Review: {anime.name}</h3>
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(anime.rating.explain) }} />
            </div>
            <button className="flip-btn" onClick={() => setIsFlipped(false)}>
                Back to info
            </button>
        </div>

    </div>
    );
}