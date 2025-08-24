import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import BlogTableItems from '../../components/admin/BlogTableItems'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Dashboard = () => {

  const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    comments: 0,
    drafts: 0,
    recentBlogs: []
  })

  const {axios} = useAppContext()

  const fetchDashboardData = async () => {
    try {
      const {data} = await axios.get('/api/admin/dashboard')
      if (data.success) {
        setDashboardData(data.dashboardData)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
       toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return (
    <div className='flex-1 p-4 md:p-10 bg-blue-50/50'>

      <div className='flex flex-wrap gap-4'>

        <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all '>
          <img src={assets.dashboard_icon_1} alt="" />
          <div>
            <p className='text-xl font-semibold'>{dashboardData.blogs}</p>
            <p className='text-gray-400 font-light'>Blogs</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all '>
          <img src={assets.dashboard_icon_2} alt="" />
          <div>
            <p className='text-xl font-semibold'>{dashboardData.comments}</p>
            <p className='text-gray-400 font-light'>Comments</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all '>
          <img src={assets.dashboard_icon_3} alt="" />
          <div>
            <p className='text-xl font-semibold'>{dashboardData.drafts}</p>
            <p className='text-gray-400 font-light'>Drafts</p>
          </div>
        </div>

      </div>

      <div>
        <div className='flex items-center gap-3 mt-6 m-4 text-gray-600'>
          <img src={assets.dashboard_icon_4} alt="" />
          <p>Latest Blogs</p>
        </div>
        <div className='relative max-w-4xl overflow-x-auto rounded-lg shadow scrollbar-hide bg-white'>
          <table className='w-full text-md text-gray-500'>
            <thead className='text-xs text-gray-600 text-left uppercase'>
              <tr>
                <th scope='col' className='px-2 py-4 xl:px-6'> # </th>
                <th scope='col' className='px-2 py-4'>BLOG TITLE</th>
                <th scope='col' className='px-2 py-4 max-sm:hidden'>DATE</th>
                <th scope='col' className='px-2 py-4 max-sm:hidden'>STATUS</th>
                <th scope='col' className='px-2 py-4'>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {
                dashboardData.recentBlogs.map((blog,index)=>{
                    return <BlogTableItems key={blog._id} blog={blog} fetchBlogs={fetchDashboardData} index={index+1}/>
                })
              }
            </tbody>
          </table>

        </div>
      </div>

    </div>
  )
}

export default Dashboard
