/**
 * @typedef {Object} ScreenLimits
 * @property {number} x
 * @property {number} y
 *
 * @typedef {Object} GameParams
 * @property {Scene} screen
 * @property {number} numberOfParticles
 * @property {number} distanceBetweenParticlesToEdge
 * @property {number} particleRadius
 * @property {number} lineWidth
 *
 * @typedef {Object} ParticleParams
 * @property {Position} position
 * @property {number} radius
 *
 * @typedef {Object} Position
 * @property {number} x
 * @property {number} y
 *
 * @typedef {Object} ScreenParams
 * @property {string} canvasId
 * @property {string} background
 * @property {string} lineColor
 * @property {string} particleColor
 *
 * @typedef {Object} ScreenDimensions
 * @property {number} width
 * @property {number} height
 *
 * @typedef {Object} ParticleData
 * @property {number} x
 * @property {number} y
 * @property {number} radius
 */

const MAX_NUMBER_OF_PARTICLES = 400

/**
 * @param {ScreenDimensions} dimensions
 * @param {number} particleRadius
 */
const generatePosition = (dimensions, particleRadius) => {
  const x = Math.random() * (dimensions.width - particleRadius) + particleRadius
  const y =
    Math.random() * (dimensions.height - particleRadius) + particleRadius
  return {
    x,
    y,
  }
}

/**
 *
 * @param {Particle} particle1
 * @param {Particle} particle2
 */
const getParticleDistance = (particle1, particle2) => {
  const a = particle1.getFrame()
  const b = particle2.getFrame()
  return Math.hypot(a.x - b.x, a.y - b.y)
}

/** @param {Number} value */
const validateNumberOfParticles = (value) => {
  if (value > MAX_NUMBER_OF_PARTICLES) {
    throw new Error('Number of particles exceeds the maximum limit.')
  }
  return value
}

/**
 * @param {number} distance
 * @param {number} maxDistance
 * @returns {number}
 */
const getAlpha = (distance, maxDistance) => {
  if (distance <= maxDistance / 3) return 1
  return 1 - distance / maxDistance
}

class Scene {
  #ctx
  #width
  #height
  #lineColor
  #particleColor
  #backgroundColor
  #endAngle = Math.PI * 2
  /** @type HTMLCanvasElement  */
  #canvas

  /** @param {ScreenParams} params */
  constructor(params) {
    /** @type HTMLCanvasElement */
    this.#setupCanvas(params)
    this.#ctx = this.#canvas.getContext('2d')
    this.#lineColor = params.lineColor
    this.#particleColor = params.particleColor
  }

  getConfig() {
    return {
      canvasId: this.#canvas.id,
      background: this.#backgroundColor,
      lineColor: this.#lineColor,
      particleColor: this.#particleColor,
      dimensions: this.getDimensions(),
    }
  }

  getDimensions() {
    return {
      width: this.#width,
      height: this.#height,
    }
  }

  /** @param {ScreenParams} params */
  #setupCanvas(params) {
    this.#canvas = document.getElementById(params.canvasId)
    this.#canvas.style.backgroundColor = this.#backgroundColor =
      params.background

    const dimensions = () => {
      const { width, height } = this.#canvas.getClientRects()[0]
      this.#canvas.width = this.#width = width
      this.#canvas.height = this.#height = height
    }

    window.addEventListener('resize', dimensions)

    dimensions()
  }

  /** @param {ScreenParams} params */
  static create(params) {
    return new Scene(params)
  }

  getCanvas() {
    return this.#canvas
  }

  clear() {
    this.#ctx.clearRect(0, 0, this.#width, this.#height)
  }

  /**
   * @param {ParticleData} particle
   */
  drawParticle(particle) {
    this.#ctx.beginPath()
    this.#ctx.globalAlpha = 1
    this.#ctx.fillStyle = this.#particleColor
    this.#ctx.arc(particle.x, particle.y, particle.radius, 0, this.#endAngle)
    this.#ctx.fill()
    this.#ctx.closePath()
  }

  /**
   * @param {number} lineWidth
   * @param {Position} posA
   * @param {Position} posB
   * @param {number} alpha
   */
  drawEdge(lineWidth, posA, posB, alpha) {
    this.#ctx.beginPath()
    this.#ctx.globalAlpha = alpha
    this.#ctx.strokeStyle = this.#lineColor
    this.#ctx.lineWidth = lineWidth
    this.#ctx.moveTo(posA.x, posA.y)
    this.#ctx.lineTo(posB.x, posB.y)
    this.#ctx.stroke()
    this.#ctx.closePath()
  }

  /** @param {string} color */
  setEdgeColor(color) {
    this.#lineColor = color
  }

  /** @param {string} color */
  setParticleColor(color) {
    this.#particleColor = color
  }

  /** @param {string} color */
  setBackground(color) {
    this.#canvas.style.backgroundColor = color
  }
}

class Particle {
  #radius
  #x
  #y
  /** @type number */
  #vX
  /** @type number */
  #vY
  #positionTolerance

  /**
   * @param {ParticleParams} params
   */
  constructor(params) {
    this.#positionTolerance = 50
    this.#radius = params.radius
    this.#x = params.position.x
    this.#y = params.position.y
    this.restart()
  }

  /** @param {ParticleParams} params */
  static create(params) {
    return new Particle(params)
  }

  /** @param {ScreenLimits} limits */
  nextFrame(limits) {
    const leftX = this.#x + this.#radius + this.#positionTolerance
    const rightX = this.#x - this.#radius - this.#positionTolerance
    if (rightX >= limits.x || leftX < 0) {
      this.#invertX()
    }
    const topY = this.#y + this.#radius + this.#positionTolerance
    const bottomY = this.#y - this.#radius - this.#positionTolerance
    if (bottomY > limits.y || topY < 0) {
      this.#invertY()
    }
    this.#x += this.#vX
    this.#y += this.#vY
  }

  #invertX() {
    this.#vX *= -1
  }

  #invertY() {
    this.#vY *= -1
  }

  restart() {
    const speed = Math.random()
    this.#vX = Math.random() > 0.4 ? speed : speed * -1
    this.#vY = Math.random() > 0.4 ? speed : speed * -1
  }

  getX() {
    return this.#x
  }
  getY() {
    return this.#y
  }

  /** @param {number} pos */
  setX(pos) {
    this.#x = pos
  }
  /** @param {number} pos */
  setY(pos) {
    this.#y = pos
  }

  getFrame() {
    return {
      x: this.getX(),
      y: this.getY(),
      radius: this.#radius,
    }
  }
}

class Game {
  /** @type Particle[] */
  #particles = []
  #screen
  #lineWidth
  #distanceBetweenParticlesToEdge
  #animationFrameId = null
  #particleRadius
  #mouseHoverInteractionEnabled = false

  /** @param {GameParams} params */
  constructor(params) {
    this.#screen = params.screen
    this.#lineWidth = params.lineWidth
    this.#particleRadius = params.particleRadius
    this.#distanceBetweenParticlesToEdge = params.distanceBetweenParticlesToEdge
    this.#particles = Game.generateParticles(
      validateNumberOfParticles(params.numberOfParticles),
      this.#screen.getDimensions(),
      this.#particleRadius
    )
    this.setMouseInteractionEnabled(this.#mouseHoverInteractionEnabled)
  }

  /** @param {GameParams} params */
  static create(params) {
    return new Game(params)
  }

  getConfig() {
    return {
      screen: this.#screen,
      distanceBetweenParticlesToEdge: this.#distanceBetweenParticlesToEdge,
      numberOfParticles: this.#particles.length,
      lineWidth: this.#lineWidth,
      particleRadius: this.#particleRadius,
    }
  }

  /** @param {number} value */
  setNumberOfParticles(value) {
    validateNumberOfParticles(value)

    const currentValue = this.#particles.length
    this.stop()
    if (value < currentValue) {
      this.#particles.splice(0, currentValue - value)
    } else {
      this.#particles.push(
        ...Game.generateParticles(
          value - currentValue,
          this.#screen.getDimensions(),
          this.#particleRadius
        )
      )
    }
    this.start()
    return this
  }

  /** @param {number} radius */
  particleRadius(radius) {
    this.#particleRadius = radius
    this.restart()
    return this
  }

  /**
   * @param {number} numberOfParticles
   * @param {ScreenDimensions} dimensions
   * @param {number} particleRadius
   * */
  static generateParticles(numberOfParticles, dimensions, particleRadius) {
    const vertices = []
    for (let i = 0; i < numberOfParticles; i++) {
      vertices.push(
        Particle.create({
          position: generatePosition(dimensions, particleRadius),
          radius: particleRadius,
        })
      )
    }
    return vertices
  }

  /** @param {Particle} currentParticle */
  #updateEdges(currentParticle) {
    this.#particles.forEach((particle) => {
      const distance = getParticleDistance(currentParticle, particle)
      if (distance <= this.#distanceBetweenParticlesToEdge) {
        const alpha = getAlpha(distance, this.#distanceBetweenParticlesToEdge)
        this.#screen.drawEdge(
          this.#lineWidth,
          currentParticle.getFrame(),
          particle.getFrame(),
          alpha
        )
      }
    })
  }

  #update() {
    this.#screen.clear()
    this.#particles.forEach((particle) => {
      this.#updateEdges(particle)
      particle.nextFrame({
        x: this.#screen.getDimensions().width,
        y: this.#screen.getDimensions().height,
      })
      this.#screen.drawParticle(particle.getFrame())
    })
  }

  #onMouseMoveParticle = ({ clientX, clientY }) => {
    const firstParticle = this.#particles[0]
    firstParticle.setX(clientX)
    firstParticle.setY(clientY)
  }

  /**
   * @param {boolean} enabled
   */
  setMouseInteractionEnabled(enabled) {
    this.#mouseHoverInteractionEnabled = enabled
    const canvas = this.#screen.getCanvas()
    if (enabled) {
      canvas.addEventListener('mousemove', this.#onMouseMoveParticle)
    } else {
      canvas.removeEventListener('mousemove', this.#onMouseMoveParticle)
    }
    return this
  }

  getState() {
    return this.#animationFrameId ? 'running' : 'stopped'
  }

  start() {
    const loop = () => {
      this.#update()
      this.#animationFrameId = requestAnimationFrame(loop)
    }
    this.#animationFrameId = requestAnimationFrame(loop)
  }

  stop() {
    if (this.#animationFrameId) {
      cancelAnimationFrame(this.#animationFrameId)
      this.#animationFrameId = null
    }
  }

  restart() {
    this.stop()
    this.start()
  }

  destroy() {
    this.stop()
    this.#screen.clear()
  }
}

export { Game, Scene, Particle }
