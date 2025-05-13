<script lang="ts">
    import { get } from 'svelte/store';
	import { clickActive } from '../../store';
	import { onMount } from 'svelte';
    
    export let noteText: string = '';
    export let coordinates: {x: number, y: number} | null = null;
    export let tilt: string = '';

	let box;

	let initialMouse = { x: 0, y: 0 };
	let currentOffset = { x: 0, y: 0 };

    function pickRandom<T>(options: T[]): T {
        const length = options.length;
        let index = Math.random() * (length - 1);
        index = index % 1 > 0.5 ? Math.ceil(index) : Math.floor(index);
	    return options[index];
    }

    function generateRandomColor() {
	const colors = [
		{ name: 'pink', value: 'bg-red-300' },
		{ name: 'red', value: 'bg-red-500' },
		{ name: 'yellow', value: 'bg-yellow-300' },
		{ name: 'blue', value: 'bg-cyan-400' },
		{ name: 'purple', value: 'bg-purple-500' },
		{ name: 'dkGreen', value: 'bg-green-700' },
		{ name: 'ltGreen', value: 'bg-green-400' }
	];
        return ` ${pickRandom(colors).value} `;
    }

    function generateRandomTilt() {
        const tilts = [
            'rotate-[-3deg]',
            'rotate-[-2deg]',
            'rotate-[-1deg]',
            'rotate-[0deg]',
            'rotate-[1deg]',
            'rotate-[2deg]',
            'rotate-[3deg]'
        ];
        return ` ${pickRandom(tilts)} `;
    }

    function generateGrainRotate() {
        const rotations = ['', 'rotate-90', 'rotate-180', 'rotate-270'];
        return ` ${pickRandom(rotations)} `;
    }


	const handleDraggableMouseMove = (e: MouseEvent) => {
		const deltaX = e.clientX - initialMouse.x;
		const deltaY = e.clientY - initialMouse.y;
		box.style.transform = `translate(${currentOffset.x + deltaX}px, ${currentOffset.y + deltaY}px)`;
	};

	const handleDraggableClick = (e: MouseEvent) => {
		console.log('draggable clicked');
		if (!get(clickActive)) {
			initialMouse = { x: e.clientX, y: e.clientY };
			addEventListener('mousemove', handleDraggableMouseMove);
			clickActive.set(true);
		} else {
			removeEventListener('mousemove', handleDraggableMouseMove);
			const deltaX = e.clientX - initialMouse.x;
			const deltaY = e.clientY - initialMouse.y;
			currentOffset.x += deltaX;
			currentOffset.y += deltaY;
            //db call - set coordinates
            localStorage.setItem('note-coords', JSON.stringify(currentOffset));
            localStorage.setItem('note-tilt', )
			clickActive.set(false);
		}
	};
    onMount(() => {
        if (typeof localStorage !== 'undefined') {
            // db call - get coordinates
            const storedCoords = localStorage.getItem('note-coords');
            const storedTilt = localStorage.getItem('note-tilt');
            if (storedCoords) {
                const { x, y } = JSON.parse(storedCoords);
                coordinates = { x, y };
                currentOffset = { x, y };
                if (box) {
                    box.style.transform = `translate(${x}px, ${y}px)`;
                }
            }
            if (storedTilt) {
                console.log('storedTilt:', storedTilt);
                console.log('jsoned:', JSON.parse(storedTilt));
            }
        }
    });

</script>

<div
    id="note"
    class={'relative h-[300px] w-[300px] shadow-[2px_4px_6px] ' +
        generateRandomTilt() +
        generateRandomColor()}
    on:mousedown={handleDraggableClick}
    on:mouseup={handleDraggableClick}
    bind:this={box}
    >
    <div
        class={'absolute inset-0 bg-[url(/grainTexture.png)] opacity-60 ' + generateGrainRotate()}
    >
    </div>
    <div id="text" class="flex w-full h-full text-xl select-none p-4">
        {noteText}
    </div>
</div>