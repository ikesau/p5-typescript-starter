let grid: Cell[][]
const MUTATION_FACTOR = 40
let CELL_SIZE = 9
if (/Mobi|Android/i.test(navigator.userAgent)) {
  CELL_SIZE = CELL_SIZE * 2
}

function createGrid(windowWidth: number, windowHeight: number) {
  grid = new Array(floor(windowHeight / CELL_SIZE))
    .fill(undefined)
    .map((_, yi) => [
      ...new Array(floor(windowWidth / CELL_SIZE))
        .fill(undefined)
        .map(
          (_, xi) =>
            new Cell(xi, yi, undefined, createVector(100 + random(-MUTATION_FACTOR, MUTATION_FACTOR), 100, 100))
        ),
    ])
}

const id = (x: any) => x

const deepCopy = (x: any): any => {
  if (Array.isArray(x)) {
    return x.map(deepCopy)
  }
  return x
}

function meanVector(vectors: p5.Vector[]) {
  return vectors.reduce((acc, cur) => p5.Vector.add(acc, cur), new p5.Vector()).div(vectors.length)
}

class Cell {
  x: number
  y: number
  isAlive: boolean
  fillColour: p5.Vector
  constructor(x: number, y: number, isAlive: boolean = Math.random() < 0.5, fillColour: p5.Vector) {
    this.x = x
    this.y = y
    this.isAlive = isAlive
    this.fillColour = fillColour
  }
  getNeighbours(): Cell[] {
    let neighbours: Cell[] = []
    if (this.y === 0) {
      neighbours.push(
        ...[
          grid[this.y][this.x - 1],
          grid[this.y + 1][this.x - 1],

          grid[this.y + 1][this.x],

          grid[this.y][this.x + 1],
          grid[this.y + 1][this.x + 1],
        ]
      )
    } else if (this.y === grid.length - 1) {
      neighbours.push(
        ...[
          grid[this.y - 1][this.x - 1],
          grid[this.y][this.x - 1],

          grid[this.y - 1][this.x],

          grid[this.y - 1][this.x + 1],
          grid[this.y][this.x + 1],
        ]
      )
    } else {
      neighbours.push(
        ...[
          grid[this.y - 1][this.x - 1],
          grid[this.y][this.x - 1],
          grid[this.y + 1][this.x - 1],

          grid[this.y - 1][this.x],
          grid[this.y + 1][this.x],

          grid[this.y - 1][this.x + 1],
          grid[this.y][this.x + 1],
          grid[this.y + 1][this.x + 1],
        ]
      )
    }
    return neighbours.filter(id)
  }

  checkWillSurvive() {
    const neighbours = this.getNeighbours()
    const aliveNeighbours = neighbours.filter((cell) => cell.isAlive)
    if (this.isAlive && (aliveNeighbours.length === 3 || aliveNeighbours.length === 2)) {
      return true
    }
    if (!this.isAlive && aliveNeighbours.length === 3) {
      return true
    }
    return false
  }

  breed(): Cell {
    const neighbours = this.getNeighbours()
    const aliveNeighbours = neighbours.filter((cell) => cell.isAlive)
    if (this.isAlive && (aliveNeighbours.length === 3 || aliveNeighbours.length === 2)) {
      return this
    }
    if (!this.isAlive && aliveNeighbours.length === 3) {
      const averageFillColour = meanVector(aliveNeighbours.map((cell) => cell.fillColour))

      const mutatedFillColour = averageFillColour.add(
        createVector(random(-MUTATION_FACTOR, MUTATION_FACTOR), random(-MUTATION_FACTOR, MUTATION_FACTOR))
      )
      return new Cell(this.x, this.y, true, mutatedFillColour)
    }
    this.isAlive = false
    return this
  }

  draw() {
    if (this.isAlive) {
      fill([this.fillColour.x, this.fillColour.y, this.fillColour.z])
      rect(this.x, this.y, 1, 1)
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  createGrid(windowWidth, windowHeight)
  rectMode(CENTER)
  noStroke()
  frameRate(12)
}
function draw() {
  background(0)
  translate((CELL_SIZE + (windowWidth % CELL_SIZE)) / 2, (CELL_SIZE + (windowHeight % CELL_SIZE)) / 2)
  scale(CELL_SIZE)

  grid = grid.map((row) => row.map((cell) => cell.breed()))

  grid.forEach((row) =>
    row.forEach((cell) => {
      cell.draw()
    })
  )
}

function addCell() {
  const gridX = floor((mouseX / windowWidth) * floor(windowWidth / CELL_SIZE))
  const gridY = floor((mouseY / windowHeight) * floor(windowHeight / CELL_SIZE))
  const cell = grid[gridY]?.[gridX]
  if (cell) {
    const neighbours = cell.getNeighbours()
    neighbours.forEach((cell) => {
      cell.isAlive = true
      cell.draw()
    })
    cell.isAlive = true
    cell.draw()
  }
}

function mouseDragged() {
  addCell()
}

function mousePressed() {
  addCell()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  createGrid(windowWidth, windowHeight)
}
