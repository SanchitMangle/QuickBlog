import React, { useEffect, useRef, useState } from 'react'
import { assets, blogCategories } from '../../assets/assets'
import Quill from 'quill'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import {parse} from 'marked'

const Addblog = () => {

  const { axios } = useAppContext()
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)

  const [image, setImage] = useState(false)
  const [title, setTitle] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [category, setCategory] = useState('Startup')
  const [isPublished, setIsPublished] = useState(false)

  const editorRef = useRef(null)
  const quillRef = useRef(null)

  const generateContent = async () => {
    if (!title) return toast.error("Please Enter a Title")
    try {
      setLoading(true)
      const { data } = await axios.post('/api/blog/generate', { prompt: title })
      if (data.success) {
        quillRef.current.root.innerHTML = parse(data.content)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
    finally{
      setLoading(false)
    }
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsAdding(true)
      const blog = {
        title, subTitle,
        description: quillRef.current.root.innerHTML,
        category, isPublished
      }

      const formData = new FormData()
      formData.append('blog', JSON.stringify(blog))
      formData.append('image', image)

      const { data } = await axios.post('/api/blog/add', formData)
      if (data.success) {
        toast.success(data.message)
        setTitle('')
        setCategory('')
        setImage(false)
        quillRef.current.root.innerHTML = ''
      }
      else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    } finally {
      setIsAdding(false)
    }

  }

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow'
      })
    }
  }, [])

  return (
    <form onSubmit={onSubmitHandler} className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll'>
      <div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded'>

        <p>Upload Thumbnail</p>
        <label htmlFor="image">
          <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" className='mt-2 h-16 rounded cursor-pointer' />
          <input onChange={(e) => setImage(e.target.files[0])}
            type="file" hidden id='image' required />
        </label>

        <p className='mt-4'>Blog Title</p>
        <label htmlFor="title">
          <input onChange={(e) => setTitle(e.target.value)} value={title}
            type="text" id='title' className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' />
        </label>

        <p className='mt-4'>Blog SubTitle</p>
        <label htmlFor="subTitle">
          <input onChange={(e) => setSubTitle(e.target.value)} value={subTitle}
            type="text" id='subTitle' className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' />
        </label>

        <p className='mt-4'>Blog Description</p>
        <div className='max-w-lg h-74 pn-16 sm:pb-10 pt-2 relative'>
          <div ref={editorRef}></div>
          {loading && (
            <div className='absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black/10 mt-2'>
                <div className='w-8 h-8 rounded-full border-2 border-t-white animate-spin'></div>
            </div>
          )}
          <button disabled = {loading} type='button' onClick={generateContent}
            className='absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer'>Generate with AI </button>
        </div>

        <p className='mt-4'>Blog Category</p>
        <select onChange={(e) => setCategory(e.target.value)} name="category" className='mt-2 py-2 px-3 border text-gray-500 border-gray-300 outline-none rounded'>
          <option value="">Select Category</option>
          {
            blogCategories.map((category, index) => {
              return <option key={index} value={category}>{category}</option>
            })
          }
        </select>

        <div className='flex gap-2 mt-4'>
          <p>Publish Now</p>
          <input onChange={(e) => setIsPublished(e.target.checked)}
            type="checkbox" checked={isPublished} className='scale-125 cursor-pointer' />
        </div>
        <button disabled={isAdding} type="submit" className='w-40 h-10 mt-8 bg-primary text-white rounded cursor-pointer text-sm'>{isAdding ? 'Adding...' : 'Add Blog'}</button>
      </div>
    </form>
  )
}

export default Addblog
