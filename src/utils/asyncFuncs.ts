export const asyncNewNote = ( noteText: string | null, color: string | null, coordinates: {x: number, y: number} | null, tilt: string| null ) => {
    fetch('/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            noteText: noteText,
            color: color,
            coordinates: coordinates,
            tilt: tilt
        })
    });
};

export const asyncPatchCoords = (id: number, currentOffset: {x: number, y: number}) => {
    fetch(`/notes/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coordinates: currentOffset })
    });
};