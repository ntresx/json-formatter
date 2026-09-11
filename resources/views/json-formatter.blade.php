@extends('layouts.app')

@section('content')
<div class="min-h-screen">
    <main class="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header class="mb-6 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <div class="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                    Developer Utility
                </div>
                <h1 class="text-2xl font-semibold tracking-tight text-white sm:text-3xl">JSON Formatter</h1>
                <p class="mt-1.5 max-w-xl text-sm leading-6 text-zinc-400">
                    Format, validate and minify JSON without sending your data anywhere.
                </p>
            </div>

            <div class="flex items-center gap-2 text-xs text-zinc-500" aria-label="Privacy note">
                <svg class="h-4 w-4 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                    <path d="M12 3 5 6v5c0 4.7 2.9 8.4 7 10 4.1-1.6 7-5.3 7-10V6l-7-3Z"/>
                    <path d="m9.5 12 1.7 1.7 3.5-3.5"/>
                </svg>
                Runs locally in your browser
            </div>
        </header>

        <section class="flex flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-900/55 shadow-2xl shadow-black/20" aria-label="JSON formatter">
            <div class="grid min-h-0 flex-1 grid-cols-1 divide-y divide-zinc-800/90 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
                <div class="flex min-h-[420px] min-w-0 flex-col lg:min-h-0">
                    <div class="flex items-center justify-between border-b border-zinc-800/90 px-4 py-3 sm:px-5">
                        <label for="json-input" class="text-sm font-medium text-zinc-200">Input</label>
                        <span id="input-meta" class="text-xs tabular-nums text-zinc-500">0 chars</span>
                    </div>
                    <div class="min-h-0 flex-1 p-3 sm:p-4">
                        <textarea
                            id="json-input"
                            class="json-editor h-full min-h-[360px] w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/90 p-4 font-mono text-[13px] leading-6 text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800 sm:text-sm"
                            placeholder="Paste JSON here..."
                            spellcheck="false"
                            autocomplete="off"
                            autocapitalize="off"
                            autocorrect="off"
                            aria-describedby="status-message"
                        ></textarea>
                    </div>
                </div>

                <div class="flex min-h-[420px] min-w-0 flex-col bg-zinc-950/25 lg:min-h-0">
                    <div class="flex items-center justify-between border-b border-zinc-800/90 px-4 py-3 sm:px-5">
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-zinc-200">Output</span>
                            <span id="output-status" class="status-pill status-idle">Ready</span>
                        </div>
                        <button id="copy-output" type="button" class="icon-button" disabled aria-label="Copy output">
                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                                <rect x="8" y="8" width="12" height="12" rx="2"/>
                                <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>
                            </svg>
                            <span>Copy</span>
                        </button>
                    </div>
                    <div class="min-h-0 flex-1 p-3 sm:p-4">
                        <textarea
                            id="json-output"
                            class="json-editor h-full min-h-[360px] w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/90 p-4 font-mono text-[13px] leading-6 text-zinc-300 outline-none sm:text-sm"
                            readonly
                            spellcheck="false"
                            aria-label="Formatted JSON output"
                        ></textarea>
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-3 border-t border-zinc-800/90 bg-zinc-900/75 p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
                <div id="status-message" class="order-2 min-h-5 px-1 text-xs text-zinc-500 lg:order-1" role="status" aria-live="polite">
                    Paste JSON to get started.
                </div>

                <div class="order-1 flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:order-2">
                    <div class="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950/55 px-2">
                        <label for="indent-size" class="pl-1 text-xs text-zinc-500">Indent</label>
                        <select id="indent-size" class="border-0 bg-transparent py-2 pr-7 text-xs font-medium text-zinc-300 outline-none focus:ring-0">
                            <option value="2">2 spaces</option>
                            <option value="4">4 spaces</option>
                            <option value="tab">Tabs</option>
                        </select>
                    </div>

                    <button id="load-example" type="button" class="tool-button secondary-button">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                            <path d="M8 6h12M8 12h12M8 18h12"/>
                            <path d="M4 6h.01M4 12h.01M4 18h.01" stroke-linecap="round"/>
                        </svg>
                        Load Example
                    </button>

                    <button id="format-json" type="button" class="tool-button primary-button" disabled>
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                            <path d="M8 3v18M16 3v18M3 8h18M3 16h18"/>
                        </svg>
                        Format
                    </button>

                    <button id="minify-json" type="button" class="tool-button secondary-button" disabled>
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                            <path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16"/>
                        </svg>
                        Minify
                    </button>

                    <button id="validate-json" type="button" class="tool-button secondary-button" disabled>
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                            <path d="m5 12 4 4L19 6"/>
                            <circle cx="12" cy="12" r="9"/>
                        </svg>
                        Validate
                    </button>

                    <button id="clear-json" type="button" class="tool-button ghost-button" disabled>
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                            <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>
                        </svg>
                        Clear
                    </button>
                </div>
            </div>
        </section>

        <footer class="pt-5 text-center text-xs text-zinc-600 sm:text-left">
            No uploads, no storage, no account. Your JSON stays in this browser tab.
        </footer>
    </main>
</div>
@endsection
