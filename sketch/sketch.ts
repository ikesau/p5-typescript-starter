let eyes: Eye[] = []

class Eye {
  pos: p5.Vector
  radius: number
  diameter: number
  constructor(x: number, y: number, radius: number) {
    this.pos = createVector(x, y)
    this.radius = radius
    this.diameter = radius * 2
  }
  draw() {
    push()
    translate(this.pos.x, this.pos.y)
    const yOffset = sin((11 / 6) * PI) * this.radius
    /**
     * We're moving around the circumference in sixths over/under PI and TWO_PI.
     * Ignoring the first 4 arguments, arc(PI, TWO_PI) is a semi-circle
     * This could also be written as arc((6 / 6) * PI, (12 / 6) * PI)
     * so arc((7 / 6) * PI, (11 / 6) * PI) is an arc that "begins" slightly later
     * and "ends" slightly earlier
     *
     * (11 / 6) * PI can be used as theta in a cartesian transformation
     * to work out the co-ordinates of the "end" of the arc
     *
     * The other 3 co-ordinates are just inverses of this co-ordinate (x,y), (-x,y), (x,-y), (-x,-y)
     *
     * By moving the origin of our arcs down by y, we'll make their "starts" and "ends" touch
     * creating the eyeball shape we're looking for
     *
     * It's hard to explain this. Try drawing some points at x,y to see what I mean.
     */

    fill(255)
    arc(0, -yOffset, this.diameter, this.diameter, (7 / 6) * PI, (11 / 6) * PI)
    arc(0, yOffset, this.diameter, this.diameter, (13 / 6) * PI, (5 / 6) * PI)

    // pupil
    fill(0)
    const translatedMouseX = mouseX - this.pos.x
    const translatedMouseY = mouseY - this.pos.y
    const pupilY = map(translatedMouseY, 0, windowHeight, 0, this.radius / 2)
    const pupilX = map(translatedMouseX, 0, windowWidth, 0, this.radius / 2)
    circle(pupilX, pupilY, this.radius / 1.5)

    pop()
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  noStroke()

  for (let i = 0; i < 10; i++) {
    eyes.push(new Eye(random(windowWidth), random(windowHeight), 25))
  }
}

function draw() {
  background(0)
  eyes.forEach((eye) => eye.draw())
}

function windowResized() {}
