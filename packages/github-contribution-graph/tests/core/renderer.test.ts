import { describe, it, expect, beforeEach } from 'vitest';
import {
  createTable,
  addMonths,
  addWeeks,
  createCard,
  createCanvas,
  createHeader,
  createFooter,
  createThumbnail,
  renderWidget,
} from '../../src/core/renderer';
import { CONTRIBUTION_LEVELS } from '../../src/core/constants';
import type { GitHubUser, ContributionMonth, ContributionWeek } from '../../src/core/types';

describe('createTable', () => {
  it('should create table with correct structure', () => {
    const { table, thead, tbody } = createTable();

    expect(table.className).toBe('ghCalendarTable');
    expect(thead.rows.length).toBe(1);
    expect(tbody.rows.length).toBe(7); // 7 days
  });

  it('should have first cell with 28px width', () => {
    const { thead } = createTable();

    expect(thead.rows[0].cells[0].style.width).toBe('28px');
  });

  it('should add day labels correctly', () => {
    const { tbody } = createTable();

    // Check Mon, Wed, Fri labels
    expect(tbody.rows[1].cells[0].innerHTML).toContain('Mon');
    expect(tbody.rows[3].cells[0].innerHTML).toContain('Wed');
    expect(tbody.rows[5].cells[0].innerHTML).toContain('Fri');

    // Check empty rows
    expect(tbody.rows[0].cells[0].innerHTML).toBe('');
    expect(tbody.rows[2].cells[0].innerHTML).toBe('');
  });
});

describe('addMonths', () => {
  it('should add months with totalWeeks >= 2', () => {
    const { thead } = createTable();
    const months: ContributionMonth[] = [
      { name: 'Jan', totalWeeks: 4 },
      { name: 'Feb', totalWeeks: 1 }, // Should be skipped
      { name: 'Mar', totalWeeks: 3 },
      { name: 'Apr', totalWeeks: 2 }, // Last month, skipped by loop
    ];

    addMonths(thead, months);

    // Initial cell (28px) + Jan + Mar (Feb skipped due to totalWeeks < 2)
    expect(thead.rows[0].cells.length).toBe(3);
    expect(thead.rows[0].cells[1].textContent).toBe('Jan');
    expect(thead.rows[0].cells[2].textContent).toBe('Mar');
  });

  it('should set correct colspan for months', () => {
    const { thead } = createTable();
    const months: ContributionMonth[] = [
      { name: 'Jan', totalWeeks: 5 },
      { name: 'Feb', totalWeeks: 4 },
    ];

    addMonths(thead, months);

    expect(thead.rows[0].cells[1].colSpan).toBe(5);
  });

  it('should not add month with totalWeeks === 1', () => {
    const { thead } = createTable();
    const months: ContributionMonth[] = [
      { name: 'Jan', totalWeeks: 1 },
      { name: 'Feb', totalWeeks: 2 },
    ];

    addMonths(thead, months);

    // Only initial cell, Feb is last so skipped by loop
    expect(thead.rows[0].cells.length).toBe(1);
  });
});

describe('addWeeks', () => {
  it('should add contribution days to correct rows', () => {
    const { tbody } = createTable();
    const weeks: ContributionWeek[] = [
      {
        contributionDays: [
          {
            date: '2024-01-01',
            contributionCount: 5,
            contributionLevel: 'SECOND_QUARTILE',
            weekday: 1, // Monday
          },
          {
            date: '2024-01-02',
            contributionCount: 3,
            contributionLevel: 'FIRST_QUARTILE',
            weekday: 2, // Tuesday
          },
        ],
      },
    ];

    addWeeks(tbody, weeks);

    // Check Monday row (index 1) has a new cell
    expect(tbody.rows[1].cells.length).toBe(2); // label + day
    expect(tbody.rows[1].cells[1].dataset.date).toBe('2024-01-01');
    expect(tbody.rows[1].cells[1].dataset.count).toBe('5');
    expect(tbody.rows[1].cells[1].dataset.level).toBe('SECOND_QUARTILE');

    // Check Tuesday row (index 2)
    expect(tbody.rows[2].cells.length).toBe(2);
    expect(tbody.rows[2].cells[1].dataset.date).toBe('2024-01-02');
  });

  it('should create tooltip span with contribution info', () => {
    const { tbody } = createTable();
    const weeks: ContributionWeek[] = [
      {
        contributionDays: [
          {
            date: '2024-01-15',
            contributionCount: 10,
            contributionLevel: 'THIRD_QUARTILE',
            weekday: 0,
          },
        ],
      },
    ];

    addWeeks(tbody, weeks);

    const cell = tbody.rows[0].cells[1];
    expect(cell.querySelector('span')?.textContent).toContain('10 contributions');
  });
});

describe('createCard', () => {
  it('should create div with ghCalendarCard class', () => {
    const card = createCard();

    expect(card.tagName).toBe('DIV');
    expect(card.className).toBe('ghCalendarCard');
  });
});

describe('createCanvas', () => {
  it('should create div with ghCalendarCanvas class', () => {
    const canvas = createCanvas();

    expect(canvas.tagName).toBe('DIV');
    expect(canvas.className).toBe('ghCalendarCanvas');
  });
});

describe('createHeader', () => {
  it('should display total contributions', () => {
    const header = createHeader(1234, 'testuser', 'https://example.com/avatar.png');

    expect(header.textContent).toContain('1234 contributions in the last year');
  });

  it('should include profile link and avatar', () => {
    const header = createHeader(100, 'octocat', 'https://example.com/avatar.png');

    const link = header.querySelector('a');
    const img = header.querySelector('img');

    expect(link?.href).toContain('github.com/octocat');
    expect(link?.textContent).toBe('octocat');
    expect(img?.src).toBe('https://example.com/avatar.png');
  });
});

describe('createFooter', () => {
  it('should create footer with Less/More labels', () => {
    const footer = createFooter();

    expect(footer.textContent).toContain('Less');
    expect(footer.textContent).toContain('More');
  });

  it('should create cells for all contribution levels', () => {
    const footer = createFooter();
    const cells = footer.querySelectorAll('.ghCalendarDayCell');

    expect(cells.length).toBe(CONTRIBUTION_LEVELS.length);

    CONTRIBUTION_LEVELS.forEach((level, index) => {
      expect(cells[index].getAttribute('data-level')).toBe(level);
    });
  });
});

describe('createThumbnail', () => {
  it('should create thumbnail with link to repo', () => {
    const thumbnail = createThumbnail();
    const link = thumbnail.querySelector('a');

    expect(link?.href).toContain('github.com/iamjr15/github-contribution-graph');
    expect(link?.target).toBe('_blank');
  });

  it('should contain GitHub logo SVG', () => {
    const thumbnail = createThumbnail();
    const svg = thumbnail.querySelector('svg');

    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 98 96');
  });
});

describe('renderWidget', () => {
  let container: HTMLDivElement;

  const mockUser: GitHubUser = {
    avatarUrl: 'https://example.com/avatar.png',
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: 500,
        months: [
          { name: 'Jan', totalWeeks: 4 },
          { name: 'Feb', totalWeeks: 4 },
        ],
        weeks: [
          {
            contributionDays: [
              {
                date: '2024-01-01',
                contributionCount: 5,
                contributionLevel: 'SECOND_QUARTILE',
                weekday: 1,
              },
            ],
          },
        ],
      },
    },
  };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('should render all components by default', () => {
    renderWidget(container, mockUser, 'testuser');

    expect(container.querySelector('.ghCalendarHeader')).not.toBeNull();
    expect(container.querySelector('.ghCalendarCard')).not.toBeNull();
    expect(container.querySelector('.ghCalendarCardFooter')).not.toBeNull();
    expect(container.querySelector('.ghThumbNail')).not.toBeNull();
  });

  it('should hide header when showHeader is false', () => {
    renderWidget(container, mockUser, 'testuser', { showHeader: false });

    expect(container.querySelector('.ghCalendarHeader')).toBeNull();
  });

  it('should hide footer when showFooter is false', () => {
    renderWidget(container, mockUser, 'testuser', { showFooter: false });

    expect(container.querySelector('.ghCalendarCardFooter')).toBeNull();
  });

  it('should hide thumbnail when showThumbnail is false', () => {
    renderWidget(container, mockUser, 'testuser', { showThumbnail: false });

    expect(container.querySelector('.ghThumbNail')).toBeNull();
  });

  it('should clear existing content before rendering', () => {
    container.innerHTML = '<p>Old content</p>';

    renderWidget(container, mockUser, 'testuser');

    expect(container.querySelector('p')).toBeNull();
  });
});
