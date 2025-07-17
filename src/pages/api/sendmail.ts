import { Resend } from 'resend';

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
	const resend = new Resend(process.env.RESEND_API_KEY);
	const content = `
Kokko's Blogからお問い合わせが届きました。

【件名】
${subject}

【お名前】
${name}

【メールアドレス】
${email}

【本文】
${message}
`;

	try {
		const result = await resend.emails.send({
			from: 'onboarding@resend.dev',
			to: import.meta.env.TO_EMAIL_ADDRESS,
			subject: `Kokko's Blogからお問い合わせ: ${subject}`,
			html: content.replace(/\n/g, '<br>'),
			replyTo: email,
		});
		console.log('Resend result:', result);
		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (e) {
		console.error('Resend error:', e);
		return new Response(JSON.stringify({ success: false, error: String(e) }), { status: 400 });
	}
}