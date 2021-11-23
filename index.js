
function createCanvas() {
  const canvas = document.createElement('canvas')
  document.body.appendChild(canvas)
  return canvas
}

function render(canvas) {
  canvas.width = canvas.clientWidth * window.devicePixelRatio
  canvas.height = canvas.clientHeight * window.devicePixelRatio
  const context = canvas.getContext('2d')
  context.scale(window.devicePixelRatio, window.devicePixelRatio)
  context.clearRect(0, 0, canvas.width, canvas.height)
  const cx = canvas.clientWidth / 2
  const cy = canvas.clientHeight / 2
  const size = Math.min(canvas.clientWidth, canvas.clientHeight) - 1
  const r = size / 2
  const cells = computeCells(r)
  drawCircle(context, cx, cy, r, 'rgb(222,222,222)')
  for (let i = 0; i < cells[0].length; i++) {
    const fill = i === 4 ? 'rgb(222,222,222)' : undefined
    drawCircle(context, cx, cy, cells[0][i].rMin, fill)
  }
  for (let i = 0; i < cells.length; i++) {
    const theta = cells[i][0].thetaMin
    context.beginPath()
    context.moveTo(cx + Math.cos(theta) * (r / 5), cy + Math.sin(theta) * (r / 5))
    context.lineTo(cx + Math.cos(theta) * r, cy + Math.sin(theta) * r)
    context.closePath()
    context.stroke()
  }
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  for (let col = 0; col < cells.length; col++) {
    const scale = keys[(col * 7) % 12]
    for (let row = 0; row < cells[col].length; row++) {
      const cell = cells[col][row]
      setFont(context, (cell.rMax - cell.rMin) * 0.5, row === 0 || row === 5)
      const x = cx + Math.cos(cell.theta) * (cell.rMin + cell.rMax) / 2
      const y = cy + Math.sin(cell.theta) * (cell.rMin + cell.rMax) / 2
      context.fillText(scale[row], x, y)
    }
  }
}

function setFont(context, size, bold = false) {
  context.font = `${bold ? '800' : '300'} ${size}px monospace`
}

function drawCircle(context, cx, cy, r, fillStyle = 'rgb(255,255,255)') {
  context.save()
  context.strokeStyle = 'rgb(0,0,0)'
  context.fillStyle = fillStyle
  context.strokeWidth = 1
  context.beginPath()
  context.arc(cx, cy, r, 0, Math.PI * 2)
  context.closePath()
  context.stroke()
  context.fill()
  context.restore()
}

function computeCells(r) {
  const cells = []
  const rootWidth = r / 5;
  const deadSpace = r / 5;
  const defaultWidth = (r - rootWidth - deadSpace) / 6
  for (let col = 0; col < 12; col++) {
    const column = []
    const theta = Math.PI / 6 * col
    column.push(new Cell(theta, r - rootWidth, r))
    for (let row = 1; row < 7; row++) {
      column.push(new Cell(theta, r - rootWidth - (defaultWidth * (row)), r - rootWidth - (defaultWidth * (row - 1))))
    }
    cells.push(column)
  }
  return cells
}

window.addEventListener('load', () => {
  const canvasElement = createCanvas()
  render(canvasElement)
  window.addEventListener('resize', () => render(canvasElement))
})

class Cell {
  constructor(theta, rMin, rMax) {
    this.theta = theta;
    this.thetaMin = theta - Math.PI / 12
    this.thetaMax = theta + Math.PI / 12
    this.rMin = rMin;
    this.rMax = rMax;
  }
}

// class Scale {
//   constructor(root, pattern) {
//     this.notes = pattern.reduce((notes, stepSize) => [...notes, (notes[notes.length - 1] + stepSize) % 12], [root])
//   }

//   getNote(i) {
//     const chromaticNotes = ['A', 'A#/Bb', 'B', 'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab']
//     return chromaticNotes[this.notes[i % this.notes.length]]
//   }
// }

// class MajorScale extends Scale {
//   constructor(root) {
//     super(root, [2, 2, 1, 2, 2, 2])
//   }
// }

const keys = [
  [ 'A', 'B', 'C♯', 'D', 'E', 'F♯', 'G♯' ],
  [ 'B♭', 'C', 'D', 'E♭', 'F', 'G', 'A' ],
  [ 'B', 'C♯', 'D♯', 'E', 'F♯', 'G♯', 'A♯' ],
  [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ],
  [ 'D♭', 'E♭', 'F', 'G♭', 'A♭', 'B♭', 'C' ],
  [ 'D', 'E', 'F♯', 'G', 'A', 'B', 'C♯' ],
  [ 'E♭', 'F', 'G', 'A♭', 'B♭', 'C', 'D' ],
  [ 'E', 'F♯', 'G♯', 'A', 'B', 'C♯', 'D♯' ],
  [ 'F', 'G', 'A', 'B♭', 'C', 'D', 'E' ],
  [ 'G♭', 'A♭', 'B♭', 'C♭', 'D♭', 'E♭', 'F' ],
  [ 'G', 'A', 'B', 'C', 'D', 'E', 'F♯' ],
  [ 'A♭', 'B♭', 'C', 'D♭', 'E♭', 'F', 'G' ],
]