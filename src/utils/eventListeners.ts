import { clickActive } from "../store";
import { get } from "svelte/store";
import box from "../routes/+page.svelte"

let x = 300;
let y = 300;

export const handleDraggableMouseMove = (e: MouseEvent) => {
    console.log('x:', e.clientX, 'y:', e.clientY)
    const h = e.clientX;
    const v = e.clientY;
    box.style.transform = `translate(${x}px, ${y}px)`;
}

export const handleDraggableClick = () => {
    console.log('draggable clicked');
    if(!get(clickActive)){
        addEventListener('mousemove', handleDraggableMouseMove  )
        clickActive.set(true);
    } else{
        removeEventListener('mousemove', handleDraggableMouseMove)
        clickActive.set(false);
    }
    //get coordinates of mouse
    //get coordinates of draggable
    //on every mouse movement, update coordinates of draggable
    
}