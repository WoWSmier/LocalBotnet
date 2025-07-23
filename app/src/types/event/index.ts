import type { EventType } from '$enums/event-type';

type DataEvent = {
	type: EventType.DATA;
	text: string;
	timestamp: number;
};

type ErrorEvent = {
	type: EventType.ERROR;
	text: string;
	timestamp: number;
};

type CloseEvent = {
	type: EventType.CLOSE;
};

type Event = DataEvent | ErrorEvent | CloseEvent;

export type { DataEvent, ErrorEvent, CloseEvent, Event };
