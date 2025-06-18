import { SNS } from 'aws-sdk';
import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'

export const handler = async () => {
	try {
		const data = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY!}`)
		.then((response) => response.json()) as Record<string, any>;
		const img = data.hdurl;

		const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!)
		await bot.telegram.sendMessage(process.env.TELEGRAM_CHANNEL_ID!, img)

		return {
			statusCode: 200,
			body: JSON.stringify({
				url: img,
			})
		}
	} catch (err) {
		console.error('Error:', err.message);

		return {
			statusCode: 500,
			body: {
				error: err.message,
			}
		}
	}
};
