import { useState } from 'react';
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

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const handleSort = (layers, isAscending) => {
        setAnimes(sortAnimes(animes,layers,isAscending));
    };

    const totalScore = animes.reduce((acc, anime) => acc + getScore(anime), 0);
    const meanScore = animes.length > 0 ? (totalScore / animes.length).toFixed(2) : 0;

    return (
        <div className={`theme-wrapper ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="container">
                <Header isDarkMode={isDarkMode} onToggle={toggleTheme} />
                
                <Infobox />
                <SortMenu onSort={handleSort} meanScore={meanScore} />
                
                <main className="anime-grid">
                    {animes.map((anime) => (
                        <AnimeCard key={anime.id} anime={anime} />
                    ))}
                </main>
                
                <BackToTop />
            </div>
        </div>
    );
}