import { useState } from 'react';
import './index.css';

export default function Infobox() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleBox = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="infobox-container">
            <button onClick={toggleBox} className="info-btn">
                {isOpen ? 'Info schließen' : 'Info'}
            </button>

            {isOpen && (
                <div className="infobox-content">
                    <h2>Welcome to my own Anime Rating Website!</h2>
                    
                    <p>
                        Here I rate all the Animes I've watched based on some criterias I came up on my own.
                    </p>
                </div>
            )}
        </div>
    );
}