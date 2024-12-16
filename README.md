# YoloApp

A microsite generator application.

## Requirements

- Node.js 20 (LTS)
- pdftocairo (for PDF processing)
- pnpm

### Installing pdftocairo

- On MacOS: `brew install poppler`
- On Ubuntu/Debian: `sudo apt-get install poppler-utils`

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/farmisen/yoloapp.git
   cd yoloapp
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Push the database schema:
   ```bash
   pnpm prisma db push
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. (Optional) Start Prisma Studio to manage your database:
   ```bash
   pnpm prisma studio
   ```

## Development

### Useful Commands

- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm build` - Build for production
- `pnpm start` - Start production server

### Database Management

- `pnpm prisma generate` - Generate Prisma Client
- `pnpm prisma db push` - Push schema changes to database
- `pnpm prisma studio` - Open Prisma Studio

## License

[MIT](LICENSE)
