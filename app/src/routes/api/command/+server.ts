import type { RequestHandler } from '@sveltejs/kit';
import { produce } from 'sveltekit-sse';
import { spawn } from 'child_process';
import { EventType } from '$enums/event-type';
import type { Event } from '$types/event';

const POST: RequestHandler = async (event) => {
	const { bots, command }: { bots: number; command: string } = await event.request.json();

	return produce(
		({ emit, lock }) => {
			lock.set(true);

			let endedBots = 0;

			function endEvent() {
				if (endedBots === bots) {
					lock.set(false);
				}
			}

			for (let index = 1; index <= bots; index++) {
				const process = spawn('bash', ['-c', command]);

				process.stdout.on('data', (data) => {
					emit(
						`bot-${index}`,
						JSON.stringify({
							type: EventType.DATA,
							text: data.toString(),
							timestamp: Date.now()
						} satisfies Event)
					);
				});

				process.stderr.on('data', (error) => {
					emit(
						`bot-${index}`,
						JSON.stringify({
							type: EventType.ERROR,
							text: error.toString(),
							timestamp: Date.now()
						} satisfies Event)
					);
				});

				process.on('close', () => {
					endedBots++;

					emit(
						`bot-${index}`,
						JSON.stringify({
							type: EventType.CLOSE
						} satisfies Event)
					);

					endEvent();
				});
			}
		},
		{
			ping: 1000
		}
	);
};

export { POST };
