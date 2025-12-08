# GitHub Contribution Graph Widget

Embed GitHub contribution graphs on any website.

![Preview](assets/media/thumbnail.png)

![HTML5](https://img.shields.io/static/v1?label=&message=HTML5&color=%23E34F26&logo=html5&logoColor=%23fff)
![CSS](https://img.shields.io/static/v1?label=&message=CSS&color=%231572B6&logo=css3&logoColor=%23fff)
![JavaScript](https://img.shields.io/static/v1?label=&message=JavaScript&color=%23F7DF1E&logo=javascript&logoColor=%23000)
![Netlify](https://img.shields.io/static/v1?label=&message=Netlify&color=%2300C7B7&logo=netlify&logoColor=%23fff)

## Demo

**Live:** https://inspiring-gaufre-e45638.netlify.app

## Quick Start

```html
<link rel="stylesheet" href="https://inspiring-gaufre-e45638.netlify.app/assets/css/gh.css">
<div id="gh" data-login="YOUR_GITHUB_USERNAME"></div>
<script src="https://inspiring-gaufre-e45638.netlify.app/assets/js/gh.js"></script>
```

## Self-Hosting

### Prerequisites

- Node.js 18+
- GitHub Personal Access Token ([create one](https://github.com/settings/tokens) with `read:user` scope)
- Netlify account

### Deploy

1. Fork this repository
2. Connect to Netlify
3. Add environment variable: `GITHUB_TOKEN` = your PAT
4. Deploy

### Local Development

```bash
npm install
npm install -g netlify-cli
echo "GITHUB_TOKEN=your_token" > .env
netlify dev
```

Open http://localhost:8888

## API

```
GET /api/ghcg/fetch-data?login={username}
```

Returns GitHub contribution calendar data for the specified user.

## License

Apache 2.0
