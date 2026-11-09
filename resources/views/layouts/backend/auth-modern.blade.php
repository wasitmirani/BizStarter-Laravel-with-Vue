<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <title>@yield('title', 'Sign in') — {{ config('app.name') }}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="description" content="{{ config('app.name') }} — WhatsApp and Instagram CRM for modern teams.">
    <meta name="theme-color" content="#04120d">
    <meta name="robots" content="noindex, nofollow">
    <link rel="shortcut icon" href="{{ asset('favicon.ico') }}">
    <link rel="manifest" href="/manifest.webmanifest">
    <link rel="apple-touch-icon" href="/icons/icon-192.png">
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800" rel="stylesheet" />

    <style>
        :root {
            --auth-ink: #0d1f18;
            --auth-muted: #5c6f66;
            --auth-soft: #8a9a92;
            --auth-line: #e2e9e5;
            --auth-line-strong: #cdd9d3;
            --auth-field: #f7faf8;
            --auth-primary: #059669;
            --auth-primary-dark: #047857;
            --auth-primary-soft: #ecfdf5;
            --auth-danger: #dc2626;
            --auth-danger-soft: #fef2f2;
            --auth-warning: #b45309;
            --auth-warning-soft: #fffbeb;
            --auth-radius: 12px;
            --auth-shadow: 0 30px 70px rgba(9, 34, 24, 0.13);
        }

        *,
        *::before,
        *::after {
            box-sizing: border-box;
        }

        html,
        body {
            height: 100%;
        }

        body.lk-auth {
            margin: 0;
            font-family: 'Instrument Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
            color: var(--auth-ink);
            background: #f4f8f5;
            -webkit-font-smoothing: antialiased;
            text-rendering: optimizeLegibility;
        }

        a {
            color: var(--auth-primary-dark);
            text-decoration: none;
            font-weight: 600;
        }

        a:hover {
            color: var(--auth-primary);
            text-decoration: underline;
            text-underline-offset: 2px;
        }

        .lk-auth__shell {
            display: grid;
            grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
            min-height: 100dvh;
        }

        /* ---------------------------------------------------------------
           Brand panel
           --------------------------------------------------------------- */

        .lk-auth__brand {
            position: relative;
            display: flex;
            flex-direction: column;
            min-height: 100dvh;
            padding: 38px 46px 30px;
            overflow: hidden;
            color: #eafff5;
            background:
                radial-gradient(circle at 12% -6%, rgba(16, 185, 129, 0.34), transparent 44%),
                radial-gradient(circle at 100% 104%, rgba(56, 189, 248, 0.16), transparent 46%),
                linear-gradient(160deg, #05170f 8%, #04120d 58%, #071a13 100%);
        }

        .lk-auth__brand::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image:
                linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
            background-size: 46px 46px;
            mask-image: radial-gradient(circle at 30% 20%, #000 0%, transparent 72%);
            pointer-events: none;
        }

        .lk-auth__brand::after {
            content: '';
            position: absolute;
            right: -130px;
            top: 16%;
            width: 340px;
            height: 340px;
            border-radius: 50%;
            border: 1px solid rgba(110, 231, 183, 0.18);
            box-shadow:
                0 0 0 46px rgba(16, 185, 129, 0.035),
                0 0 0 120px rgba(16, 185, 129, 0.025);
            pointer-events: none;
        }

        .lk-auth__brand-logo {
            position: relative;
            z-index: 1;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            width: fit-content;
            text-decoration: none;
        }

        .lk-auth__brand-logo:hover {
            text-decoration: none;
        }

        .lk-auth__brand-mark {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 10px;
            background: linear-gradient(145deg, #34d399, #059669);
            color: #04120d;
            font-size: 18px;
            font-weight: 800;
            letter-spacing: -0.04em;
            box-shadow: 0 8px 20px rgba(5, 150, 105, 0.3);
        }

        .lk-auth__brand-name {
            display: block;
            font-size: 19px;
            line-height: 1;
            font-weight: 800;
            letter-spacing: -0.035em;
            color: #f2fff9;
        }

        .lk-auth__brand-name span {
            display: block;
            margin-top: 4px;
            font-size: 8px;
            line-height: 1;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: rgba(167, 243, 208, 0.6);
        }

        .lk-auth__brand-logo--light .lk-auth__brand-name {
            color: var(--auth-ink);
        }

        .lk-auth__brand-logo--light .lk-auth__brand-name span {
            color: var(--auth-soft);
        }

        .lk-auth__brand-main {
            position: relative;
            z-index: 1;
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: center;
            max-width: 520px;
            padding: 40px 0;
        }

        .lk-auth__eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            width: fit-content;
            margin-bottom: 18px;
            padding: 5px 11px;
            border: 1px solid rgba(110, 231, 183, 0.26);
            border-radius: 999px;
            background: rgba(16, 185, 129, 0.1);
            color: #a7f3d0;
            font-size: 10.5px;
            font-weight: 700;
            letter-spacing: 0.09em;
            text-transform: uppercase;
        }

        .lk-auth__eyebrow::before {
            content: '';
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #34d399;
            box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.16);
        }

        .lk-auth__brand-title {
            margin: 0;
            font-size: clamp(30px, 3.1vw, 42px);
            line-height: 1.08;
            font-weight: 800;
            letter-spacing: -0.04em;
            color: #f2fff9;
        }

        .lk-auth__brand-title em {
            font-style: normal;
            color: #6ee7b7;
        }

        .lk-auth__brand-copy {
            margin: 16px 0 0;
            max-width: 440px;
            font-size: 14px;
            line-height: 1.65;
            color: rgba(214, 245, 230, 0.72);
        }

        .lk-auth__features {
            display: grid;
            gap: 13px;
            margin: 30px 0 0;
            padding: 0;
            list-style: none;
        }

        .lk-auth__feature {
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }

        .lk-auth__feature-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 38px;
            flex: none;
            border: 1px solid rgba(110, 231, 183, 0.2);
            border-radius: 11px;
            background: rgba(16, 185, 129, 0.11);
            color: #6ee7b7;
        }

        .lk-auth__feature strong {
            display: block;
            font-size: 13px;
            font-weight: 700;
            color: #ecfff7;
        }

        .lk-auth__feature span {
            display: block;
            margin-top: 2px;
            font-size: 11.5px;
            line-height: 1.5;
            color: rgba(199, 238, 221, 0.62);
        }

        .lk-auth__brand-foot {
            position: relative;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            flex-wrap: wrap;
            padding-top: 22px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            font-size: 11px;
            color: rgba(199, 238, 221, 0.5);
        }

        .lk-auth__avatars {
            display: inline-flex;
            align-items: center;
        }

        .lk-auth__avatars span {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 26px;
            height: 26px;
            margin-left: -7px;
            border: 2px solid #061711;
            border-radius: 50%;
            background: linear-gradient(145deg, #34d399, #059669);
            color: #04120d;
            font-size: 9.5px;
            font-weight: 800;
        }

        .lk-auth__avatars span:first-child {
            margin-left: 0;
        }

        .lk-auth__avatars span:nth-child(2) {
            background: linear-gradient(145deg, #7dd3fc, #0284c7);
        }

        .lk-auth__avatars span:nth-child(3) {
            background: linear-gradient(145deg, #f0abfc, #c026d3);
        }

        .lk-auth__avatars span:last-child {
            background: #0f2f23;
            color: #a7f3d0;
            font-size: 9px;
        }

        .lk-auth__proof {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .lk-auth__proof p {
            margin: 0;
            line-height: 1.35;
        }

        .lk-auth__proof strong {
            display: block;
            font-size: 11.5px;
            color: #d9fbee;
        }

        /* ---------------------------------------------------------------
           Form panel
           --------------------------------------------------------------- */

        .lk-auth__panel {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            min-height: 100dvh;
            padding: 40px 32px;
            background:
                radial-gradient(circle at 88% 6%, rgba(16, 185, 129, 0.1), transparent 38%),
                radial-gradient(circle at 6% 96%, rgba(56, 189, 248, 0.07), transparent 34%),
                #f4f8f5;
        }

        .lk-auth__panel::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: radial-gradient(rgba(13, 31, 24, 0.055) 1px, transparent 1px);
            background-size: 22px 22px;
            opacity: 0.55;
            pointer-events: none;
        }

        .lk-auth__card {
            position: relative;
            z-index: 1;
            width: 100%;
            max-width: 432px;
            padding: 36px 36px 32px;
            border: 1px solid var(--auth-line);
            border-radius: 20px;
            background: #fff;
            box-shadow: var(--auth-shadow);
        }

        .lk-auth__mobile-logo {
            display: none;
            position: relative;
            z-index: 1;
            margin-bottom: 20px;
        }

        .lk-auth__mobile-logo img {
            display: block;
            height: 28px;
            width: auto;
        }

        .lk-auth__panel-foot {
            position: relative;
            z-index: 1;
            margin: 20px 0 0;
            font-size: 10.5px;
            color: var(--auth-soft);
            text-align: center;
        }

        .lk-auth__panel-foot a {
            color: var(--auth-muted);
            font-weight: 600;
        }

        /* ---------------------------------------------------------------
           Shared auth form elements
           --------------------------------------------------------------- */

        .lk-auth__head {
            margin-bottom: 22px;
        }

        .lk-auth__head .lk-auth__kicker {
            display: inline-block;
            margin-bottom: 8px;
            font-size: 10.5px;
            font-weight: 700;
            letter-spacing: 0.09em;
            text-transform: uppercase;
            color: var(--auth-primary);
        }

        .lk-auth__head h1 {
            margin: 0;
            font-size: 25px;
            line-height: 1.15;
            font-weight: 800;
            letter-spacing: -0.035em;
            color: var(--auth-ink);
        }

        .lk-auth__head p {
            margin: 7px 0 0;
            font-size: 12.5px;
            line-height: 1.55;
            color: var(--auth-muted);
        }

        .lk-form {
            display: grid;
            gap: 14px;
        }

        .lk-field {
            display: grid;
            gap: 6px;
        }

        .lk-field__top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }

        .lk-field label,
        .lk-field__label {
            font-size: 11.5px;
            font-weight: 700;
            color: var(--auth-ink);
            letter-spacing: 0.005em;
        }

        .lk-field__label .lk-field__optional {
            font-weight: 500;
            color: var(--auth-soft);
        }

        .lk-field__link {
            font-size: 11px;
            font-weight: 600;
        }

        .lk-input-wrap {
            position: relative;
            display: flex;
            align-items: center;
        }

        .lk-input {
            width: 100%;
            height: 44px;
            padding: 0 13px;
            border: 1px solid var(--auth-line-strong);
            border-radius: 10px;
            background: var(--auth-field);
            color: var(--auth-ink);
            font-family: inherit;
            font-size: 13px;
            outline: none;
            transition: border-color 120ms ease, box-shadow 120ms ease, background 120ms ease;
        }

        .lk-input::placeholder {
            color: #9aaba3;
        }

        .lk-input:hover {
            border-color: #b8c8c0;
        }

        .lk-input[readonly] {
            background: #eef4f1;
            color: var(--auth-muted);
            cursor: default;
        }

        .lk-input[readonly]:hover {
            border-color: var(--auth-line-strong);
        }

        .lk-input:focus {
            border-color: var(--auth-primary);
            background: #fff;
            box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.12);
        }

        .lk-input[aria-invalid='true'],
        .lk-input.is-invalid {
            border-color: var(--auth-danger);
        }

        .lk-input[aria-invalid='true']:focus,
        .lk-input.is-invalid:focus {
            box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }

        .lk-input-wrap--password .lk-input {
            padding-right: 44px;
        }

        .lk-password-toggle {
            position: absolute;
            top: 50%;
            right: 6px;
            transform: translateY(-50%);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            padding: 0;
            border: 0;
            border-radius: 8px;
            background: transparent;
            color: #7b8d84;
            line-height: 0;
            cursor: pointer;
            transition: background 120ms ease, color 120ms ease;
        }

        .lk-password-toggle svg {
            display: block;
            flex: none;
        }

        .lk-password-toggle:hover {
            background: #eef5f1;
            color: var(--auth-ink);
        }

        .lk-password-toggle:focus-visible {
            outline: 2px solid var(--auth-primary);
            outline-offset: 1px;
        }

        .lk-password-toggle .lk-eye--hide,
        .lk-password-toggle.is-visible .lk-eye--show {
            display: none;
        }

        .lk-password-toggle.is-visible .lk-eye--hide {
            display: block;
        }

        .lk-field__error {
            display: flex;
            align-items: flex-start;
            gap: 5px;
            margin: 0;
            font-size: 11px;
            line-height: 1.4;
            color: var(--auth-danger);
        }

        .lk-field__hint {
            margin: 0;
            font-size: 10.5px;
            line-height: 1.4;
            color: var(--auth-soft);
        }

        .lk-auth__row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-wrap: wrap;
            margin-top: 1px;
        }

        .lk-check {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            font-size: 11.5px;
            color: var(--auth-muted);
            cursor: pointer;
            user-select: none;
        }

        .lk-check input {
            position: relative;
            width: 16px;
            height: 16px;
            margin: 0;
            appearance: none;
            border: 1px solid var(--auth-line-strong);
            border-radius: 4px;
            background: #fff;
            cursor: pointer;
            transition: background 120ms ease, border-color 120ms ease;
        }

        .lk-check input:checked {
            border-color: var(--auth-primary);
            background: var(--auth-primary);
        }

        .lk-check input:checked::after {
            content: '';
            position: absolute;
            left: 4.5px;
            top: 1.5px;
            width: 4px;
            height: 8px;
            border: solid #fff;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
        }

        .lk-check input:focus-visible {
            outline: 2px solid var(--auth-primary);
            outline-offset: 2px;
        }

        .lk-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            height: 44px;
            padding: 0 18px;
            border: 1px solid transparent;
            border-radius: 10px;
            font-family: inherit;
            font-size: 12.5px;
            font-weight: 700;
            cursor: pointer;
            text-decoration: none;
            transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease, border-color 120ms ease;
        }

        .lk-btn--primary {
            width: 100%;
            background: linear-gradient(135deg, var(--auth-primary), #0d9488);
            color: #fff;
            box-shadow: 0 10px 24px rgba(5, 150, 105, 0.22);
        }

        .lk-btn--primary:hover {
            color: #fff;
            text-decoration: none;
            transform: translateY(-1px);
            box-shadow: 0 14px 28px rgba(5, 150, 105, 0.27);
        }

        .lk-btn--primary:active {
            transform: translateY(0);
        }

        .lk-btn--ghost {
            width: 100%;
            border-color: var(--auth-line-strong);
            background: #fff;
            color: var(--auth-ink);
        }

        .lk-btn--ghost:hover {
            border-color: var(--auth-primary);
            color: var(--auth-primary-dark);
            text-decoration: none;
        }

        .lk-btn:focus-visible {
            outline: 2px solid var(--auth-primary);
            outline-offset: 2px;
        }

        .lk-btn[disabled] {
            opacity: 0.55;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .lk-auth__switch {
            margin: 18px 0 0;
            padding-top: 17px;
            border-top: 1px solid var(--auth-line);
            font-size: 11.5px;
            color: var(--auth-muted);
            text-align: center;
        }

        .lk-auth__switch a {
            font-weight: 700;
        }

        .lk-auth__back {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            margin-top: 16px;
            font-size: 11.5px;
            font-weight: 600;
            color: var(--auth-muted);
        }

        .lk-auth__back:hover {
            color: var(--auth-ink);
            text-decoration: none;
        }

        .lk-auth__legal {
            margin: 14px 0 0;
            font-size: 10px;
            line-height: 1.5;
            color: var(--auth-soft);
            text-align: center;
        }

        .lk-auth__secure {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            margin-top: 14px;
            font-size: 10px;
            color: var(--auth-soft);
        }

        .lk-auth__secure svg {
            color: var(--auth-primary);
        }

        /* Alerts */

        .lk-alert {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin: 0 0 16px;
            padding: 10px 12px;
            border: 1px solid transparent;
            border-radius: 10px;
            font-size: 11.5px;
            line-height: 1.45;
        }

        .lk-alert--error {
            border-color: #fecaca;
            background: var(--auth-danger-soft);
            color: #991b1b;
        }

        .lk-alert--success {
            border-color: #a7f3d0;
            background: var(--auth-primary-soft);
            color: #065f46;
        }

        .lk-alert--warning {
            border-color: #fde68a;
            background: var(--auth-warning-soft);
            color: var(--auth-warning);
        }

        .lk-alert svg {
            flex: none;
            margin-top: 1px;
        }

        .lk-alert strong {
            font-weight: 700;
        }

        /* Divider / note */

        .lk-auth__note {
            display: flex;
            gap: 9px;
            margin: 18px 0 0;
            padding: 11px 12px;
            border: 1px solid var(--auth-line);
            border-radius: 10px;
            background: var(--auth-field);
            font-size: 10.5px;
            line-height: 1.5;
            color: var(--auth-muted);
        }

        .lk-auth__note svg {
            flex: none;
            margin-top: 1px;
            color: var(--auth-primary);
        }

        /* ---------------------------------------------------------------
           Responsive
           --------------------------------------------------------------- */

        @media (max-width: 1080px) {
            .lk-auth__shell {
                grid-template-columns: minmax(0, 0.92fr) minmax(0, 1fr);
            }

            .lk-auth__brand {
                padding: 32px 34px 26px;
            }

            .lk-auth__card {
                padding: 30px 28px 28px;
            }
        }

        @media (max-width: 900px) {
            .lk-auth__shell {
                grid-template-columns: minmax(0, 1fr);
            }

            .lk-auth__brand {
                display: none;
            }

            .lk-auth__panel {
                padding: 28px 20px;
            }

            .lk-auth__mobile-logo {
                display: block;
            }

            .lk-auth__card {
                padding: 30px 28px 28px;
            }
        }

        @media (max-width: 560px) {
            .lk-auth__panel {
                padding: 20px 16px;
                justify-content: flex-start;
            }

            .lk-auth__card {
                max-width: none;
                padding: 24px 20px 22px;
                border-radius: 16px;
                box-shadow: 0 18px 40px rgba(9, 34, 24, 0.08);
            }

            .lk-auth__head h1 {
                font-size: 22px;
            }

            .lk-auth__row {
                align-items: flex-start;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
                transition-duration: 0.01ms !important;
                animation-duration: 0.01ms !important;
            }
        }
    </style>
</head>

<body class="lk-auth">
    @php($brandName = config('app.name', 'LaraKit'))
    @php($brandInitial = strtoupper(substr($brandName, 0, 1)))
    <main class="lk-auth__shell">
        <aside class="lk-auth__brand" aria-label="About {{ $brandName }}">
            <a href="{{ route('login') }}" class="lk-auth__brand-logo" aria-label="{{ $brandName }} home">
                <span class="lk-auth__brand-mark" aria-hidden="true">{{ $brandInitial }}</span>
                <span class="lk-auth__brand-name">{{ $brandName }}<span>CRM suite</span></span>
            </a>

            <div class="lk-auth__brand-main">
                <span class="lk-auth__eyebrow">WhatsApp + Instagram CRM</span>
                <h1 class="lk-auth__brand-title">Every conversation.<br>One <em>shared inbox.</em></h1>
                <p class="lk-auth__brand-copy">
                    Bring WhatsApp and Instagram together, route chats to the right teammate and turn conversations
                    into customers — without switching apps.
                </p>

                <ul class="lk-auth__features">
                    <li class="lk-auth__feature">
                        <span class="lk-auth__feature-icon" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        </span>
                        <div>
                            <strong>Unified shared inbox</strong>
                            <span>WhatsApp Cloud API and Instagram DMs in one team workspace.</span>
                        </div>
                    </li>
                    <li class="lk-auth__feature">
                        <span class="lk-auth__feature-icon" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-8-8 18-2-8Z"/></svg>
                        </span>
                        <div>
                            <strong>Campaigns that convert</strong>
                            <span>Approved templates, scheduled sends and delivery tracking built in.</span>
                        </div>
                    </li>
                    <li class="lk-auth__feature">
                        <span class="lk-auth__feature-icon" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        </span>
                        <div>
                            <strong>Built for teams</strong>
                            <span>Roles, assignments, audit logs and multi-workspace access control.</span>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="lk-auth__brand-foot">
                <div class="lk-auth__proof">
                    <div class="lk-auth__avatars" aria-hidden="true">
                        <span>AK</span><span>JS</span><span>MT</span><span>+9</span>
                    </div>
                    <p>
                        <strong>Trusted by support teams</strong>
                        <span>One workspace, every channel.</span>
                    </p>
                </div>
                <span>&copy; {{ date('Y') }} {{ config('app.name') }}</span>
            </div>
        </aside>

        <section class="lk-auth__panel">
            <a href="{{ route('login') }}" class="lk-auth__mobile-logo" aria-label="{{ $brandName }} home">
                <span class="lk-auth__brand-logo lk-auth__brand-logo--light">
                    <span class="lk-auth__brand-mark" aria-hidden="true">{{ $brandInitial }}</span>
                    <span class="lk-auth__brand-name">{{ $brandName }}<span>CRM suite</span></span>
                </span>
            </a>

            <div class="lk-auth__card">
                @yield('content')
            </div>

            <p class="lk-auth__panel-foot">
                &copy; {{ date('Y') }} {{ config('app.name') }}
                &middot; <a href="{{ url('/') }}">Home</a>
            </p>
        </section>
    </main>

    <script>
        (function () {
            document.querySelectorAll('[data-password-toggle]').forEach(function (button) {
                button.addEventListener('click', function () {
                    var input = document.getElementById(button.getAttribute('data-password-toggle'));

                    if (!input) return;

                    var show = input.type === 'password';
                    input.type = show ? 'text' : 'password';
                    button.classList.toggle('is-visible', show);
                    button.setAttribute('aria-pressed', show ? 'true' : 'false');
                    button.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
                });
            });
        })();
    </script>
</body>

</html>
