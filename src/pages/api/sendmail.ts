import { Resend } from 'resend';

export const prerender = false;

export async function POST({ request }: { request: Request }) {
	console.log('API called');
	let data;
	try {
		data = await request.json();
	} catch (e) {
		console.error('JSON parse error:', e);
		return new Response(JSON.stringify({ success: false, error: 'Invalid JSON' }), { status: 400 });
	}
	const { email, subject, message } = data || {};
	if (!email || !subject || !message) {
		console.error('Missing fields:', { email, subject, message });
		return new Response(JSON.stringify({ success: false, error: 'Missing fields' }), { status: 400 });
	}
	const resend = new Resend(process.env.RESEND_API_KEY);

	try {
		await resend.emails.send({
			from: email,
			to: import.meta.env.TO_EMAIL_ADDRESS,
			subject,
			html: message,
		});
		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (e) {
		console.error('Resend error:', e);
		return new Response(JSON.stringify({ success: false, error: String(e) }), { status: 400 });
	}
}