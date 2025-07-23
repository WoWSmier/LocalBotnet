<script lang="ts">
	import { EventType } from '$enums/event-type';
	import type { DataEvent, ErrorEvent, Event } from '$types/event';
	import { source, type Options } from 'sveltekit-sse';

	let bots = $state(2);
	let command = $state('');

	let chats = $state<
		{
			bot: number;
			command: string;
			isEnded: boolean;
			messages: {
				text: string;
				date: Date;
			}[];
		}[]
	>([]);

	function send() {
		if (bots < 1 || !command) {
			return;
		}

		chats = [];

		const event = source('/api/command', {
			options: {
				body: JSON.stringify({ bots, command })
			} as Options
		});

		for (let index = 1; index <= bots; index++) {
			event.select(`bot-${index}`).subscribe((data) => {
				if (!data) return;

				const json: Event = JSON.parse(data);

				const chat = chats.find((chat) => chat.bot === index);

				function createMessage({ text, timestamp }: DataEvent | ErrorEvent) {
					if (chat) {
						chat.messages.push({ text: text, date: new Date(timestamp) });

						return;
					}

					chats.push({
						bot: index,
						command,
						isEnded: false,
						messages: [{ text: text, date: new Date(timestamp) }]
					});
				}

				function closeChat() {
					if (chat) {
						chat.isEnded = true;

						return;
					}

					chats.push({
						bot: index,
						command,
						isEnded: true,
						messages: []
					});
				}

				if (json.type === EventType.DATA || json.type === EventType.ERROR) {
					createMessage(json);
				} else if (json.type === EventType.CLOSE) {
					closeChat();
				}
			});
		}
	}

	function formatDate(date: Date): string {
		const timeFormatter = new Intl.DateTimeFormat('pl-PL', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		});

		return timeFormatter.format(date);
	}

	let sortedChats = $derived(
		chats.toSorted((a, b) => {
			if (a.bot > b.bot) return 1;
			if (a.bot < b.bot) return -1;

			return 0;
		})
	);
</script>

<div class="grid h-screen w-screen grid-cols-2 bg-neutral-950">
	<div class="flex flex-col gap-y-6 p-6">
		<label class="flex flex-col gap-y-2">
			<div class="text-green-500">Bots:</div>
			<input
				type="number"
				bind:value={bots}
				class="border-b border-green-500 text-green-500 focus:outline-none"
			/>
		</label>

		<label>
			<div class="text-green-500">Command:</div>
			<textarea
				bind:value={command}
				class="h-max w-full resize-none border-b border-green-500 text-green-500 focus:outline-none"
				rows="1"
			></textarea>
		</label>

		<button onclick={send} class="cursor-pointer border border-green-500 py-2 text-green-500"
			>Send</button
		>
	</div>

	<div class="flex flex-col overflow-y-scroll border-l border-green-500">
		{#each sortedChats as chat (chat.bot)}
			<div class="flex flex-col gap-y-2 border-b border-green-500 p-6">
				<div class="text-green-500">Bot {chat.bot}&gt; {chat.command}</div>

				<div class="flex flex-col">
					{#each chat.messages as message (message)}
						<pre class="text-wrap text-green-500">{formatDate(message.date)} {message.text}</pre>
					{/each}
				</div>

				{#if chat.isEnded}
					<div class="text-green-500">Bot {chat.bot}&gt;</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
