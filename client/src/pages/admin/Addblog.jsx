import React, { useEffect, useRef, useState } from 'react'
import { blogCategories } from '../../assets/assets'
import Quill from 'quill'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { parse } from 'marked'
import { UploadCloud, Sparkles, Wand2, Search, PenTool } from 'lucide-react'

const Addblog = () => {

  const { axios } = useAppContext()
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [seoLoading, setSeoLoading] = useState(false);

  const [image, setImage] = useState(false)
  const [title, setTitle] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [category, setCategory] = useState('Startup')
  const [isPublished, setIsPublished] = useState(false)

  // AI Controls
  const [tone, setTone] = useState('Professional');
  const [audience, setAudience] = useState('General');

  // SEO Data
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [keywords, setKeywords] = useState('');

  const editorRef = useRef(null)
  const quillRef = useRef(null)

  const generateContent = async () => {
    if (!title) return toast.error("Please Enter a Title")
    try {
      setLoading(true)
      const { data } = await axios.post('/api/ai/generate', {
        topic: title,
        tone,
        audience
      })
      if (data.success) {
        quillRef.current.root.innerHTML = parse(data.content)
        toast.success("Content Generated!")
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
    finally {
      setLoading(false)
    }
  }

  const optimizeSeo = async () => {
    const content = quillRef.current.root.innerText;
    if (!content || content.length < 50) return toast.error("Please write some content first");

    try {
      setSeoLoading(true);
      const { data } = await axios.post('/api/ai/optimize', { content, title });
      if (data.success) {
        setSeoTitle(data.data.title);
        setSeoDesc(data.data.description);
        setKeywords(data.data.keywords.join(', '));
        toast.success("SEO Optimized!");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSeoLoading(false);
    }
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsAdding(true)
      const blog = {
        title, subTitle,
        description: quillRef.current.root.innerHTML,
        category, isPublished,
        seo: { title: seoTitle, description: seoDesc, keywords: keywords.split(',') }
      }

      const formData = new FormData()
      formData.append('blog', JSON.stringify(blog))
      formData.append('image', image)

      const { data } = await axios.post('/api/blog/add', formData)
      if (data.success) {
        toast.success(data.message)
        // Reset form
        setTitle('')
        setCategory('')
        setImage(false)
        quillRef.current.root.innerHTML = ''
        setSeoTitle('');
        setSeoDesc('');
        setKeywords('');
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
    <form onSubmit={onSubmitHandler} className='h-full flex flex-col gap-8 text-text-main pb-24'>

      {/* Header with Actions */}
      <div className="flex justify-between items-center bg-surface/50 border border-white/5 p-6 rounded-3xl backdrop-blur-2xl shadow-xl sticky top-4 z-40">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/10">
            <PenTool size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-outfit tracking-tight">Create Post</h2>
            <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Saving Draft...
            </div>
          </div>
        </div>
        <button disabled={isAdding} type="submit"
          className='px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:scale-100 flex items-center gap-2'>
          {isAdding ? <><span className="animate-spin">↻</span> Publishing...</> : 'Publish Story'}
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">

        {/* Left Column: Editor Canvas */}
        <div className="flex-1 flex flex-col gap-6">

          {/* Title & Subtitle Section */}
          <div className="bg-surface/50 border border-white/5 p-8 rounded-3xl backdrop-blur-md space-y-6 shadow-lg">
            <div className="group">
              <input
                onChange={(e) => setTitle(e.target.value)} value={title}
                type="text"
                placeholder="Title of your story..."
                className='w-full bg-transparent border-none outline-none text-4xl md:text-5xl font-bold font-outfit placeholder-text-muted/30 focus:placeholder-text-muted/10 transition-colors'
              />
              <div className="h-1 w-20 bg-primary/50 mt-4 rounded-full group-focus-within:w-full transition-all duration-700"></div>
            </div>

            <input
              onChange={(e) => setSubTitle(e.target.value)} value={subTitle}
              type="text"
              placeholder="Write a subtitle..."
              className='w-full bg-transparent border-none outline-none text-xl md:text-2xl text-text-muted placeholder-text-muted/30 font-medium'
            />
          </div>

          {/* Rich Text Editor */}
          <div className='bg-surface border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative min-h-[600px] flex flex-col'>

            {/* AI Control Bar */}
            <div className="bg-surface-glass border-b border-white/5 p-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-primary/10 rounded-full text-xs font-bold text-primary flex items-center gap-2 border border-primary/10">
                  <Sparkles size={12} /> AI ASSISTANT
                </div>

                <div className="flex gap-2">
                  <select value={tone} onChange={(e) => setTone(e.target.value)} className="text-xs bg-white/5 hover:bg-white/10 text-text-muted px-3 py-1.5 rounded-lg border border-white/5 focus:border-primary outline-none transition-colors cursor-pointer">
                    <option>Professional</option>
                    <option>Casual</option>
                    <option>Humorous</option>
                    <option>Persuasive</option>
                  </select>
                  <select value={audience} onChange={(e) => setAudience(e.target.value)} className="text-xs bg-white/5 hover:bg-white/10 text-text-muted px-3 py-1.5 rounded-lg border border-white/5 focus:border-primary outline-none transition-colors cursor-pointer">
                    <option>General</option>
                    <option>Developers</option>
                    <option>Designers</option>
                    <option>Business</option>
                  </select>
                </div>
              </div>

              <button type='button' onClick={generateContent} disabled={loading}
                className='text-xs bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center gap-2 font-bold'>
                <Wand2 size={14} />
                <span>Auto-Draft Content</span>
              </button>
            </div>

            {/* Editor Area */}
            <div className='flex-1 relative bg-background/30'>
              <div ref={editorRef} className='h-full min-h-[600px] p-4 md:p-8 [&_.ql-editor]:text-lg [&_.ql-editor]:leading-relaxed [&_.ql-editor]:font-outfit/90'></div>
              {loading && (
                <div className='absolute inset-0 flex flex-col items-center justify-center bg-surface/60 backdrop-blur-md z-20'>
                  <div className="relative">
                    <div className='w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin'></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles size={24} className="text-primary animate-pulse" />
                    </div>
                  </div>
                  <p className="text-primary font-bold mt-6 tracking-widest text-xs uppercase animate-pulse">Generating Magic...</p>
                </div>
              )}
            </div>
          </div>

          {/* SEO Panel */}
          <div className="bg-surface border border-white/5 p-8 rounded-3xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div className='flex items-center gap-3'>
                <div className="p-2 bg-green-500/10 rounded-xl text-green-500">
                  <Search size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-text-main text-lg">SEO Optimization</h3>
                  <p className="text-xs text-text-muted">Rank higher on search engines</p>
                </div>
              </div>
              <button type="button" onClick={optimizeSeo} disabled={seoLoading}
                className="text-xs bg-green-500/10 hover:bg-green-500/20 text-green-500 px-4 py-2 rounded-xl transition flex items-center gap-2 border border-green-500/20 font-bold">
                {seoLoading ? <span className='animate-spin'>↻</span> : <><Sparkles size={14} /> <span>Analyze & Optimize</span></>}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-text-muted uppercase mb-2 block ml-1">Meta Title</label>
                <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full p-4 bg-background/50 border border-white/10 rounded-xl focus:border-green-500/50 outline-none transition text-sm font-medium text-green-400 placeholder-green-500/20" placeholder="AI Suggested Title will appear here..." />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-text-muted uppercase mb-2 block ml-1">Meta Description</label>
                <textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)}
                  className="w-full p-4 bg-background/50 border border-white/10 rounded-xl focus:border-green-500/50 outline-none transition text-sm text-text-muted placeholder-text-muted/30 resize-none h-24" placeholder="AI Suggested Description..." />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-text-muted uppercase mb-2 block ml-1">Keywords</label>
                <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)}
                  className="w-full p-4 bg-background/50 border border-white/10 rounded-xl focus:border-green-500/50 outline-none transition text-sm text-text-muted font-mono" placeholder="tag1, tag2, tag3..." />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Sidebar Settings */}
        <div className="w-full xl:w-96 flex flex-col gap-8">

          {/* Thumbnail Uploader */}
          <div className="bg-surface border border-white/5 p-6 rounded-3xl shadow-lg">
            <p className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              Cover Image
            </p>
            <label htmlFor="image" className="cursor-pointer border-2 border-dashed border-white/10 rounded-2xl h-64 flex flex-col items-center justify-center hover:bg-white/5 hover:border-primary/50 transition-all duration-300 overflow-hidden group relative">
              {image ? (
                <>
                  <img src={URL.createObjectURL(image)} alt="Thumbnail" className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700' />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm font-bold bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">Change Image</span>
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-8 h-8 text-text-muted group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-sm font-medium text-text-main mb-1">Click to upload</p>
                  <p className="text-xs text-text-muted">SVG, PNG, JPG or GIF</p>
                </div>
              )}
              <input onChange={(e) => setImage(e.target.files[0])} type="file" hidden id='image' required />
            </label>
          </div>

          {/* Publishing Settings */}
          <div className="bg-surface border border-white/5 p-6 rounded-3xl shadow-lg space-y-6">
            <div>
              <p className='font-bold text-lg mb-4 flex items-center gap-2'>
                <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                Category
              </p>
              <div className="relative">
                <select onChange={(e) => setCategory(e.target.value)} value={category}
                  className='w-full py-3 px-4 bg-background/50 border border-white/10 rounded-xl outline-none focus:border-purple-500 text-text-main appearance-none cursor-pointer hover:bg-white/5 transition-colors'>
                  <option value="">Select Category</option>
                  {blogCategories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">▼</div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="font-bold text-text-main group-hover:text-primary transition-colors">Publish Immediately</span>
                <input onChange={(e) => setIsPublished(e.target.checked)} type="checkbox" checked={isPublished}
                  className='w-6 h-6 accent-primary cursor-pointer' />
              </label>
              <p className="text-xs text-text-muted mt-2 leading-relaxed">
                If disabled, this post will be saved as a draft and visible only to you.
              </p>
            </div>
          </div>

        </div>

      </div>
    </form>
  )
}

export default Addblog
