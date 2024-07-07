import { MdOutlineArrowBackIos } from 'react-icons/md'
import { MdOutlineArrowForwardIos } from 'react-icons/md'
import { Link, createSearchParams, useLocation } from 'react-router-dom'
import './Pagiation.scss'
import { useEffect, useState } from 'react'
interface Props {
  pageAgument: number
  pageSize: number
}
const RANGE = 2

const Pagination = ({ pageAgument, pageSize }: Props) => {
  const [pageCurrent, setPageCurrent] = useState(pageAgument)
  const location = useLocation()
  useEffect(() => {
    const page = location.search.split('=')[1]
    if (page) {
      setPageCurrent(Number(page))
    }
  }, [location])

  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefor = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return <span key={index}>...</span>
      }
      return null
    }

    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return <span key={index}>...</span>
      }
      return null
    }
    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (pageCurrent <= RANGE * 2 + 1 && pageNumber > pageCurrent + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotAfter(index)
        } else if (pageCurrent > RANGE * 2 + 1 && pageCurrent < pageSize - RANGE * 2) {
          if (pageNumber < pageCurrent - RANGE && pageNumber > RANGE) {
            return renderDotBefor(index)
          } else if (pageNumber > pageCurrent + RANGE && pageNumber < pageSize - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (pageCurrent >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < pageCurrent - RANGE) {
          return renderDotBefor(index)
        }
        return (
          <Link
            to={{
              pathname: '/',
              search: createSearchParams({
                page: pageNumber.toString()
              }).toString()
            }}
            className={`${pageNumber === pageCurrent ? 'active' : ''} button`}
            key={index}
          >
            {pageNumber}
          </Link>
        )
      })
  }
  return (
    <>
      <div className='pagination-container'>
        {pageCurrent === 1 ? (
          <MdOutlineArrowBackIos style={{ cursor: 'not-allowed' }} />
        ) : (
          <Link
            to={{
              pathname: '/',
              search: createSearchParams({
                page: (pageCurrent - 1).toString()
              }).toString()
            }}
            className='button'
          >
            <MdOutlineArrowBackIos />
          </Link>
        )}
        {renderPagination()}
        {pageCurrent === pageSize ? (
          <MdOutlineArrowForwardIos style={{ cursor: 'not-allowed' }} />
        ) : (
          <Link
            to={{
              pathname: '/',
              search: createSearchParams({
                page: (pageCurrent + 1).toString()
              }).toString()
            }}
            className='button'
          >
            <MdOutlineArrowForwardIos />
          </Link>
        )}
      </div>
    </>
  )
}

export default Pagination
