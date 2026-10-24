import { motion, useReducedMotion } from 'motion/react'

const PETALS = [
  { left: '6%', top: '18%', size: 16, rotate: -22, drift: 20, spin: 24, duration: 26, delay: 0, opacity: 0.5, tone: 'rose' },
  { left: '18%', top: '72%', size: 12, rotate: 34, drift: -16, spin: -30, duration: 22, delay: 2.5, opacity: 0.45, tone: 'lilac' },
  { left: '31%', top: '30%', size: 10, rotate: 12, drift: 14, spin: 22, duration: 30, delay: 1.2, opacity: 0.4, tone: 'gold' },
  { left: '44%', top: '84%', size: 18, rotate: -40, drift: -20, spin: 28, duration: 28, delay: 3.4, opacity: 0.5, tone: 'rose' },
  { left: '55%', top: '12%', size: 13, rotate: 26, drift: 18, spin: -24, duration: 24, delay: 4.2, opacity: 0.42, tone: 'lilac' },
  { left: '67%', top: '62%', size: 15, rotate: -12, drift: -22, spin: 26, duration: 32, delay: 0.8, opacity: 0.46, tone: 'rose' },
  { left: '78%', top: '26%', size: 11, rotate: 48, drift: 16, spin: -20, duration: 21, delay: 5, opacity: 0.38, tone: 'gold' },
  { left: '88%', top: '78%', size: 17, rotate: -30, drift: -14, spin: 30, duration: 29, delay: 2, opacity: 0.44, tone: 'rose' },
  { left: '24%', top: '48%', size: 9, rotate: 18, drift: 12, spin: 18, duration: 25, delay: 6, opacity: 0.34, tone: 'gold' },
  { left: '72%', top: '88%', size: 10, rotate: -54, drift: 15, spin: -22, duration: 27, delay: 3, opacity: 0.36, tone: 'lilac' },
]

const MOTES = [
  { left: '12%', top: '24%', size: 5, drift: 12, duration: 16, delay: 0, opacity: 0.6 },
  { left: '22%', top: '68%', size: 3, drift: -10, duration: 13, delay: 1.5, opacity: 0.45 },
  { left: '35%', top: '40%', size: 4, drift: 8, duration: 19, delay: 3, opacity: 0.55 },
  { left: '48%', top: '18%', size: 3, drift: -12, duration: 15, delay: 2.2, opacity: 0.4 },
  { left: '58%', top: '74%', size: 5, drift: 10, duration: 18, delay: 4, opacity: 0.6 },
  { left: '66%', top: '34%', size: 3, drift: -8, duration: 14, delay: 0.8, opacity: 0.45 },
  { left: '76%', top: '56%', size: 4, drift: 14, duration: 20, delay: 2.6, opacity: 0.5 },
  { left: '84%', top: '22%', size: 3, drift: -10, duration: 17, delay: 5, opacity: 0.4 },
  { left: '90%', top: '64%', size: 5, drift: 9, duration: 15, delay: 1.2, opacity: 0.55 },
  { left: '42%', top: '90%', size: 3, drift: -12, duration: 21, delay: 3.8, opacity: 0.4 },
  { left: '18%', top: '86%', size: 4, drift: 10, duration: 18, delay: 5.5, opacity: 0.45 },
  { left: '62%', top: '8%', size: 3, drift: -9, duration: 16, delay: 2, opacity: 0.38 },
]

export function AmbientBackground() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="ambient" aria-hidden="true">
      <motion.span
        className="ambient__orb ambient__orb--one"
        animate={reduceMotion ? undefined : { x: [0, 26, -14, 0], y: [0, -22, 18, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="ambient__orb ambient__orb--two"
        animate={reduceMotion ? undefined : { x: [0, -18, 24, 0], y: [0, 20, -16, 0], scale: [1, 0.95, 1.06, 1] }}
        transition={{ duration: 42, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="ambient__orb ambient__orb--three"
        animate={reduceMotion ? undefined : { x: [0, -22, 12, 0], y: [0, -14, 20, 0], scale: [1, 1.05, 0.97, 1] }}
        transition={{ duration: 38, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="ambient__petals">
        {PETALS.map((petal, index) => (
          <motion.span
            key={`petal-${index}`}
            className={`ambient__petal ambient__petal--${petal.tone}`}
            style={{
              left: petal.left,
              top: petal.top,
              width: petal.size,
              height: Math.round(petal.size * 0.74),
              opacity: petal.opacity,
              rotate: petal.rotate,
            }}
            animate={
              reduceMotion
                ? undefined
                : {
                    y: [0, -16, 4, 0],
                    x: [0, petal.drift, -petal.drift * 0.6, 0],
                    rotate: [petal.rotate, petal.rotate + petal.spin, petal.rotate - petal.spin * 0.4, petal.rotate],
                    opacity: [petal.opacity * 0.55, petal.opacity, petal.opacity * 0.7, petal.opacity * 0.55],
                  }
            }
            transition={{
              duration: petal.duration,
              delay: petal.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="ambient__motes">
        {MOTES.map((mote, index) => (
          <motion.span
            key={`mote-${index}`}
            className="ambient__mote"
            style={{
              left: mote.left,
              top: mote.top,
              width: mote.size,
              height: mote.size,
              opacity: mote.opacity,
            }}
            animate={
              reduceMotion
                ? undefined
                : {
                    y: [0, -24, -8, 0],
                    x: [0, mote.drift, -mote.drift, 0],
                    opacity: [mote.opacity * 0.35, mote.opacity, mote.opacity * 0.55, mote.opacity * 0.35],
                    scale: [1, 1.35, 0.9, 1],
                  }
            }
            transition={{
              duration: mote.duration,
              delay: mote.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  )
}
