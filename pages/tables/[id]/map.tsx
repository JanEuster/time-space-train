
import React, { useRef } from 'react'
import styles from "/styles/Timetable.module.css"

export default function Map() {
    const ref = useRef();
  return (
    <canvas ref={ref} className={styles.timetable_map}>

    </canvas>
  )
}
