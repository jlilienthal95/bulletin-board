import type { TiltType } from "$lib/types";

function pickRandom<T>(options: T[]): T {
		const length = options.length;
		let index = Math.random() * (length - 1);
		index = index % 1 > 0.5 ? Math.ceil(index) : Math.floor(index);
		return options[index];
}

export function generateRandomColor() {
    const colors = [
        { name: 'pink', value: ' bg-red-300 ' },
        { name: 'red', value: ' bg-red-500 ' },
        { name: 'yellow', value: ' bg-yellow-300 ' },
        { name: 'blue', value: ' bg-cyan-400 ' },
        { name: 'purple', value: ' bg-purple-500 ' },
        { name: 'dkGreen', value: ' bg-green-700 ' },
        { name: 'ltGreen', value: ' bg-green-400 ' }
    ];
    return pickRandom(colors).value;
}

export function generateRandomTilt():TiltType {
    const tilts = [
        ' rotate-[-3deg] ',
        ' rotate-[-2deg] ',
        ' rotate-[-1deg] ',
        ' rotate-[0deg] ',
        ' rotate-[1deg] ',
        ' rotate-[2deg] ',
        ' rotate-[3deg] '
    ];
    return pickRandom(tilts) as TiltType;
}

export function generateGrainRotate() {
    const rotations = ['', 'rotate-90', 'rotate-180', 'rotate-270'];
    return ` ${pickRandom(rotations)} `;
}