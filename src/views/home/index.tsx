import './home.css'
import styles from './styles.module.css'
import { useTrail, animated } from '@react-spring/web'
import useMeasure from 'react-use-measure'
import { useNavigate } from 'react-router-dom'

const fast = { tension: 1200, friction: 40 }
const slow = { mass: 10, tension: 200, friction: 50 }
const trans = (x: number, y: number) =>
  `translate3d(${x}px,${y}px,0) translate3d(-50%,-50%,0)`

export const Home = () => {
  const navigate = useNavigate()
  const [trail, api] = useTrail(3, i => ({
    xy: [0, 0],
    config: i === 0 ? fast : slow,
  }))
  const [ref, { left, top }] = useMeasure()
  const [buttonRef, { left: buttonLeft, top: buttonTop, width: buttonWidth, height: buttonHeight }] = useMeasure()

  const handleMouseMove = (e: any) => {
    api.start({ xy: [e.clientX - left, e.clientY - top] })
  }

  const handleButtonClick = () => {
    const buttonPositionX = buttonLeft + buttonWidth / 2 + window.pageXOffset;
    const buttonPositionY = buttonTop + buttonHeight / 2 + window.pageYOffset;
    api.start({ xy: [buttonPositionX, buttonPositionY] })
    const jwt = localStorage.getItem('jwt')
    jwt ? navigate('/intial') : navigate('/register')
  }

  return (
    <>
      <div className={`h_wrapper ${styles.container}`}>
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="30" />
            <feColorMatrix
              in="blur"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 30 -7"
            />
          </filter>
        </svg>
        <div ref={ref} className={styles.hooksMain} onMouseMove={handleMouseMove}>
          {trail.map((props, index) => (
            <animated.div key={index} style={{ transform: props.xy.to(trans) }} />
          ))}
        </div>
        <div className="h_header  lg:text-left  lg:items-center lg:justify-between text-black dark:text-white transition-colors duration-500 in-out-quad">
          <h1 className='h_header_txt text-2xl lg:text-4xl mb-5'>
            welcome to charge-mate
          </h1>
          <p className='h_header_txt2 text-sm lg:text-base'>You and your family's charge tracking system</p>
        </div>


        <div className="h_btn_wrap" ref={buttonRef}>
          <button className='h_btn text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl' onClick={handleButtonClick}>
            Get started
            <span className="overlay"></span> {/* This span is used to create the expanding effect */}</button>
        </div>
      </div>
    </>
  );
}
