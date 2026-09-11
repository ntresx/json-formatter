# JSON Formatter

A small, fast developer utility for formatting, validating, minifying, and copying JSON directly in your browser.

## Features

- Pretty-print JSON with 2 spaces, 4 spaces, or tabs
- Minify JSON into compact output
- Validate JSON with useful parse errors and approximate line/column information when the browser provides a position
- Copy formatted output with temporary feedback
- Clear input and output instantly
- Load a realistic nested example
- Keyboard-friendly editing, including Tab indentation and Ctrl/Cmd + Enter to format
- Client-side JSON processing — input is not uploaded or stored by the application
- A 5,000,000-character client-side safety limit to keep very large inputs responsive
- Responsive dark-first UI for desktop and mobile

## Tech Stack

- Laravel 13
- PHP 8.3+
- Blade
- Tailwind CSS 4
- Vite
- Vanilla JavaScript
- PHPUnit
- Node.js built-in test runner

## Installation

```bash
git clone <repository-url>
cd json-formatter
composer install
cp .env.example .env
php artisan key:generate
npm install
npm run build
php artisan serve
```

Open `http://localhost:8000` in your browser.


## Usage

1. Paste JSON into the **Input** editor.
2. Choose an indentation style when formatting.
3. Use **Format** to prettify JSON or **Minify** to compact it.
4. Use **Validate** to check the input without changing it.
5. Use **Copy** to copy the current output.
6. Use **Load Example** for a ready-to-edit nested JSON sample.
7. Use **Clear** to reset the editor and output.

All JSON processing happens in the browser through the native `JSON.parse()` and `JSON.stringify()` APIs.

## Development

Run the Laravel server and Vite dev server separately:

```bash
php artisan serve
npm run dev
```

For a production asset build:

```bash
npm run build
```

## Testing

PHP tests:

```bash
php artisan test
```

JavaScript utility tests:

```bash
npm run test:js
```

Run both suites through Composer:

```bash
composer test
```

## License

This project is licensed under the MIT License.
