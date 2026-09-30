import { useState } from 'react';

export default function SortMenu({ onSort, meanScore, areAllExpanded, onToggleGlobal, config }) {
    const [layers, setLayers] = useState(['id', 'all', 'all']);
    const [isAscending, setIsAscending] = useState(true);

    const handleDirectionToggle = () => {
        const neueRichtung = !isAscending;
        setIsAscending(neueRichtung);
        onSort(layers, neueRichtung);
    };

    const handleLayer1 = (e) => {
        const sortValue = e.target.value;
        const newLayers = [sortValue, 'all', 'all'];
        setLayers(newLayers);
        onSort(newLayers, isAscending);
    };

    const handleLayer2 = (e) => {
        const sortValue = e.target.value;
        const newLayers = [layers[0], sortValue, 'all'];
        setLayers(newLayers);
        onSort(newLayers, isAscending);
    };

    const handleLayer3 = (e) => {
        const sortValue = e.target.value;
        const newLayers = [layers[0], layers[1], sortValue];
        setLayers(newLayers);
        onSort(newLayers, isAscending);
    };

    return (
        <div className="sort-menu">
            
            <label>Sort:</label>
            
            <button onClick={handleDirectionToggle} className="direction-toggle">
                {isAscending ?  '▼' : '▲'} {isAscending ? 'Desc' : 'Asc'}
            </button>

            <select value={layers[0]} onChange={handleLayer1}>
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

            {(layers[0] === 'objective' || layers[0] === 'subjective') && (
                <select value={layers[1]} onChange={handleLayer2} style={{ marginLeft: '10px' }}>
                    <option value="all">Full {layers[0]} score</option>
                    {Object.keys(config[layers[0]]).map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                    ))}
                </select>
            )}

            {layers[1] !== 'all' && (layers[0] === 'objective' || layers[0] === 'subjective') && (
                <select value={layers[2]} onChange={handleLayer3} style={{ marginLeft: '10px' }}>
                    <option value="all">Full {layers[1]} score</option>
                    {config[layers[0]][layers[1]].criteria.map((criteria) => (
                        <option key={criteria} value={criteria}>{criteria}</option>
                    ))}
                </select>
            )}

            <div className="Sortmenu-right-div">
                <button className="direction-toggle" onClick={onToggleGlobal}>
                    {areAllExpanded ? 'Collapse All ▲' : 'Expand All ▼'}
                </button>


                <div className="mean-score-box">
                    <span className="label">Mean Score:</span>
                    <span className="value">{meanScore}</span>
                </div>
            </div>
        </div>
    );
}