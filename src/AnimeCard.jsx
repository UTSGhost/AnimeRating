import { useState } from 'react';
import { sumValues, round2decimals, getObjectiveScore, getSubjectiveScore, getScore } from './utils/scoreUtils.js';
import { getDynamicHue } from './utils/colorUtils.js';
import DOMPurify from 'dompurify';

export default function AnimeCard({ anime, showAdvanced, onToggle, activeSort, config }) {

    const [isFlipped, setIsFlipped] = useState(false);

    const json_objective_data = anime.rating.objective;
    const json_subjective_data = anime.rating.subjective;

    const totalObjective = round2decimals(getObjectiveScore(anime));
    const totalSubjective = round2decimals(getSubjectiveScore(anime));
    const malRate = getScore(anime);

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
                        ({round2decimals(sumValues(data))}/{config[type][title].max_score})
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

    const dynamicColor = getDynamicHue(malRate);

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