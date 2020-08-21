let eyes: Eye[] = []
const eyeWidth = 40
let ripple: Ripple
let scleraFills: [number, number, number][] = [[255, 255, 255]]
let scleraFillIndex = 0

class Eye {
  pos: p5.Vector
  width: number
  height: number
  openPercentage: number
  isOpen: boolean
  hasBeenClosed: boolean

  constructor(x: number, y: number, width: number) {
    this.pos = createVector(x, y)
    this.width = width
    this.height = width * 0.75
    this.openPercentage = 0
  }

  setIsOpen(isOpen: boolean) {
    this.isOpen = isOpen
  }

  setHasBeenClosed(hasBeenClosed: boolean) {
    this.hasBeenClosed = hasBeenClosed
  }

  draw() {
    if (!this.isOpen) return
    push()
    translate(this.pos.x, this.pos.y)

    fill(scleraFills[scleraFillIndex])
    beginShape()
    vertex(-this.width, 0)
    bezierVertex(
      -this.width / 2,
      -this.height,
      this.width / 2,
      -this.height,
      this.width,
      0
    )
    bezierVertex(
      this.width / 2,
      this.height,
      -this.width / 2,
      this.height,
      -this.width,
      0
    )
    endShape()

    fill(0)
    const pupil = createVector(mouseX, mouseY)
      // translate to origin of eye
      .sub(this.pos)
      // set max magnitude to within the eye
      .limit(this.height)
    circle(pupil.x, pupil.y, this.width * 0.9)

    const maxOpenPercentage = this.hasBeenClosed
      ? 0
      : map(pupil.y, -this.height, this.height, 1, 0.6)

    // eyelid
    stroke(0)
    if (this.isOpen) {
      this.openPercentage = lerp(this.openPercentage, maxOpenPercentage, 0.4)
    }
    const topLidY = map(
      this.openPercentage,
      0,
      1,
      this.height * 0.5,
      -this.height
    )
    scale(1, 1.1)
    beginShape()
    vertex(-this.width, 0)
    bezierVertex(
      -this.width / 2,
      -this.height,
      this.width / 2,
      -this.height,
      this.width,
      0
    )
    bezierVertex(
      this.width / 2,
      topLidY,
      -this.width / 2,
      topLidY,
      -this.width,
      0
    )
    endShape()
    const bottomLidY = map(
      this.openPercentage,
      0,
      1,
      this.height * 0.5,
      this.height
    )
    beginShape()
    vertex(-this.width, 0)
    bezierVertex(
      -this.width / 2,
      bottomLidY,
      this.width / 2,
      bottomLidY,
      this.width,
      0
    )
    bezierVertex(
      this.width / 2,
      this.height,
      -this.width / 2,
      this.height,
      -this.width,
      0
    )
    endShape()

    pop()
  }
}

function createEyesOutOfNothingAndPutThemIntoABox() {
  eyes = []
  background(0)

  const amount = floor(windowWidth / eyeWidth / 4)
  let xOff = windowWidth / amount / 2
  let yOff = windowHeight / amount / 2

  for (let x = 0; x < amount; x++) {
    for (let y = 0; y < amount; y++) {
      eyes.push(
        new Eye(
          (x * windowWidth) / amount + xOff,
          (y * windowHeight) / amount + yOff,
          eyeWidth
        )
      )
    }
  }
}

class Ripple {
  pos: p5.Vector
  radius: number
  isComplete: boolean
  constructor(x: number, y: number) {
    this.pos = createVector(x, y)
    this.radius = 1
    this.isComplete = false
  }
  expand() {
    this.radius += 3
    eyes.forEach((eye) => {
      if (p5.Vector.sub(this.pos, eye.pos).mag() < this.radius) {
        if (!eye.hasBeenClosed) {
          eye.setIsOpen(true)
        }
      }
    })
    if (this.radius > sqrt(sq(windowHeight) + sq(windowWidth))) {
      this.isComplete = true
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  noStroke()
  createEyesOutOfNothingAndPutThemIntoABox()
}

function draw() {
  eyes.forEach((eye) => eye.draw())
  if (ripple && !ripple.isComplete) ripple.expand()
}

function mousePressed() {
  if (!ripple) {
    ripple = new Ripple(mouseX, mouseY)
  }
  if (ripple.isComplete) {
    const eyeThatIsStillOpenDespiteEveryOpportunityYouHad = eyes.find(
      (eye) => !eye.hasBeenClosed
    )
    if (!eyeThatIsStillOpenDespiteEveryOpportunityYouHad) {
      createEyesOutOfNothingAndPutThemIntoABox()
      ripple = new Ripple(mouseX, mouseY)
    }
  }
  let clickedEye = eyes.find(
    (eye) =>
      p5.Vector.sub(eye.pos, createVector(mouseX, mouseY)).mag() < eyeWidth
  )
  if (clickedEye && clickedEye.isOpen) {
    clickedEye.setHasBeenClosed(true)
  }
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    if (scleraFillIndex === scleraFills.length - 1) {
      scleraFills.push([random(255), random(255), random(255)])
    }
    scleraFillIndex++
  }
  if (keyCode === LEFT_ARROW && scleraFillIndex !== 0) {
    scleraFillIndex--
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  createEyesOutOfNothingAndPutThemIntoABox()
}
