# WordsEssence React Version

This is a React rewrite of the original Vue.js WordsEssence application using:

- **React 18** with TypeScript
- **Vite** for build tool
- **Tailwind CSS v4** for styling
- **Shadcn/ui** for UI components
- **React Router** for routing
- **Tesseract.js** for OCR functionality
- **Swiper** for carousel functionality

## Features

- 📝 Add and edit text excerpts with OCR support
- 🎨 Beautiful notebook-style display
- 🔄 Swipeable text carousel
- 📱 Responsive design
- 🖼️ Image text recognition
- 📋 Grid list view

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # Shadcn/ui components
│   ├── AddForm.tsx   # Add/Edit form with OCR
│   ├── TextList.tsx  # Swipeable text display
│   ├── ImageUploader.tsx
│   └── ImagePreview.tsx
├── pages/
│   ├── HomePage.tsx  # Main swipeable view
│   ├── AddPage.tsx   # Standalone add page
│   └── ListPage.tsx  # Grid list view
├── services/
│   └── tesseractService.ts # OCR service
├── types/
│   └── index.ts      # TypeScript types
└── lib/
    └── utils.ts      # Utility functions
```

## Development

The app maintains feature parity with the original Vue.js version while using modern React patterns and Tailwind CSS v4.