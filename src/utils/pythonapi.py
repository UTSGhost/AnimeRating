import json
import os
import tkinter as tk
from tkinter import messagebox
from jikanpy import Jikan

# Resolve path to rating.json in the parent directory (assuming script is in /utils)
script_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(script_dir)
existing_json_file = os.path.join(parent_dir, 'rating.json')

print(f"Script Location: {script_dir}")
print(f"JSON Target: {existing_json_file}")

def get_anime_data(anime_id):
    jikan = Jikan()
    
    # Handle API fetch errors
    try:
        anime_data = jikan.anime(anime_id)
    except Exception as e:
        messagebox.showerror("API Error", f"Failed to fetch ID {anime_id}.\nError: {e}")
        return None

    data = anime_data.get('data', {})
    
    # Extract data with fallbacks
    img = data.get('images', {}).get('jpg', {}).get('image_url', 'Image Not Found')
    name = data.get('title', 'Title Not Found')
    alt_name = data.get('title_english') # Can be None
    mal_id = data.get('mal_id', anime_id)
    season = data.get('season')
    year = data.get('year')
    anime_type = data.get('type', 'Type Not Found')

    # Format season string
    if alt_name is None:
        alt_name = name
    
    season_str = 'Season Not Found'
    if season and year:
        season_str = f"{season.capitalize()} {year}"
    elif year:
        season_str = f"{year}"

    print(f"Fetched: {name} ({season_str})")

    # Define target JSON structure
    anime_dict = {
        "img": img,
        "name": name,
        "alt_name": alt_name,
        "id": mal_id,
        "season": season_str,
        "type": anime_type,
        "rating": {
            "objective": {
                "Characters": {
                    "Protagonist": 0, "Antagonist": 0, "Side Characters": 0, "Realistic": 0
                },
                "Writing": {
                    "Ending": 0, "Logical": 0, "Plot": 0
                },
                "Sound": {
                    "OST/BGM": 0, "Voiceacting": 0, "OP/ED": 0, "SFX": 0
                },
                "Animation": {
                    "Animation": 0, "Character Design": 0, "Worldbuilding": 0
                }
            },
            "subjective": {
                "Emotions": {
                    "Strong emotions": 0, "Vibe": 0, "Climax": 0
                },
                "Story": {
                    "Satisfying Ending": 0, "No unnecessary scenes": 0, "Enjoyable Content": 0
                },
                "Characters": {
                    "Likeable": 0, "Waifus": 0, "Relationships": 0
                },
                "Memory": {
                    "Aftertaste": 0, "Addictiveness": 0, "Nostalgia": 0
                }
            },
            "explain": "No review written yet"
        }
    }

    return anime_dict

def add_anime():
    user_input = entry_anime_id.get()
    if not user_input.isdigit():
        messagebox.showwarning("Input Error", "Please enter a valid number.")
        return

    anime_id_to_add = int(user_input)
    
    # Disable button during fetch to prevent duplicate requests
    btn_add_anime.config(state="disabled", text="Loading...")
    window.update()

    new_anime_data = get_anime_data(anime_id_to_add)
    
    # Re-enable button
    btn_add_anime.config(state="normal", text="Add Anime")
    
    if new_anime_data is None:
        return 

    # Read existing JSON data
    if os.path.exists(existing_json_file):
        with open(existing_json_file, 'r', encoding='utf-8') as file:
            try:
                existing_data = json.load(file)
                # Normalize structure if the root is a list
                if isinstance(existing_data, list):
                    existing_data = {"animes": existing_data}
            except json.JSONDecodeError:
                existing_data = {"animes": []}
    else:
        existing_data = {"animes": []}
    
    existing_anime_index = next((index for index, anime in enumerate(existing_data['animes']) if anime['id'] == new_anime_data['id']), None)
    
    if existing_anime_index is not None:
        current_entry = existing_data['animes'][existing_anime_index]
        if 'alt_name' not in current_entry or not current_entry['alt_name']:
            # Preserve existing ratings, update metadata
            new_anime_data['rating'] = current_entry.get('rating', new_anime_data['rating'])
            existing_data['animes'][existing_anime_index] = new_anime_data
            feedback_message = f"Updated metadata for ID {new_anime_data['id']}."
        else:
            feedback_message = f"Anime ID {new_anime_data['id']} already exists. No changes made."
    else:
        existing_data['animes'].append(new_anime_data)
        feedback_message = f"Added new anime: {new_anime_data['name']}"
    
    # Sort array by ID
    existing_data['animes'] = sorted(existing_data['animes'], key=lambda x: x['id'])
    
    # Write updated data to JSON
    with open(existing_json_file, 'w', encoding='utf-8') as file:
        json.dump(existing_data, file, indent=2, ensure_ascii=False) 
    
    print(feedback_message)
    messagebox.showinfo("Success", feedback_message)

# GUI Setup
window = tk.Tk()
window.title("Anime Adder Tool")
window.configure(background='#353535')

font_style = ('Nunito', 12)

frame = tk.Frame(window, bg='#353535')
frame.pack(padx=20, pady=20)

label_anime_id = tk.Label(frame, text="Enter MAL ID:", font=font_style, fg='#D3D3D3', bg='#353535')
label_anime_id.grid(row=0, column=0, padx=5, pady=5, sticky='w')

entry_anime_id = tk.Entry(frame, font=font_style, bg='#353535', fg='#D3D3D3')
entry_anime_id.grid(row=0, column=1, padx=5, pady=5)
entry_anime_id.bind('<Return>', lambda event: add_anime())

btn_add_anime = tk.Button(frame, text="Add Anime", command=add_anime, font=font_style, bg='#202020', fg='#D3D3D3', width=15)
btn_add_anime.grid(row=1, column=0, columnspan=2, padx=5, pady=15)

window.update_idletasks()
width = window.winfo_width()
height = window.winfo_height()
x = (window.winfo_screenwidth() // 2) - (width // 2)
y = (window.winfo_screenheight() // 2) - (height // 2)
window.geometry('{}x{}+{}+{}'.format(width, height, x, y))

window.mainloop()