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
        url: "https://www.crazygames.com/"
    },
    {
        title: "AI Chat Assistant",
        name: "ChatGPT",
        category: "Other",
        url: "https://chat.openai.com/"
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
