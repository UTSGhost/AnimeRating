import { useState } from 'react';
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

    const handleSort = (ausgewaehlteEbenen, isAscending) => {
        let sortierteListe = [...animes];
        
        const e1 = ausgewaehlteEbenen[0];
        const e2 = ausgewaehlteEbenen[1];
        const e3 = ausgewaehlteEbenen[2];

        if (e1 === 'id') {
            sortierteListe.sort((a, b) => isAscending ? a.id - b.id : b.id - a.id);
        } 
        else if (e1 === 'title') {
            sortierteListe.sort((a, b) => isAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
        }
        else if (e1 === 'alt_name') {
            sortierteListe.sort((a, b) => isAscending ? a.alt_name.localeCompare(b.alt_name) : b.alt_name.localeCompare(a.alt_name));
        }
        else if (e1 === 'season') {
            sortierteListe.sort((a, b) => isAscending ? a.season.localeCompare(b.season) : b.season.localeCompare(a.season));
        }
        else if (e1 === 'type') {
            sortierteListe.sort((a, b) => isAscending ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type));
        }
        else if (e1 === 'review_length') {
            sortierteListe.sort((a, b) => {
                const lenA = a.rating.explain.length;
                const lenB = b.rating.explain.length;
                return isAscending ? lenA - lenB : lenB - lenA;
            });
        }
        else if (e1 === 'mal_rating') {
            sortierteListe.sort((a, b) => {
                let scoreA = 0;
                let scoreB = 0;
                Object.values(a.rating.objective).forEach(sub => scoreA += Object.values(sub).reduce((s, w) => s + w, 0));
                Object.values(a.rating.subjective).forEach(sub => scoreA += Object.values(sub).reduce((s, w) => s + w, 0));
                
                Object.values(b.rating.objective).forEach(sub => scoreB += Object.values(sub).reduce((s, w) => s + w, 0));
                Object.values(b.rating.subjective).forEach(sub => scoreB += Object.values(sub).reduce((s, w) => s + w, 0));
                
                return isAscending ? scoreA - scoreB : scoreB - scoreA;
            });
        }
        else if (e1 === 'objective' || e1 === 'subjective') {
            sortierteListe.sort((a, b) => {
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

        setAnimes(sortierteListe);
    };

    const getScore = (anime) => {
        let total = 0;

        Object.values(anime.rating.objective).forEach(sub => {
            if (typeof sub === 'object') {
                total += Object.values(sub).reduce((s, w) => s + w, 0);
            }
        });

        Object.values(anime.rating.subjective).forEach(sub => {
            if (typeof sub === 'object') {
                total += Object.values(sub).reduce((s, w) => s + w, 0);
            }
        });

        return total / 10;
    };

    const totalScore = animes.reduce((acc, anime) => acc + getScore(anime), 0);
    const meanScore = animes.length > 0 ? (totalScore / animes.length).toFixed(2) : 0;

    return (
        <div className={`theme-wrapper ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="container">
                <Header isDarkMode={isDarkMode} onToggle={toggleTheme} />
                
                <p>Mean Score: {meanScore}</p>
                
                <Infobox />
                <SortMenu onSort={handleSort} />
                
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