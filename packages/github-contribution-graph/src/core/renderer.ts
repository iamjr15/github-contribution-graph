import { CONTRIBUTION_LEVELS, DAY_LABELS, REPO_URL, ROOT_CLASS } from './constants';
import type {
  ContributionMonth,
  ContributionWeek,
  DayStyle,
  DayRenderContext,
  FooterRenderContext,
  GitHubUser,
  HeaderRenderContext,
  RenderOptions,
  ThumbnailRenderContext,
} from './types';

function mergeClasses(baseClass: string, customClass?: string): string {
  return [baseClass, customClass].filter(Boolean).join(' ');
}

function applyCustomClass(element: HTMLElement | SVGElement, customClass?: string): void {
  if (customClass) {
    element.classList.add(...customClass.split(/\s+/).filter(Boolean));
  }
}

function getDayLabels(options: RenderOptions): string[] {
  return options.dayLabels ?? DAY_LABELS;
}

function formatTooltip(context: DayRenderContext, options: RenderOptions): string {
  if (options.tooltipFormatter) {
    return options.tooltipFormatter(context);
  }

  return `${context.day.contributionCount} contributions on ${context.date.toDateString()}`;
}

function normalizeInlineStyleValue(value: string | number): string {
  return typeof value === 'number' ? `${value}px` : value;
}

function normalizeStyleProperty(property: string): string {
  return property.startsWith('--')
    ? property
    : property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function resolveDayClassName(context: DayRenderContext, options: RenderOptions): string | undefined {
  if (typeof options.dayClassName === 'function') {
    return options.dayClassName(context) || undefined;
  }

  return options.dayClassName;
}

function applyDayStyle(
  cell: HTMLTableCellElement,
  context: DayRenderContext,
  options: RenderOptions
): void {
  const style =
    typeof options.dayStyle === 'function' ? options.dayStyle(context) : options.dayStyle;

  if (!style) return;

  for (const [property, value] of Object.entries(style satisfies DayStyle)) {
    if (value === undefined || value === null || value === '') continue;

    cell.style.setProperty(normalizeStyleProperty(property), normalizeInlineStyleValue(value));
  }
}

function applyDayAttributes(
  cell: HTMLTableCellElement,
  context: DayRenderContext,
  options: RenderOptions
): void {
  const attributes = options.dayAttributes?.(context);
  if (!attributes) return;

  for (const [attribute, value] of Object.entries(attributes)) {
    if (value === undefined || value === null || value === false) continue;
    cell.setAttribute(attribute, value === true ? '' : String(value));
  }
}

function appendDayContents(
  cell: HTMLTableCellElement,
  context: DayRenderContext,
  options: RenderOptions
): void {
  const hasCustomRenderer = typeof options.renderDayContents === 'function';
  const rendered = hasCustomRenderer ? options.renderDayContents?.(context) : undefined;

  if (typeof rendered === 'string') {
    cell.appendChild(document.createTextNode(rendered));
    return;
  }

  if (rendered instanceof Node) {
    cell.appendChild(rendered);
    return;
  }

  if (!hasCustomRenderer && options.showTooltips !== false) {
    const tooltip = document.createElement('span');
    tooltip.className = mergeClasses('ghCalendarTooltip', options.classNames?.tooltip);
    tooltip.textContent = formatTooltip(context, options);
    cell.appendChild(tooltip);
  }
}

/**
 * Create the base table structure for the contribution calendar
 */
export function createTable(options: RenderOptions = {}): {
  table: HTMLTableElement;
  thead: HTMLTableSectionElement;
  tbody: HTMLTableSectionElement;
} {
  const table = document.createElement('table');
  table.className = mergeClasses('ghCalendarTable', options.classNames?.table);

  const thead = table.createTHead();
  const tbody = table.createTBody();

  const headerRow = thead.insertRow();
  const firstCell = headerRow.insertCell();
  firstCell.style.width = '28px';

  const dayLabels = getDayLabels(options);
  const showWeekdayLabels = options.showWeekdayLabels !== false;

  for (let i = 0; i < 7; i++) {
    const row = tbody.insertRow();
    const cell = row.insertCell();
    if (showWeekdayLabels && dayLabels[i]) {
      const label = document.createElement('span');
      label.className = mergeClasses('ghCalendarLabel', options.classNames?.dayLabel);
      label.textContent = dayLabels[i];
      cell.appendChild(label);
    }
  }

  return { table, thead, tbody };
}

/**
 * Add month labels to the table header
 */
export function addMonths(
  thead: HTMLTableSectionElement,
  months: ContributionMonth[],
  options: RenderOptions = {}
): void {
  if (options.showMonthLabels === false) return;

  for (let i = 0; i < months.length - 1; i++) {
    const totalWeeks = months[i].totalWeeks;
    // Bug fix: was `=>` instead of `>=`
    if (totalWeeks >= 2) {
      const cell = thead.rows[0].insertCell();
      const label = document.createElement('span');
      label.textContent = options.monthLabelFormatter
        ? options.monthLabelFormatter(months[i], i, months)
        : months[i].name;
      label.className = mergeClasses('ghCalendarLabel', options.classNames?.monthLabel);
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
  weeks: ContributionWeek[],
  options: RenderOptions = {},
  username = ''
): void {
  for (const [weekIndex, week] of weeks.entries()) {
    for (const [dayIndex, day] of week.contributionDays.entries()) {
      const date = new Date(day.date);
      const context: DayRenderContext = {
        day,
        week,
        weekIndex,
        dayIndex,
        date,
        username,
      };

      const cell = tbody.rows[day.weekday].insertCell();
      cell.className = mergeClasses(
        mergeClasses('ghCalendarDayCell', options.classNames?.dayCell),
        resolveDayClassName(context, options)
      );
      cell.dataset.date = day.date;
      cell.dataset.count = String(day.contributionCount);
      cell.dataset.level = day.contributionLevel;
      cell.dataset.week = String(weekIndex);
      cell.dataset.weekday = String(day.weekday);
      applyDayStyle(cell, context, options);
      applyDayAttributes(cell, context, options);
      appendDayContents(cell, context, options);
    }
  }
}

/**
 * Create the card container
 */
export function createCard(options: RenderOptions = {}): HTMLDivElement {
  const card = document.createElement('div');
  card.className = mergeClasses('ghCalendarCard', options.classNames?.card);
  return card;
}

/**
 * Create the canvas wrapper for table and footer
 */
export function createCanvas(options: RenderOptions = {}): HTMLDivElement {
  const canvas = document.createElement('div');
  canvas.className = mergeClasses('ghCalendarCanvas', options.classNames?.canvas);
  return canvas;
}

/**
 * Create the header with total contributions and user profile
 */
export function createHeader(
  totalContributions: number,
  username: string,
  avatarUrl: string,
  options: RenderOptions = {},
  user?: GitHubUser
): HTMLElement {
  if (options.renderHeader && user) {
    const customHeader = options.renderHeader({
      user,
      username,
      totalContributions,
    } satisfies HeaderRenderContext);

    if (customHeader) return customHeader;
  }

  const header = document.createElement('div');
  header.className = mergeClasses('ghCalendarHeader', options.classNames?.header);

  const total = document.createElement('span');
  applyCustomClass(total, options.classNames?.total);
  total.textContent = `${totalContributions} contributions in the last year`;

  const profile = document.createElement('div');
  applyCustomClass(profile, options.classNames?.profile);
  const link = document.createElement('a');
  link.href = `https://github.com/${encodeURIComponent(username)}`;
  link.textContent = username;
  applyCustomClass(link, options.classNames?.profileLink);
  const img = document.createElement('img');
  img.src = avatarUrl;
  img.alt = `${username}'s avatar`;
  applyCustomClass(img, options.classNames?.avatar);
  profile.appendChild(link);
  profile.appendChild(img);

  header.appendChild(total);
  header.appendChild(profile);

  return header;
}

/**
 * Create the footer with contribution level legend
 */
export function createFooter(options: RenderOptions = {}): HTMLElement {
  const labels = {
    less: options.footerLabels?.less ?? 'Less',
    more: options.footerLabels?.more ?? 'More',
  };

  if (options.renderFooter) {
    const customFooter = options.renderFooter({
      levels: CONTRIBUTION_LEVELS,
      labels,
    } satisfies FooterRenderContext);

    if (customFooter) return customFooter;
  }

  const footer = document.createElement('div');
  footer.className = mergeClasses('ghCalendarCardFooter', options.classNames?.footer);

  const colors = document.createElement('div');
  colors.className = mergeClasses(
    'ghCalendarCardFooterColors',
    options.classNames?.footerLegend
  );

  const less = document.createElement('span');
  less.textContent = labels.less;

  const more = document.createElement('span');
  more.textContent = labels.more;

  colors.appendChild(less);

  for (const level of CONTRIBUTION_LEVELS) {
    const cell = document.createElement('div');
    cell.className = mergeClasses('ghCalendarDayCell', options.classNames?.dayCell);
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
export function createThumbnail(options: RenderOptions = {}): HTMLElement {
  if (options.renderThumbnail) {
    const customThumbnail = options.renderThumbnail({
      repoUrl: REPO_URL,
    } satisfies ThumbnailRenderContext);

    if (customThumbnail) return customThumbnail;
  }

  const thumbnail = document.createElement('div');
  thumbnail.className = mergeClasses('ghThumbNail', options.classNames?.thumbnail);

  const link = document.createElement('a');
  link.href = REPO_URL;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  applyCustomClass(link, options.classNames?.thumbnailLink);

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

  container.classList.add(ROOT_CLASS);
  applyCustomClass(container, options.classNames?.root);

  // Clear existing content
  container.innerHTML = '';

  const calendar = user.contributionsCollection.contributionCalendar;
  const { table, thead, tbody } = createTable(options);

  addWeeks(tbody, calendar.weeks, options, username);
  addMonths(thead, calendar.months, options);

  const card = createCard(options);
  const canvas = createCanvas(options);

  canvas.appendChild(table);

  if (showFooter) {
    const footer = createFooter(options);
    canvas.appendChild(footer);
  }

  card.appendChild(canvas);

  if (showHeader) {
    const header = createHeader(
      calendar.totalContributions,
      username,
      user.avatarUrl,
      options,
      user
    );
    container.appendChild(header);
  }

  container.appendChild(card);

  if (showThumbnail) {
    const thumbnail = createThumbnail(options);
    container.appendChild(thumbnail);
  }
}
