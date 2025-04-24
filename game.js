import { Particle, Particles } from './particle.js'
import {
  generatePosition,
  getParticleDistance,
  validateNumberOfParticles,
  getAlpha,
} from './internals.js'

/**
 * @typedef {Object} GameParams
 * @property {Scene} screen
 * @property {number} particles
 * @property {number} distanceBetweenParticlesToEdge
 * @property {number} particleRadius
 * @property {number} lineWidth
 *
 * @typedef {Object} Position
 * @property {number} x
 * @property {number} y
 *
 * @typedef {Object} ScreenDimensions
 * @property {number} width
 * @property {number} height
 */

class Game {
  /** @type Particles */
  #particles
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
    this.#particles = params.particles
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
    this.stop()
    this.#particles.resize(value)
    this.start()
    return this
  }

  /** @param {number} radius */
  particleRadius(radius) {
    this.#particleRadius = radius
    this.restart()
    return this
  }

  /** @param {Particle} currentParticle */
  #updateEdges(currentParticle) {
    this.#particles.getParticles().forEach((particle) => {
      const distance = getParticleDistance(currentParticle, particle)
      if (distance <= this.#distanceBetweenParticlesToEdge) {
        this.#particles.addEdge(currentParticle.getId(), particle.getId())
        const alpha = getAlpha(distance, this.#distanceBetweenParticlesToEdge)
        this.#screen.drawEdge(
          this.#lineWidth,
          currentParticle.getFrame(),
          particle.getFrame(),
          alpha
        )
      } else {
        this.#particles.removeEdge(currentParticle.getId(), particle.getId())
      }
    })
  }

  #update() {
    this.#screen.clear()
    this.#particles.getParticles().forEach((particle) => {
      this.#updateEdges(particle)
      particle.nextFrame({
        x: this.#screen.getDimensions().width,
        y: this.#screen.getDimensions().height,
      })
      this.#screen.drawParticle(particle.getFrame())
    })
  }

  #onMouseMoveParticle = ({ clientX, clientY }) => {
    const firstParticle = this.#particles.getParticleByIndex(0)
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

export { Game }
