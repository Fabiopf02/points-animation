/**
 * @typedef {Object} GameParams
 * @property {Scene} screen
 * @property {number} numberOfParticles
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

const MAX_NUMBER_OF_PARTICLES = 400

export const genenrateId = () => parseInt(Math.random() * Date.now())

/**
 * @param {ScreenDimensions} dimensions
 * @param {number} particleRadius
 */
export const generatePosition = (dimensions, particleRadius) => {
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
 * @param {import('./particle').Particle} particle1
 * @param {import('./particle').Particle} particle2
 */
export const getParticleDistance = (particle1, particle2) => {
  const a = particle1.getFrame()
  const b = particle2.getFrame()
  return Math.hypot(a.x - b.x, a.y - b.y)
}

/** @param {Number} value */
export const validateNumberOfParticles = (value) => {
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
export const getAlpha = (distance, maxDistance) => {
  if (distance <= maxDistance / 3) return 1
  return 1 - distance / maxDistance
}
