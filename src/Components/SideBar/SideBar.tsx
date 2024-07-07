import { HiUsers } from 'react-icons/hi2'
import { FaChartPie } from 'react-icons/fa6'
import { FaCalendar } from 'react-icons/fa'
import { IoImage } from 'react-icons/io5'
import { FaGear } from 'react-icons/fa6'
import { Link, useLocation } from 'react-router-dom'
import './SideBar.scss'
import { useEffect, useRef, useState } from 'react'
const sideBarNavItems = [
  {
    display: 'Users',
    icon: <HiUsers />,
    to: '/',
    section: 'user'
  },
  {
    display: 'Analytics',
    icon: <FaChartPie />,
    to: '/analytics',
    section: 'analytics'
  },
  {
    display: 'Calendar',
    icon: <FaCalendar />,
    to: '/calendar',
    section: 'calendar'
  },
  {
    display: 'Image',
    icon: <IoImage />,
    to: '/image',
    section: 'image'
  },
  {
    display: 'Setings',
    icon: <FaGear />,
    to: '/setings',
    section: 'setings'
  }
]

const SideBar = () => {
  const location = useLocation()
  const [activeIndex, setActiveIndex] = useState(0)
  const [stepHeight, setStepHeight] = useState(0)
  const sideBarRef = useRef<HTMLDivElement | null>(null)
  const indicatorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setTimeout(() => {
      const sideBarItem = sideBarRef.current?.querySelector('.sidebar__menu__item')
      if (indicatorRef.current != null) {
        indicatorRef.current.style.height = `${sideBarItem?.clientHeight}px`
      }
      setStepHeight(sideBarItem?.clientHeight || 0)
    }, 50)
  }, [])

  useEffect(() => {
    const currentPath = window.location.pathname.split('/')[1]
    const activeItem = sideBarNavItems.findIndex((item) => item.section === currentPath)
    setActiveIndex(currentPath.length === 0 ? 0 : activeItem)
  }, [location])

  return (
    <>
      <div className='sidebar'>
        <div className='sidebar__logo'>HRDept Company</div>
        <div ref={sideBarRef} className='sidebar__menu'>
          <div
            ref={indicatorRef}
            className='sidebar__menu__indicator'
            style={{
              transform: `translateX(-50%) translateY(${activeIndex * stepHeight}px`
            }}
          ></div>
          {sideBarNavItems.map((item, index) => {
            return (
              <Link to={item.to} key={index}>
                <div className={`sidebar__menu__item ${activeIndex === index ? 'active' : ''}`}>
                  <div className='sidebar__menu__item__icon'>{item.icon}</div>
                  <div className='sidebar__menu__item__text'>{item.display}</div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default SideBar
