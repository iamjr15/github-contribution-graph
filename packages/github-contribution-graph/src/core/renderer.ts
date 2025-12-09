import { CONTRIBUTION_LEVELS, DAY_LABELS, REPO_URL } from './constants';
import type {
  ContributionMonth,
  ContributionWeek,
  GitHubUser,
  RenderOptions,
} from './types';

/**
 * Create the base table structure for the contribution calendar
 */
export function createTable(): {
  table: HTMLTableElement;
  thead: HTMLTableSectionElement;
  tbody: HTMLTableSectionElement;
} {
  const table = document.createElement('table');
  table.className = 'ghCalendarTable';

  const thead = table.createTHead();
  const tbody = table.createTBody();

  const headerRow = thead.insertRow();
  const firstCell = headerRow.insertCell();
  firstCell.style.width = '28px';

  for (let i = 0; i < 7; i++) {
    const row = tbody.insertRow();
    const cell = row.insertCell();
    if (DAY_LABELS[i]) {
      cell.innerHTML = `<span class="ghCalendarLabel">${DAY_LABELS[i]}</span>`;
    }
  }

  return { table, thead, tbody };
}

/**
 * Add month labels to the table header
 */
export function addMonths(
  thead: HTMLTableSectionElement,
  months: ContributionMonth[]
): void {
  for (let i = 0; i < months.length - 1; i++) {
    const totalWeeks = months[i].totalWeeks;
    // Bug fix: was `=>` instead of `>=`
    if (totalWeeks >= 2) {
      const cell = thead.rows[0].insertCell();
      const label = document.createElement('span');
      label.textContent = months[i].name;
      label.className = 'ghCalendarLabel';
      cell.appendChild(label);
      cell.colSpan = totalWeeks;
    }
  }
}

/**
 * Add contribution days to the table body
 */
export function addWeeks(
  tbody: HTMLTableSectionElement,
  weeks: ContributionWeek[]
): void {
  for (const week of weeks) {
    for (const day of week.contributionDays) {
      const data = document.createElement('span');
      // Bug fix: added `const` declaration
      const date = new Date(day.date);
      data.textContent = `${day.contributionCount} contributions on ${date.toDateString()}`;

      const cell = tbody.rows[day.weekday].insertCell();
      cell.appendChild(data);
      cell.className = 'ghCalendarDayCell';
      cell.dataset.date = day.date;
      cell.dataset.count = String(day.contributionCount);
      cell.dataset.level = day.contributionLevel;
    }
  }
}

/**
 * Create the card container
 */
export function createCard(): HTMLDivElement {
  const card = document.createElement('div');
  card.className = 'ghCalendarCard';
  return card;
}

/**
 * Create the canvas wrapper for table and footer
 */
export function createCanvas(): HTMLDivElement {
  const canvas = document.createElement('div');
  canvas.className = 'ghCalendarCanvas';
  return canvas;
}

/**
 * Create the header with total contributions and user profile
 */
export function createHeader(
  totalContributions: number,
  username: string,
  avatarUrl: string
): HTMLDivElement {
  const header = document.createElement('div');
  header.className = 'ghCalendarHeader';

  const total = document.createElement('span');
  total.textContent = `${totalContributions} contributions in the last year`;

  const profile = document.createElement('div');
  profile.innerHTML = `<a href="https://github.com/${username}">${username}</a><img src="${avatarUrl}" alt="${username}'s avatar">`;

  header.appendChild(total);
  header.appendChild(profile);

  return header;
}

/**
 * Create the footer with contribution level legend
 */
export function createFooter(): HTMLDivElement {
  const footer = document.createElement('div');
  footer.className = 'ghCalendarCardFooter';

  const colors = document.createElement('div');
  colors.className = 'ghCalendarCardFooterColors';

  const less = document.createElement('span');
  less.textContent = 'Less';

  const more = document.createElement('span');
  more.textContent = 'More';

  colors.appendChild(less);

  for (const level of CONTRIBUTION_LEVELS) {
    const cell = document.createElement('div');
    cell.className = 'ghCalendarDayCell';
    cell.dataset.level = level;
    colors.appendChild(cell);
  }

  colors.appendChild(more);
  footer.appendChild(colors);

  return footer;
}

/**
 * Create the thumbnail/attribution link
 */
export function createThumbnail(): HTMLDivElement {
  const thumbnail = document.createElement('div');
  thumbnail.className = 'ghThumbNail';

  const link = document.createElement('a');
  link.href = REPO_URL;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  // GitHub logo SVG
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 98 96');
  svg.setAttribute('width', '18');
  svg.setAttribute('height', '18');
  svg.style.marginTop = '10px';
  svg.style.opacity = '0.5';
  svg.style.fill = 'var(--gh-text-default-color, #333)';

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('fill-rule', 'evenodd');
  path.setAttribute('clip-rule', 'evenodd');
  path.setAttribute(
    'd',
    'M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z'
  );

  svg.appendChild(path);
  link.appendChild(svg);
  thumbnail.appendChild(link);

  return thumbnail;
}

/**
 * Render the complete widget into a container
 */
export function renderWidget(
  container: HTMLElement,
  user: GitHubUser,
  username: string,
  options: RenderOptions = {}
): void {
  const { showHeader = true, showFooter = true, showThumbnail = true } = options;

  // Clear existing content
  container.innerHTML = '';

  const calendar = user.contributionsCollection.contributionCalendar;
  const { table, thead, tbody } = createTable();

  addWeeks(tbody, calendar.weeks);
  addMonths(thead, calendar.months);

  const card = createCard();
  const canvas = createCanvas();

  canvas.appendChild(table);

  if (showFooter) {
    const footer = createFooter();
    canvas.appendChild(footer);
  }

  card.appendChild(canvas);

  if (showHeader) {
    const header = createHeader(calendar.totalContributions, username, user.avatarUrl);
    container.appendChild(header);
  }

  container.appendChild(card);

  if (showThumbnail) {
    const thumbnail = createThumbnail();
    container.appendChild(thumbnail);
  }
}
