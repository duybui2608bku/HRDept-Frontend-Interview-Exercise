import SideBar from 'src/Components/SideBar/SideBar'
import { RiImageCircleFill } from 'react-icons/ri'

import './Home.scss'
import TableUser from 'src/Components/TableUser/TableUser'
const Home = () => {
  return (
    <>
      <div className='home'>
        <div className='home__menubar'>
          <SideBar />
        </div>
        <div className='home__data'>
          <div className='home__data__header'>
            <div className='home__data__header__logo'></div>
            <div className='home__data__header__user'>
              <div className='home__data__header__user__name'>BUI NHAT DUY</div>
              <div className='home__data__header__user__avatar'>
                <RiImageCircleFill size={40} />
              </div>
            </div>
          </div>
          <div className='home__data__table'>
            <TableUser />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
