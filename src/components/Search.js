import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

import './Search.css'

const Search = ({ searchStyle }) => {

  //input输入框ref引用
  const inputEl = useRef(null)
  //input输入框中的text
  const [content, setCon] = useState('')

  //词条匹配结果数组
  const [matchs, setMatchs] = useState({})
  //词条匹配结果数组是否展示[input失去焦点后，不展示]
  const [matchAppear, setMatchAppear] = useState(false)
  //词条匹配结果是否更新[通过上下键选择词条时不更新]
  const [matchReflash, setMatchReflash] = useState(true)
  //词条匹配结果数组的定位
  const [index, setIndex] = useState(-1)

  //搜索结果数组
  const [results, setResult] = useState([])
  //是否展示搜索结果[用于没有点击搜索或者enter键时不展示]
  const [resultAppear, setResultAppear] = useState(false)
  //页面与offset参数
  const [page, setPage] = useState(0)

  //content赋值
  const handleChange = (event) => {
    setCon(event.target.value)
  }

  //content变化刷新词条匹配结果
  useEffect(() => {
    matchReflash && axios.get(`https://i.snssdk.com/search/api/sug/?keyword=${content}`)
      .then(
        res => {
          setMatchs(res.data)
        }
      )
      .catch(
        error => {
          console.log(error)
        }
      )
  }, [content, matchReflash])

  //用户点击搜索或键入enter后展示搜索结果
  const handleResult = () => {
    setResultAppear(true)
    setMatchReflash(true)
    setIndex(-1)
    console.log(content)
    console.log(page)
    axios.get(`https://i.snssdk.com/search/api/study?keyword=${content}&offset=${page}`)
      .then(
        res => {
          setResult(res.data)
        }
      )
      .catch(
        error => {
          console.log(error)
        }
      )
  }
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [results])

  //上下键选择词条
  const handleKeyDown = (event) => {

    let keyCode = event.keyCode

    //上下键选择匹配词条，此时词条不刷新
    if (keyCode === 38 || keyCode === 40) {
      setMatchReflash(false)
      if (keyCode === 38) {
        setIndex(arg => ((arg - 1) < 0) ? matchs.data.length - 1 : arg - 1)
      } else {
        setIndex(arg => (arg + 1) % (matchs.data.length))
      }
    } else if (keyCode === 13) {
      inputEl.current.blur()
      setPage(0)
      handleResult()
    } else {
      setMatchReflash(true)
      setIndex(-1)
    }
  }

  //词条选择后的input刷新
  useEffect(() => {
    if (matchs.code === 0 && matchs.data.length !== 0) {
      if (index !== -1) {
        console.log(results)
        setCon(matchs.data[index].keyword)
      }
    }
  }, [matchs.data, index, matchs.code, matchs, results])

  //通过时间戳获取时间
  const getTime = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    return `${year}年${month}月${day}日`
  }

  return (
    <div className='search-container'>
      <div className={searchStyle} >
        <div className='search-title'>极净搜</div>
        <div className='search-icon'>
          <i className='iconfont'>&#xe653;</i>
        </div>
        <input
          className='search-text'
          type='text'
          placeholder="享受不一样的搜索体验"
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setMatchAppear(true)}
          onBlur={() => setTimeout(() => setMatchAppear(false), 100)}
          ref={inputEl} />
        <button className='search-btn' onClick={handleResult}>
          搜索
        </button>

        {matchAppear && content !== '' &&
          <div>
            <hr className='search-line'></hr>
            <ul className='search-match'>
              {(matchs.code === 0 && matchs.data.length !== 0) &&
                matchs.data.map(
                  (item, key) => (
                    <li className='match-item' key={key} onMouseDown={() => {
                      setIndex(key)
                      setMatchReflash(false)
                      setPage(0)
                    }} onClick={handleResult} style={{ background: (index === key) ? 'rgba(32, 33, 36, .10)' : 'white' }}>
                      <i className='iconfont'>&#xe653;</i>
                      <span className='match-text'>{item.keyword}</span>
                    </li>)
                )
              }
            </ul>
          </div>
        }
      </div>
      <div>
        {resultAppear &&
          <ul className='search-result'>
            {(results.code === 0 && results.data.length !== 0)
              ? <div className='result-number'>为您找到相关结果约{results.total}个</div>
              : <div className='result-number'> 很抱歉，为找到相关结果</div>
            }
            {(results.code === 0 && results.data.length !== 0) && results.data.map((item, key) => (
              <li key={key} className='result-item'>
                <a href={item.link_url} target="_blank" rel="noopener noreferrer">
                  <h3>{item.title}</h3>
                </a>
                <div className='result-description'>
                  <div className='result-header'>
                    <span>{getTime(new Date(item.create_time))}</span>
                  &nbsp;&nbsp;
                  <span>{item.user_name}</span>
                  </div>
                  <div className='result-body'>
                    {item.description}
                  </div>
                  <div className='result-footer'>
                    <span>{item.comments_count}条评论</span>
                  &nbsp;&nbsp;
                  <span>标签:{item.tags.map((item, key) => <span key={key} className='result-tag'>&nbsp;{item}</span>)}</span>
                  </div>
                </div>
              </li>
            ))}
            <div className='result-page'>
              {page !== 0 && <span className='page btn' onMouseDown={() => setPage(arg => arg - 1)} onMouseUp={handleResult}>上一页</span>}
              {page !== Math.floor(results.total / 10) && <span className='page btn' onMouseDown={() => setPage(arg => arg + 1)} onMouseUp={handleResult}>下一页</span>}
            </div>
          </ul>

        }
      </div>

    </div >
  )
}

export default Search