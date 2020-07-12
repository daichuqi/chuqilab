import React, { useRef, useState, useEffect } from 'react'
import anime from 'animejs/lib/anime.es.js'

export default function() {
  const canvasRef = useRef()
  const [ctx, setCtx] = useState()
  const numberOfParticules = 30
  const colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C']

  useEffect(() => {
    if (!canvasRef || !canvasRef.current) {
      return
    }
    const ctx = canvasRef.current.getContext('2d')

    anime({
      duration: Infinity,
      update: () => ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height),
    })
    setCtx(ctx)
  }, [canvasRef])

  function setParticuleDirection(p) {
    var angle = (anime.random(0, 360) * Math.PI) / 180
    var value = anime.random(50, 180)
    var radius = [-1, 1][anime.random(0, 1)] * value
    return {
      x: p.x + radius * Math.cos(angle),
      y: p.y + radius * Math.sin(angle),
    }
  }

  function createParticule(x, y) {
    var p = {}
    p.x = x
    p.y = y
    p.color = colors[anime.random(0, colors.length - 1)]
    p.radius = anime.random(16, 32)
    p.endPos = setParticuleDirection(p)
    p.draw = function() {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true)
      ctx.fillStyle = p.color
      ctx.fill()
    }
    return p
  }

  function renderParticule(anim) {
    for (var i = 0; i < anim.animatables.length; i++) {
      anim.animatables[i].target.draw()
    }
  }

  function createCircle(x, y) {
    var p = {}
    p.x = x
    p.y = y
    p.color = '#FFF'
    p.radius = 0.1
    p.alpha = 0.5
    p.lineWidth = 6
    p.draw = () => {
      ctx.globalAlpha = p.alpha
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true)
      ctx.lineWidth = p.lineWidth
      ctx.strokeStyle = p.color
      ctx.stroke()
      ctx.globalAlpha = 1
    }
    return p
  }

  function animateParticules(x, y) {
    var particules = []
    for (var i = 0; i < numberOfParticules; i++) {
      particules.push(createParticule(x, y))
    }

    anime
      .timeline()
      .add({
        targets: particules,
        x: p => p.endPos.x,
        y: p => p.endPos.y,
        radius: 0.1,
        duration: anime.random(1200, 1800),
        easing: 'easeOutExpo',
        update: renderParticule,
      })
      .add(
        {
          targets: createCircle(x, y),
          radius: anime.random(80, 160),
          lineWidth: 0,
          alpha: {
            value: 0,
            easing: 'linear',
            duration: anime.random(600, 800),
          },
          duration: anime.random(1200, 1800),
          easing: 'easeOutExpo',
          update: renderParticule,
          offset: 0,
        },
        100
      )
  }

  return (
    <canvas
      style={{ backgroundColor: 'black' }}
      width={typeof window !== 'undefined' && window.innerWidth}
      height={typeof window !== 'undefined' && window.innerHeight}
      ref={canvasRef}
      onClick={e => {
        // render.play()
        const pointerX = e.clientX || e.touches[0].clientX
        const pointerY = e.clientY || e.touches[0].clientY

        anime({
          duration: Infinity,
          update: () => {
            if (ctx) {
              ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            }
          },
        })

        animateParticules(pointerX, pointerY)

        // implement draw on ctx here
      }}
    ></canvas>
  )
}
