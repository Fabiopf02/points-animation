import { Game } from './game.js'
import { Particles } from './particle.js'
import { Scene } from './scene.js'

const particleColorInput = document.getElementById('particleColor')
const lineColorInput = document.getElementById('lineColor')
const backgroundInput = document.getElementById('background')
const numberOfParticlesInput = document.getElementById('numberOfParticles')
const toggleGameBtn = document.getElementById('toggleGame')
const copyCodeBtn = document.getElementById('copyCode')
const mouseHoverInteractionInput = document.getElementById(
  'mouseHoverInteractionEnabled'
)
const screen = Scene.create({
  canvasId: 'game',
  background: '#000',
  lineColor: '#1f8e5a',
  particleColor: '#22ec66',
})
const game = Game.create({
  particles: Particles.create(300),
  screen,
  distanceBetweenParticlesToEdge: 150,
  numberOfParticles: 100,
  particleRadius: 3,
  lineWidth: 1.5,
})
game.start()

particleColorInput.addEventListener('change', (event) => {
  screen.setParticleColor(event.currentTarget.value)
})
lineColorInput.addEventListener('change', (event) => {
  screen.setEdgeColor(event.currentTarget.value)
})
backgroundInput.addEventListener('change', (event) => {
  screen.setBackground(event.currentTarget.value)
})
numberOfParticlesInput.addEventListener('change', (event) => {
  game.setNumberOfParticles(+event.currentTarget.value)
})
mouseHoverInteractionInput.addEventListener('change', (event) => {
  game.setMouseInteractionEnabled(event.currentTarget.checked)
})

toggleGameBtn.addEventListener('click', () => {
  if (game.getState() === 'running') {
    toggleGameBtn.innerText = 'Start'
    game.stop()
    return
  }
  toggleGameBtn.innerText = 'Stop'
  game.start()
})

copyCodeBtn.addEventListener('click', () => {
  const screenConfig = screen.getConfig()
  delete screenConfig.dimensions
  const gameConfig = game.getConfig()
  gameConfig.screen = 'screen'
  const code = `const screen = Scene.create(${JSON.stringify(
    screenConfig,
    null,
    2
  )})

const game = Game.create(${JSON.stringify(gameConfig, null, 2)})

game.start()
  `.replace('"screen",', 'screen,')
  navigator.clipboard.writeText(code)
})
