/**
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
 * @typedef {Object} ParticleData
 * @property {number} x
 * @property {number} y
 * @property {number} radius
 */

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

export { Scene }
