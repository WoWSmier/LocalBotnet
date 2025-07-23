import type { RequestHandler } from '@sveltejs/kit';
import { produce } from 'sveltekit-sse';
import { spawn } from 'child_process';

const POST: RequestHandler = async (event) => {
	const { bots, command }: { bots: number; command: string } = await event.request.json();

	return produce(
		({ emit, lock }) => {
			let endedBots = 0;

			function endEvent() {
				if (endedBots === bots) {
					lock.set(false);
				}
			}

			for (let index = 1; index <= bots; index++) {
				const process = spawn(command, { shell: true });

				process.stdout.on('data', (data) => {
					emit(`bot-${index}`, data.toString());
				});

				process.stderr.on('data', (error) => {
					emit(`bot-${index}`, error.toString());
				});

				process.on('close', () => {
					endedBots++;

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
