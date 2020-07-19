import React, { useState } from 'react'

import Search from './Search'

const Home = () => {

  const [searchStyle, setSearchStyle] = useState('search-box')

  const keyDownListen = event => {
    //查看keyCode表
    if (event.which === 229
      || (event.which >= 48 && event.which <= 57)
      || (event.which >= 65 && event.which <= 90)
      || (event.which >= 187 && event.which <= 192)
      || (event.which >= 219 && event.which <= 222)
    ) {
      setSearchStyle('search-box2')
    }
  }

  /* 
   * 不同搜索工具的页面逻辑
     谷歌搜索：输入框发生条件keydown事件后，焦点移动到谷歌浏览器的输入框
     百度搜索：输入框发生条件keydown事件后，页面发生变化，借鉴的这个逻辑
     头条搜索：输入框获取焦点后，页面发生变化
   */

  return (
    <div>
      <div onKeyDown={keyDownListen}>
        <Search searchStyle={searchStyle} />
      </div>
    </div >
  )
}

export default Home