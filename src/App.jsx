import { useState, useMemo } from 'react';
import { sortAnimes } from './utils/sortUtils';
import { getScore } from './utils/scoreUtils';
import ratingData from './rating.json';
import './index.css';

import Header from './Header';
import Infobox from './Infobox';
import SortMenu from './SortMenu';
import AnimeCard from './AnimeCard';
import BackToTop from './BackToTop';

export default function App() {
    const [animes, setAnimes] = useState(ratingData.animes);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [expandedCards, setExpandedCards] = useState({});
    const [activeSort, setActiveSort] = useState(['id']);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const handleToggleIndividual = (animeId) => {
        setExpandedCards(prev => ({
            ...prev,
            [animeId]: !prev[animeId]
        }));
    };

    const areAllExpanded = useMemo(() => {
        if (animes.length === 0) return false;
        return animes.every(anime => expandedCards[anime.id] === true);
    }, [animes, expandedCards]);


    const handleToggleGlobal = () => {
        if (areAllExpanded) {
            setExpandedCards({});
        } else {
            const allOpened = {};
            animes.forEach(anime => {
                allOpened[anime.id] = true;
            });
            setExpandedCards(allOpened);
        }
    };

    const handleSort = (layers, isAscending) => {
        setActiveSort(layers);
        setAnimes(sortAnimes(animes, layers, isAscending));
        setExpandedCards({}); 
    };

    const totalScore = animes.reduce((acc, anime) => acc + getScore(anime), 0);
    const meanScore = animes.length > 0 ? (totalScore / animes.length).toFixed(2) : 0;

    return (
        <div className={`theme-wrapper ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="container">
                <Header isDarkMode={isDarkMode} onToggle={toggleTheme} />
                
                <Infobox />
                <SortMenu onSort={handleSort} meanScore={meanScore} areAllExpanded={areAllExpanded} onToggleGlobal={handleToggleGlobal}/>
                
                <main className="anime-grid">
                    {animes.map((anime) => (
                        <AnimeCard 
                            key={anime.id} 
                            anime={anime} 
                            showAdvanced={expandedCards[anime.id] || false} 
                            onToggle={() => handleToggleIndividual(anime.id)}
                            activeSort={activeSort}
                        />
                    ))}
                </main>
                
                <BackToTop />
            </div>
        </div>
    );
}