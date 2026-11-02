<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Workspace invitation</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:14px;border:1px solid #e2e8f0;overflow:hidden;">
                    <tr>
                        <td style="padding:26px 28px 0;">
                            <p style="margin:0;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#059669;font-weight:700;">{{ config('app.name') }}</p>
                            <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;color:#0f172a;">Join {{ $workspace->name }}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:14px 28px 0;font-size:14px;line-height:1.6;color:#475569;">
                            <p style="margin:0 0 12px;">
                                {{ $inviter?->name ?? 'A workspace admin' }} invited you to collaborate as
                                <strong style="color:#0f172a;">{{ ucfirst($invitation->role) }}</strong>.
                            </p>
                            <p style="margin:0 0 22px;">
                                Accept the invitation to access the workspace and its features.
                            </p>
                            <p style="margin:0 0 24px;">
                                <a href="{{ $acceptUrl }}" style="display:inline-block;background:#059669;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:11px 20px;border-radius:9px;">
                                    Accept invitation
                                </a>
                            </p>
                            <p style="margin:0 0 8px;font-size:12px;color:#64748b;">
                                This link expires {{ $invitation->expires_at?->format('M j, Y') ?? 'in 7 days' }}.
                            </p>
                            <p style="margin:0 0 24px;font-size:12px;color:#64748b;word-break:break-all;">
                                {{ $acceptUrl }}
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:16px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;font-size:11.5px;color:#94a3b8;">
                            If you were not expecting this invitation you can ignore this email.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
