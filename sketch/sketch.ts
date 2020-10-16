let grid: Cell[][]
const CELL_SIZE = 20
function createGrid(windowWidth: number, windowHeight: number) {
  grid = new Array(floor(windowHeight / CELL_SIZE))
    .fill(undefined)
    .map((_, yi) => [...new Array(floor(windowWidth / CELL_SIZE)).fill(undefined).map((_, xi) => new Cell(xi, yi))])
}

const id = (x: any) => x

const deepCopy = (x: any): any => {
  if (Array.isArray(x)) {
    return x.map(deepCopy)
  }
  return x
}

class Cell {
  x: number
  y: number
  isAlive: boolean
  constructor(x: number, y: number, isAlive: boolean = false) {
    this.x = x
    this.y = y
    this.isAlive = isAlive
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

  draw() {
    if (this.isAlive) {
      rect(this.x, this.y, 1, 1)
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  createGrid(windowWidth, windowHeight)
  fill(255, 120, 120)
  rectMode(CENTER)
  noStroke()
  frameRate(12)
}
function draw() {
  background(0)
  translate((CELL_SIZE + (windowWidth % CELL_SIZE)) / 2, (CELL_SIZE + (windowHeight % CELL_SIZE)) / 2)
  scale(CELL_SIZE)

  const gridCopy: Cell[][] = deepCopy(grid)

  grid = grid.map((row, yi) => row.map((_, xi) => new Cell(xi, yi, gridCopy[yi][xi].checkWillSurvive())))

  grid.forEach((row) =>
    row.forEach((cell) => {
      cell.draw()
    })
  )
}

function addCell() {
  const gridX = floor((mouseX / windowWidth) * floor(windowWidth / CELL_SIZE))
  const gridY = floor((mouseY / windowHeight) * floor(windowHeight / CELL_SIZE))
  const cell = grid[gridY][gridX]
  cell.isAlive = true
  cell.draw()
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
