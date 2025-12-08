# Contributing

Thanks for your interest in contributing to `github-contribution-graph`!

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/iamjr15/github-contribution-graph.git
   cd github-contribution-graph
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the package:
   ```bash
   npm run build
   ```

4. Run tests:
   ```bash
   npm run test
   ```

## Project Structure

```
packages/github-contribution-graph/
├── src/
│   ├── core/           # Core logic (types, API, renderer)
│   ├── react/          # React component and hook
│   ├── vanilla/        # Vanilla JS widget class
│   └── styles/         # CSS and theme utilities
├── tests/              # Test files
├── dist/               # Build output (gitignored)
└── package.json
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build the package |
| `npm run dev` | Build in watch mode |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run typecheck` | Type check with TypeScript |

## Making Changes

1. Create a branch for your changes:
   ```bash
   git checkout -b feature/my-feature
   ```

2. Make your changes in the `src/` directory

3. Add tests for new functionality in `tests/`

4. Ensure all tests pass:
   ```bash
   npm run test
   ```

5. Build to verify no errors:
   ```bash
   npm run build
   ```

6. Commit your changes with a descriptive message

7. Open a pull request

## Code Style

- Use TypeScript for all new code
- Follow existing patterns in the codebase
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Testing

- Write tests for new features and bug fixes
- Place tests in the appropriate directory under `tests/`
- Use descriptive test names
- Aim for good coverage of edge cases

## Pull Request Guidelines

- Keep PRs focused on a single change
- Update documentation if needed
- Add a changelog entry for user-facing changes
- Ensure CI passes before requesting review

## Reporting Issues

- Check existing issues before opening a new one
- Include reproduction steps
- Provide browser/Node.js version if relevant

## License

By contributing, you agree that your contributions will be licensed under the Apache-2.0 License.
