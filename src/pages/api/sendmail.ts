import { Resend } from 'resend';

function isValidEmail(email: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeText(text: string, maxLength: number): string {
	// HTMLタグ除去＆長さ制限
	return String(text || '').replace(/<[^>]*>?/gm, '').substring(0, maxLength);
}

export async function POST({ request }: { request: Request }) {
	let data;
	try {
		data = await request.json();
	} catch (e) {
		console.error('Resend error:', e);
		return new Response(JSON.stringify({ success: false, error: 'Invalid JSON' }), { status: 400 });
	}
	const { email, subject, message, name } = data || {};
	if (!email || !subject || !message) {
		return new Response(JSON.stringify({ success: false, error: 'Missing fields' }), { status: 400 });
	}
	if (!isValidEmail(email)) {
		return new Response(JSON.stringify({ success: false, error: 'Invalid email format' }), { status: 400 });
	}
	// サニタイズ＆長さ制限
	const safeSubject = sanitizeText(subject, 100);
	const safeName = sanitizeText(name, 50);
	const safeMessage = sanitizeText(message, 1000);

	const resend = new Resend(process.env.RESEND_API_KEY);
	const content = `
Kokko's Blogからお問い合わせが届きました。

【件名】
${safeSubject}

【お名前】
${safeName}

【メールアドレス】
${email}

【本文】
${safeMessage}
`;

	try {
		const result = await resend.emails.send({
			from: 'onboarding@resend.dev',
			to: import.meta.env.TO_EMAIL_ADDRESS,
			subject: `Kokko's Blogからお問い合わせ: ${safeSubject}`,
			html: content.replace(/\n/g, '<br>'),
			replyTo: email,
		});
		console.log('Resend result:', result);
		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (e) {
		console.error('Resend error:', e);
		return new Response(JSON.stringify({ success: false, error: 'Failed to send email' }), { status: 400 });
	}
}