import { useState } from 'react';
import './index.css';

export default function Infobox() {
    const [isOpen, setIsOpen] = useState(false);

    const infoBlocks = [
        `Every anime is rated in two main areas: "Objective" and "Subjective," which both contribute 50% to the final score. Of course, a truly objective rating is impossible, but it serves as a baseline. These two main areas are divided into four mid-layer categories, which are then broken down into specific sub-criteria.`,
        
        `Each sub-criterion is rated independently on a simple 1-10 scale. If a sub-criterion does not apply to a specific anime (like an "Antagonist" in a wholesome rom-com), a value of 0 or null is automatically ignored by the calculation, ensuring it does not unfairly drag down the overall score.`,
        
        `The system uses a Weighted RMS (Root Mean Square) calculation behind the scenes. This naturally rewards true excellence while heavily penalizing severe flaws. Finally, a dynamic range stretch factor is applied to ensure the final score utilizes the full 1-10 scale without clustering everything in a boring middle ground.`
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
                            <strong>Quick Navigation Guide:</strong> Expand the anime cards to see the detailed scores, and click "Read review" to read my actual thoughts. Use the sort menu at the top to filter the grid however you like. Clicking the blue ID numbers will take you straight to the MAL entry of that specific anime. 
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