<script lang="ts">
	import AddNote from '$lib/components/AddNote.svelte';
	import Note from '$lib/components/Note.svelte';
	import { onMount } from 'svelte';
	import { get, writable } from 'svelte/store';
	import { generateRandomColor, generateRandomTilt } from '../utils/randomProps';
	import type { NoteType } from '$lib/types';

	const notes = writable<NoteType[]>([]);

	function handleAddNote() {
		const newNotes = [...get(notes)];
		newNotes.push({
			color: generateRandomColor(),
			coordinates: { x: 0, y: 0 },
			noteText: null,
			tilt: generateRandomTilt()
		});
		notes.set(newNotes);
	}

	function handleDeleteNote() {
		const newNotes = [...get(notes)];
		newNotes.pop();
		notes.set(newNotes);
	}

	async function fetchNotes() {
		const notesData = await fetch('/notes');
		const notesFetched = await notesData.json();
		return notesFetched;
	}

	onMount(async () => {
		notes.set(await fetchNotes());
	});
</script>

<div id="mainCont" class="flex h-screen w-full">
	<div id="notesCont" class="relative h-screen w-full">
		{#each $notes as note}
			<Note
				id={note.id}
				noteText={note.noteText}
                color={note.color}
				coordinates={note.coordinates}
				tilt={note.tilt}
				{handleDeleteNote}
			/>
		{/each}
	</div>
	<div id="addNoteUI" class="h-screen">
		<AddNote onClick={handleAddNote} />
	</div>
</div>
