// API base URL - uses absolute URL for external embedding support
const API_BASE = 'https://github-contribution-graph.netlify.app';

async function fetchData(ghLogin) {
    try {
        const response = await fetch(`${API_BASE}/api/ghcg/fetch-data?login=${ghLogin}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.user;
    } catch (error) {
        console.error('Failed to fetch GitHub data:', error);
        return null;
    }
}

function init_table() {
    let table = document.createElement("table"); table.className = "ghCalendarTable";
    let thead = table.createTHead();
    let tbody = table.createTBody();
    let row = thead.insertRow();
    cell = row.insertCell();
    cell.style.width = "28px";
    for (let i = 0; i < 7; i++) {
        const row = tbody.insertRow();
        const cell = row.insertCell();
        switch (i) {
            case 1: cell.innerHTML = '<span class="ghCalendarLabel">Mon</span>'; break;
            case 3: cell.innerHTML = '<span class="ghCalendarLabel">Wed</span>'; break;
            case 5: cell.innerHTML = '<span class="ghCalendarLabel">Fri</span>'; break;
        };
    };
    return [table, thead, tbody];
};

function addMonths(thead, months) {
    for (let i = 0; i < months.length - 1; i++) {
        const total_weeks = months[i]["totalWeeks"];
        if (total_weeks => 2) {
            let cell = thead.rows[0].insertCell();
            let label = document.createElement("span");
            label.textContent = months[i]["name"];
            label.className = "ghCalendarLabel";
            cell.appendChild(label);
            cell.colSpan = months[i]["totalWeeks"];
        };
    };
};

function addWeeks(tbody, weeks, colors) {
    for (let i = 0; i < weeks.length; i++) {
        const days = weeks[i]["contributionDays"];
        for (let j = 0; j < days.length; j++) {
            const day = days[j]
            const data = document.createElement("span");
            date = new Date(day["date"]);
            data.textContent = `${day["contributionCount"]} contributions on ${date.toDateString()}`;
            const cell = tbody.rows[day["weekday"]].insertCell();
            cell.appendChild(data);
            cell.className = "ghCalendarDayCell";
            cell.dataset.date = day["date"];
            cell.dataset.count = day["contributionCount"];
            cell.dataset.level = day["contributionLevel"]
        }
    };
};

function init_card() {
    const card = document.createElement("div");
    card.className = "ghCalendarCard";
    return card;
}

function init_card_footer() {
    const footer = document.createElement("div");
    const colors = document.createElement("div");
    footer.className = "ghCalendarCardFooter";
    colors.className = "ghCalendarCardFooterColors";
    let less = document.createElement("span");
    less.textContent = "Less";
    let more = document.createElement("span");
    more.textContent = "More";
    colors.appendChild(less);
    let levels = ["NONE", "FIRST_QUARTILE", "SECOND_QUARTILE", "THIRD_QUARTILE", "FOURTH_QUARTILE"]
    for (let i = 0; i < 5; i++) {
        let cell = document.createElement("div");
        cell.className = "ghCalendarDayCell";
        cell.dataset.level = levels[i];
        colors.appendChild(cell);
    };
    colors.appendChild(more);
    footer.appendChild(colors);
    return footer
}

function init_canvas() {
    const canvas = document.createElement("div");
    canvas.className = "ghCalendarCanvas";
    return canvas;
}

function init_header(total_contribs, ghLogin, avatarUrl) {
    const header = document.createElement("div");
    const total = document.createElement("span");
    const profile = document.createElement("div");
    profile.innerHTML = `<a href="https://github.com/${ghLogin}">${ghLogin}</a><img src="${avatarUrl}">`
    header.className = "ghCalendarHeader";
    total.textContent = `${total_contribs} contributions in the last year`;
    header.appendChild(total);
    header.appendChild(profile);
    return header
}

function init_thumbnail() {
    const thumbnail = document.createElement("div");
    const thumbNailLink = document.createElement("a");
    
    // Create SVG element for GitHub Logo
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 98 96");
    svg.setAttribute("width", "30"); 
    svg.setAttribute("height", "30");
    svg.style.marginTop = "15px";
    svg.style.opacity = "0.6";
    // Use the text color variable for the logo so it matches the theme
    svg.style.fill = "var(--gh-text-default-color, #333)";

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill-rule", "evenodd");
    path.setAttribute("clip-rule", "evenodd");
    path.setAttribute("d", "M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z");
    
    svg.appendChild(path);

    thumbnail.className = "ghThumbNail";
    thumbNailLink.href = "https://github.com/iamjr15/github-contribution-graph";
    thumbNailLink.target = "_blank"; // Good practice to open link in new tab
    
    thumbNailLink.appendChild(svg);
    thumbnail.appendChild(thumbNailLink);
    return thumbnail
}

async function renderGitHubWidget() {
    const container = document.getElementById("gh");
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    const ghLogin = container.dataset.login;
    if (!ghLogin) {
        console.error('GitHub login not specified. Add data-login attribute.');
        return;
    }

    const data = await fetchData(ghLogin);
    if (!data) {
        container.innerHTML = '<p style="color: #f85149;">Failed to load contribution data.</p>';
        return;
    }

    const calendar = data.contributionsCollection.contributionCalendar;
    const [table, thead, tbody] = init_table();
    const card = init_card();
    const canvas = init_canvas();
    const header = init_header(calendar.totalContributions, ghLogin, data.avatarUrl);
    const footer = init_card_footer();
    const thumbnail = init_thumbnail();

    addWeeks(tbody, calendar.weeks, calendar.colors);
    addMonths(thead, calendar.months);
    canvas.appendChild(table);
    canvas.appendChild(footer);
    card.appendChild(canvas);
    container.appendChild(header);
    container.appendChild(card);
    container.appendChild(thumbnail);
}

window.renderGitHubWidget = renderGitHubWidget;
renderGitHubWidget();
