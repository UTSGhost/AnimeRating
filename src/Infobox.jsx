import { useState } from 'react';
import './index.css';

export default function Infobox() {
    const [isOpen, setIsOpen] = useState(false);

    const infoBlocks = [
        `Every anime is rated in two main areas: "Objective" and "Subjective," which both contribute 50% to the final score. Of course, a truly objective rating is impossible—especially for things like sound and music—but it serves as a baseline. These two main parts are divided into four mid-layer categories (two worth up to 15 points, two up to 10 points), which are then broken down into specific sub-criteria.`,
        
        `These sub-criteria share a point pool. For example, if an anime gets a 10 in "Animation," it might have to get a 0 in "Character Design" just so the overarching "Art" category doesn't exceed its 10-point limit. Since an "average" sub-criteria score is 2, a completely average anime would end up with an overall rating of 6.5—which feels a bit too high. To balance this, some criteria naturally score lower or don't apply at all (like an "Antagonist" in a wholesome rom-com).`,
        
        `I also use a flexible bonus/penalty system. I can give a category up to 2 points more or less than the strict max/min limits. This lets me reward an anime that absolutely excels in one specific area—or punish it for being outright trash. If "Animation" eats up the whole 10-point budget, I can still give "Character Design" 2 bonus points so it doesn't get completely ignored. This prevents shows from dominating the overall score just by having god-tier art, while keeping the ratings fair.`
    ];

    const handleDiscordClick = () => {
        navigator.clipboard.writeText("UTSGhost");
        alert("Discord-Name 'UTSGhost' wurde in die Zwischenablage kopiert!");
    };

    return (
        <div className="infobox-container">
            <button onClick={() => setIsOpen(!isOpen)} className="info-btn" title="Informationen">
                i
            </button>

            {isOpen && (
                <div className="infobox-overlay" onClick={() => setIsOpen(false)}>
                    <div className="infobox-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Welcome to my own Anime Rating Website!</h2>

                        {infoBlocks.map((text, index) => (
                            <p key={index} className="info-paragraph">
                                {text}
                            </p>
                        ))}

                        <p className="info-paragraph">
                            <strong>Quick Navigation Guide:</strong> Expand the anime cards to see the detailed scores, and click "Review lesen" to read my actual thoughts. Use the sort menu at the top to filter the grid however you like. Clicking the main title on the top left takes you to my MyAnimeList profile, while the <a target="_blank" href="https://www.colorhexa.com/a9b6ff">blue</a> ID numbers will take you straight to the MAL entry of that specific anime. 
                        </p>

                        <p className="info-paragraph">
                            To close this box... just click outside of it. For suggestions, discussions, or anything else, feel free to add me on Discord: 
                            <a 
                                onClick={handleDiscordClick} 
                                style={{cursor: 'pointer', color: 'var(--accent-color)', marginLeft: '5px'}}
                                title="Klicken zum Kopieren"
                            >
                                UTSGhost
                            </a>.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}