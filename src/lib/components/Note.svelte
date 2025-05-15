<script lang="ts">
	import { onMount } from 'svelte';
	import { generateGrainRotate, generateRandomColor, generateRandomTilt } from '../../utils/randomProps';
	import { asyncNewNote,asyncPatchCoords } from '../../utils/asyncFuncs';

    export let handleDeleteNote: () => void | null;

	export let id: number | null = null;
	export let color: string = '';
	export let coordinates: { x: number; y: number } | null = null;
	export let noteText: string | null = null;
	export let tilt: string | null = null;

	let box;

	let initialMouse = { x: 0, y: 0 };
	let currentOffset = { x: 0, y: 0 };

	const handleDraggableMouseMove = (e: MouseEvent) => {
		const deltaX = e.clientX - initialMouse.x;
		const deltaY = e.clientY - initialMouse.y;
		box.style.transform = `translate(${currentOffset.x + deltaX}px, ${currentOffset.y + deltaY}px)`;
	};

	const handleDraggableMouseDown = (e: MouseEvent) => {
		console.log('draggable clicked');
		box.style.zIndex = "50"
		initialMouse = { x: e.clientX, y: e.clientY };
		addEventListener('mousemove', handleDraggableMouseMove);
	};

	const handleDraggableMouseUp = (e: MouseEvent) => {
		console.log('draggable released');
			box.style.zIndex = "0";
			removeEventListener('mousemove', handleDraggableMouseMove);
			const deltaX = e.clientX - initialMouse.x;
			const deltaY = e.clientY - initialMouse.y;
			currentOffset.x += deltaX;
			currentOffset.y += deltaY;
			//db call - set coordinates
			if(id){
				asyncPatchCoords(id, currentOffset);
			}
	}

    const handleSubmitNewNote = (e: MouseEvent) => {
        const inputText = document.getElementById('noteTextInput')?.value;
        noteText = inputText;
		asyncNewNote(noteText, color, coordinates, tilt );
    }

	onMount(() => {
		if (coordinates) {
			const { x, y } = coordinates;
			currentOffset = { x, y };
			if (box) {
				box.style.transform = `translate(${x}px, ${y}px)`;
			}
		} else {
			coordinates = { x: 0, y: 0 };
		};
	});
</script>

<div
	id="note"
	aria-label="Note"
	class={'absolute  h-[300px] w-[300px] shadow-[2px_4px_6px] ' +
		tilt +
		color }
	on:mousedown={handleDraggableMouseDown}
	on:mouseup={handleDraggableMouseUp}
	on:keydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			handleDraggableMouseDown(e);
		}
	}}
	bind:this={box}
>
	<div
		class={'absolute inset-0 bg-[url(/grainTexture.png)] opacity-60 ' + generateGrainRotate()}
	></div>
	<div id="text" class="relative h-full w-full p-4 text-xl justify-center">
		{#if noteText}
			{noteText}
		{/if}
		{#if !noteText}
			<div class="flex w-[85%] flex-col items-center text-center gap-5">
				<label for="noteTextInput">Type your note here!</label>
				<input type="text" name="noteTextInput" id="noteTextInput" class="bg-gray-300" />
                <div id="noteUI" class="flex w-full h-full justify-between items-end">
                    <button class="hover:opacity-50" on:click={handleDeleteNote}><svg height='2.7rem' width='2.7rem' viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>cancel</title> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="work-case" fill="#000000" transform="translate(91.520000, 91.520000)"> <polygon id="Close" points="328.96 30.2933333 298.666667 1.42108547e-14 164.48 134.4 30.2933333 1.42108547e-14 1.42108547e-14 30.2933333 134.4 164.48 1.42108547e-14 298.666667 30.2933333 328.96 164.48 194.56 298.666667 328.96 328.96 298.666667 194.56 164.48"> </polygon> </g> </g> </g></svg></button>
                    <button class="hover:opacity-50" on:click={handleSubmitNewNote}><svg height='3rem' width='3rem' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></button>
                </div>
			</div>
		{/if}
	</div>
</div>
