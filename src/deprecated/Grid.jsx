import "./Grid.css"


export default function Grid(props) {
    return (
    <div class="grid">
    <div class="square">
        <ul>This demo shows you can center multiple types of content :
        <li>Text</li>
        <li>Images</li>
        <li>Lists</li>
        </ul>
    </div>
    <div class="square">98%</div>
    <div class="square">3.9/5</div>
    <div class="square"><img src="https://farm3.staticflickr.com/2878/10944255073_973d2cd25c.jpg" /></div>
    <div class="square"><img src="https://farm9.staticflickr.com/8461/8048823381_0fbc2d8efb.jpg" /></div>
    <div class="square"><img class="rs" src="https://farm5.staticflickr.com/4144/5053682635_b348b24698.jpg" /></div>
    <div class="square fullImg"><img src="https://farm9.staticflickr.com/8461/8048823381_0fbc2d8efb.jpg" /></div>
    <div class="square fullImg"><img class="rs" src="https://farm5.staticflickr.com/4144/5053682635_b348b24698.jpg" /></div>
    <div class="square fullImg"><img src="https://farm3.staticflickr.com/2878/10944255073_973d2cd25c.jpg" /></div>
    </div>
)}