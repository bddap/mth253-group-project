
function cross(a, b) {
    const al = a.length
    const bl = b.length
    return a.map((_, i) =>
		 a[(i+1) % al] * b[(i+2) % bl] -
		 a[(i+2) % al] * b[(i+1) % bl]
		)
    // tests:
    // cross([1, 1, 1], [1, 1, 1]) == [0, 0, 0]
    // cross([1, 3, 1], [1, 1, 3]) == [8, -2, -2]
}

function sqrMag(a) {
    return a.map(n => n * n).reduce((a, b) => a + b)
}

function mag(a) {
    return Math.sqrt(sqrMag(a))
    // tests:
    // mag([1, 0, 0]) == 1
    // mag([1, 1, -2]) ~= 2.449489742783178
}

function dot(a, b) {
    return a.map((_, i) => a[i] * b[i])
}

function sub(a, b) {
    return a.map((_, i) => a[i] - b[i])
}

function add(a, b) {
    return a.map((_, i) => a[i] + b[i])
}

function sqrDist(a, b) {
    return sqrMag(sub(a, b))    
}

function distance(a, b) {
    return mag(sub(a, b))
}

function toColor(a) {
    
}

function toVector(a) {
    
}

const dislikes = []
const shown = []

function showColors(colors) {
    const colorList = document.getElementById('color-list')
    while (colorList.firstChild) { // clear colorList
	colorList.removeChild(colorList.firstChild)
    }
    for (color of colors) { // populate colorList, storing color in each element
	const d = document.createElement('div')
	d.style.backgroundColor = 'rgb('+ color.join(',') +')';
	d.innerText = color
	d.attachedColor = color
	d.onclick = onClick
	colorList.appendChild(d)
    }
}

function remove(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
}

function onClick() {
    let self = this // the element that was clicked on
    remove(shown, self.attachedColor)
    dislikes.push(self.attachedColor)
    shown.push(pickNewColor())
    showColors(shown)
}

function outOfRange(a) {
    return a < 0 || a > 255
}

function cart(arrays) {
    let current = new Array(arrays.length);
    return (function* backtracking(index) {
	if(index == arrays.length) yield current.slice();
	else for(let num of arrays[index]) {
	    current[index] = num;
	    yield* backtracking(index+1);
	}
    })(0);
}

const shell = Array.from(cart([
    [-1, 0, 1], [-1, 0, 1], [-1, 0, 1]
]))

const halfway = Math.floor(0xff / 2)

function pickNewColor(start) {
    // We want to maximize our distance from both, dislikes, and shown colors.
    start = start || [halfway, halfway, halfway]
    for (shift of shell) {
	const other = add(start, shift)
	if (!other.some(outOfRange)){
	    if (toOptimize(other) > toOptimize(start)) {
		return pickNewColor(other)
	    }
	}
    }
    return start
}

function toOptimize(a) {
    let b = 0
    for (d of dislikes) {
	b += sqrDist(a, d)
    }
    for (d of shown) {
	b += sqrDist(a, d)
    }
    return b
}

function max(iterator, f) {
    let m = iterator.next()
    for (n of iterator) {
	if (f(n) > f(n)) {
	    m = n
	}
    }
    return m
}

for (i = 0; i < 10; i++) {
    shown.push(pickNewColor())
}
showColors(shown)

