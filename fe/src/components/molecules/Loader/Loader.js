import React from 'react'

import style from './Loader.module.css'

const Loader = (props) => {
  return (
    <div className={style.lds_ellipsis}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

export default Loader
