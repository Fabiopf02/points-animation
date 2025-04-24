import { genenrateId, generatePosition } from './internals.js'

/**
 * @typedef {Object} ScreenLimits
 * @property {number} x
 * @property {number} y
 *
 * @typedef {Object} ParticleParams
 * @property {Position} position
 * @property {number} radius
 *
 * @typedef {Object} Position
 * @property {number} x
 * @property {number} y
 */

class Particle {
  #id
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
    this.#id = genenrateId()
    this.#positionTolerance = 70
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

  getId() {
    return this.#id
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

class Particles {
  /** @type Particle[] */
  #particles = []
  #edges = new Set()

  /** @type Particle[] */
  constructor(particles) {
    this.#particles = particles
  }

  /**
   * @param {Number} value
   */
  static create(value) {
    return new Particles(Particles.generateParticles(value, 3))
  }

  /** @param {Particle[]} particles */
  setParticles(particles) {
    this.#particles = particles
  }

  /**
   * @param {number} numberOfParticles
   * @param {ScreenDimensions} dimensions
   * @param {number} particleRadius
   * */
  static generateParticles(numberOfParticles, particleRadius) {
    const particles = []
    for (let i = 0; i < numberOfParticles; i++) {
      particles.push(
        Particle.create({
          position: generatePosition(
            {
              width: window.innerWidth,
              height: window.innerHeight,
            },
            particleRadius
          ),
          radius: particleRadius,
        })
      )
    }
    return particles
  }

  /**
   * @param {Number} index
   */
  getParticleByIndex(index) {
    return this.#particles[index]
  }

  /**
   * @param {Number} id1
   * @param {Number} id2
   * @returns
   */
  #prepareEdgeId(id1, id2) {
    return id1 + id2
  }

  edges() {
    return this.#edges
  }

  lengths() {
    return {
      edges: this.#edges.size,
      particles: this.#particles.length,
    }
  }

  /**
   * @param {number} size
   */
  resize(size) {
    const totalParticles = this.lengths().particles
    if (size < totalParticles) {
      this.#particles.splice(0, totalParticles - size)
    } else {
      this.#particles.push(
        ...Particles.generateParticles(size - totalParticles, 3)
      )
    }
  }

  /**
   * @param {Number} particleId1
   * @param {Number} particleId2
   */
  addEdge(particleId1, particleId2) {
    if (!this.hasEdge(particleId1, particleId2)) {
      this.#edges.add(this.#prepareEdgeId(particleId1, particleId2))
    }
  }

  /**
   * @param {Number} particleId1
   * @param {Number} particleId2
   */
  hasEdge(particleId1, particleId2) {
    return this.#edges.has(this.#prepareEdgeId(particleId1, particleId2))
  }

  /**
   * @param {Number} particleId1
   * @param {Number} particleId2
   */
  removeEdge(particleId1, particleId2) {
    if (this.hasEdge(particleId1, particleId2)) {
      return this.#edges.delete(this.#prepareEdgeId(particleId1, particleId2))
    }
  }

  getParticles() {
    return this.#particles
  }
}

export { Particle, Particles }
