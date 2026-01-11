const toolsData = [
    {
        title: "Convert Files to PDF",
        name: "I Love PDF",
        category: "Tool",
        url: "https://www.ilovepdf.com/",
        description: "Quickly convert Word, Excel, Images and more into PDF files."
    },
    {
        title: "Learn Web Development",
        name: "w3schools",
        category: "Study",
        url: "https://www.w3schools.com/",
        description: "Free tutorials and projects to learn HTML, CSS, JavaScript and more."
    },
    {
        title: "Play Online Games",
        name: "Crazy Games",
        category: "Game",
        url: "https://www.crazygames.com/",
        description: "Play free online games directly in your browser."
    },
    {
        title: "AI Chat Assistant",
        name: "ChatGPT",
        category: "Other",
        url: "https://chat.openai.com/",
        description: "Chat with an AI assistant to get answers and ideas instantly."
    },
    {
        title: "Learn Piano",
        name: "Flowkey",
        category: "Study",
        url: "https://app.flowkey.com/",
        description: "Learn piano with interactive lessons and tutorials."
    },
    {
        title: "Fix & Repair Guides",
        name: "iFixit",
        category: "Study",
        url: "https://www.ifixit.com/",
        description: "Free guides and tools to repair electronics and gadgets yourself."
    },
    {
        title: "Learn Languages",
        name: "Duolingo",
        category: "Study",
        url: "https://www.duolingo.com/",
        description: "Learn languages with fun, gamified lessons online."
    },
    {
        title: "File Converter",
        name: "AllToAll",
        category: "Tool",
        url: "https://www.alltoall.net/",
        description: "Convert files between many formats online."
    },
    {
        title: "A grid-based online type tool",
        name: "Grid Type",
        category: "Tool",
        url: "https://www.grid-type.com/",
        description: "You can generate different types of grids with it, draw your letters within these grids and download them as a font file."
    },
    {
        title: "AI Signature",
        name: "Calligrapher AI",
        category: "Tool",
        url: "https://www.calligrapher.ai/",
        description: "Generate realistic handwritten signature with AI."
    },
    {
        title: "Design Tool(Online PS)",
        name: "Gaoding PS",
        category: "Tool",
        url: "https://ps.gaoding.com/#/",
        description: "Online photo editing and design tools."
    },
    {
        title: "Background Eraser",
        name: "Magic Eraser",
        category: "Tool",
        url: "https://magicstudio.com/zh/magiceraser/",
        description: "Remove unwanted objects from images with AI."
    },
    {
        title: "Productivity Helper",
        name: "Goblin Tools",
        category: "Tool",
        url: "https://goblin.tools/",
        description: "Simple tools to break down tasks and think clearly."
    },
    {
        title: "Color Reference",
        name: "Encycolorpedia",
        category: "Tool",
        url: "https://encycolorpedia.com/named",
        description: "Explore named colors and color information."
    },
    {
        title: "Software Resources",
        name: "Adobe Resources",
        category: "Other",
        url: "http://adobe.v404.cn/adobe/",
        description: "Adobe software links and related resources."
    },
    {
        title: "File Converter",
        name: "AConvert",
        category: "Tool",
        url: "https://www.aconvert.com/",
        description: "Convert documents, images, audio, and video files."
    },
    {
        title: "How-To Guides",
        name: "WikiHow",
        category: "Study",
        url: "https://www.wikihow.com/Main-Page",
        description: "Step-by-step guides for everyday tasks."
    },
    {
        title: "Skill Testing",
        name: "Human Benchmark",
        category: "Other",
        url: "https://humanbenchmark.com/",
        description: "Test your memory, speed, and reaction time."
    },
    {
        title: "Music Discovery",
        name: "Gnoosic",
        category: "Other",
        url: "https://www.gnoosic.com/",
        description: "Discover new music based on your taste."
    },
    {
        title: "Background Remover",
        name: "Remove.bg",
        category: "Tool",
        url: "https://www.remove.bg/",
        description: "Remove image backgrounds automatically with AI."
    },
    {
        title: "AI Art Generator",
        name: "Artbreeder",
        category: "Tool",
        url: "https://www.artbreeder.com/",
        description: "Create and remix images using AI."
    },
    {
        title: "Weather Map",
        name: "Windy",
        category: "Tool",
        url: "https://www.windy.com/",
        description: "Advanced weather forecasts and live wind maps."
    },
    {
        title: "Website Builder",
        name: "Wix",
        category: "Tool",
        url: "https://www.wix.com/",
        description: "Build and customize websites without coding."
    },
    {
        title: "Time Zone Tool",
        name: "Every Time Zone",
        category: "Tool",
        url: "https://everytimezone.com/",
        description: "Visualize and compare time zones easily."
    },
    {
        title: "Presentation Templates (PPT)",
        name: "Slidesgo",
        category: "Tool",
        url: "https://slidesgo.com/",
        description: "Free presentation templates for slides."
    },
    {
        title: "Music in Movies & TV & Games",
        name: "TuneFind",
        category: "Other",
        url: "https://www.tunefind.com/",
        description: "Find songs used in TV shows, movies and games."
    },
    {
        title: "Mouse Tester",
        name: "Polling Rate Check",
        category: "Tool",
        url: "https://cps-check.com/cn/polling-rate-check",
        description: "Check mouse polling rate and performance."
    },
    {
        title: "Map Generator",
        name: "Watabou",
        category: "Tool",
        url: "https://watabou.github.io/",
        description: "Generate fantasy maps and worlds."
    },
    {
        title: "Time Visualization",
        name: "Every Second",
        category: "Other",
        url: "https://everysecond.io/",
        description: "Visualize data and events over time."
    },
    {
        title: "Design Tool",
        name: "Chuangkit",
        category: "Tool",
        url: "https://www.chuangkit.com/",
        description: "Online graphic design and poster maker."
    },
    {
        title: "Video Background Remover",
        name: "Unscreen",
        category: "Tool",
        url: "https://www.unscreen.com/",
        description: "Remove video backgrounds automatically."
    },
    {
        title: "App Icon Generator",
        name: "AppIcons",
        category: "Tool",
        url: "https://appicons.co/",
        description: "Generate app icons for multiple platforms."
    },
    {
        title: "Name Meanings",
        name: "Behind the Name",
        category: "Other",
        url: "https://www.behindthename.com/",
        description: "Explore name origins and meanings."
    },
    {
        title: "Writing Assistant (AI)",
        name: "Grammarly",
        category: "Tool",
        url: "https://www.grammarly.com/",
        description: "Improve writing with grammar and style checks."
    },
    {
        title: "3D Models",
        name: "Thingiverse",
        category: "Other",
        url: "https://www.thingiverse.com/",
        description: "Download and share 3D printable models."
    },
    {
        title: "Shortcut Reference (hotkey)",
        name: "Hotkey Cheat Sheet",
        category: "Tool",
        url: "https://hotkeycheatsheet.com/",
        description: "Keyboard shortcuts for popular software."
    },
    {
        title: "Photo Editor",
        name: "FotoJet",
        category: "Tool",
        url: "https://www.fotojet.com/",
        description: "Create designs, collages, and edits online."
    },
    {
        title: "Art Effects",
        name: "FotoSketcher",
        category: "Tool",
        url: "https://fotosketcher.com/",
        description: "Turn photos into artistic drawings."
    },
    {
        title: "Product Discovery",
        name: "Product Hunt",
        category: "Other",
        url: "https://www.producthunt.com/",
        description: "Discover new tech products and startups."
    },
    {
        title: "Pronunciation Practice",
        name: "SpeechAce",
        category: "Study",
        url: "https://www.speechace.com/",
        description: "Practice and improve English pronunciation."
    },
    {
        title: "Sand Tetris Game",
        name: "Sandtris",
        category: "Game",
        url: "https://sandtris.com/",
        description: "A sand-based twist on classic Tetris."
    },
    {
        title: "Online Tetris Battle",
        name: "Tetr.io",
        category: "Game",
        url: "https://tetr.io/",
        description: "Play a modern online Tetris game solo or against others."
    },
    {
        title: "Game Time Tracker",
        name: "HowLongToBeat",
        category: "Game",
        url: "https://howlongtobeat.com/",
        description: "Check how long it takes to beat games."
    },
    {
        title: "Dictionary",
        name: "Merriam-Webster",
        category: "Study",
        url: "https://www.merriam-webster.com/",
        description: "Definitions, meanings, and word usage."
    },
    {
        title: "Online Music Games (chinese)",
        name: "Beatstage",
        category: "Game",
        url: "https://www.beatstage.com/",
        description: "Learn rhythm and timing through music."
    },
    {
        title: "Guessing Game (PIN)",
        name: "Guess The Pin",
        category: "Game",
        url: "https://www.guessthepin.com/",
        description: "Guess the pin (four-digit PIN)."
    },
    {
        title: "Match-3 battle",
        name: "Guivo",
        category: "Game",
        url: "https://guivo.io/",
        description: "A skill-based Match-3 battle arena where players worldwide compete in real-time."
    },
    {
        title: "Online Chess",
        name: "Chess.com",
        category: "Game",
        url: "https://www.chess.com/",
        description: "Play chess online and improve your skills."
    },
    {
        title: "Real or Photoshop",
        name: "Adobe Challenge",
        category: "Game",
        url: "https://landing.adobe.com/en/na/products/creative-cloud/69308-real-or-photoshop/index.html",
        description: "Guess whether images are real or edited."
    },
    {
        title: "Online Mahjong (Chinese)",
        name: "Mahjong Soul",
        category: "Game",
        url: "https://www.maj-soul.com/#/home",
        description: "Play anime-style Japanese mahjong online."
    },
    {
        title: "Typing Race",
        name: "TypeRacer",
        category: "Game",
        url: "https://play.typeracer.com/",
        description: "Race others by typing text quickly."
    },
    {
        title: "Muscle Guide",
        name: "MuscleWiki",
        category: "Study",
        url: "https://musclewiki.com/",
        description: "Learn muscle anatomy and exercises."
    },
    {
        title: "Online Courses",
        name: "Coursera",
        category: "Study",
        url: "https://www.coursera.org/",
        description: "Learn skills with online courses."
    },
    {
        title: "Language Learning",
        name: "Language Player",
        category: "Study",
        url: "https://languageplayer.io/",
        description: "Learn languages through video content."
    },
    {
        title: "Pronunciation Audio",
        name: "Forvo",
        category: "Study",
        url: "https://forvo.com/",
        description: "Hear native pronunciation of words."
    },
    {
        title: "Lens Simulator",
        name: "Samyang Lens Simulator",
        category: "Study",
        url: "https://www.lksamyang.com/en/product/simulator/lens.php",
        description: "Simulate camera lenses and focal lengths."
    }
];

const toolsWrapper = document.getElementById("toolsWrapper");
const tabs = document.querySelectorAll(".tab");

function renderTools(category = "all") {
    toolsWrapper.innerHTML = "";

    const filtered = category === "all"
        ? toolsData
        : toolsData.filter(tool => tool.category === category);

    filtered.forEach(tool => {
        const card = document.createElement("div");
        card.className = "tool-card";
        card.onclick = () => window.open(tool.url, "_blank");

        card.innerHTML = `
            <div>
                <div class="tool-title">${tool.title}</div>
                <div class="tool-name">${tool.name}</div>
            </div>
            <div class="tool-meta">
                <span class="tool-category">${tool.category}</span>
            </div>
            <div class="tool-description">${tool.description}</div>
        `;

        toolsWrapper.appendChild(card);
    });
}

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        renderTools(tab.dataset.category);
    });
});

renderTools();
