import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import { useState, useRef, useEffect, MutableRefObject } from 'react'
import { faSquareMinus, faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { createTimetable } from "../components/types"

const ListItem = ({ data, changeTitle, deleteItem }) => {
  let { title, id } = data;
  const ref = useRef<HTMLInputElement>(null)
  return (
    <Link href={"/tables/" + id}>
      <li>
        <input ref={ref} defaultValue={title} onChange={() => { changeTitle(id, ref.current.value) }} onClick={(e) => { e.stopPropagation(); }} />
        <FontAwesomeIcon icon={faSquareMinus} className={styles.listIcon} onClick={(e) => { e.stopPropagation(); deleteItem(id) }} />
      </li>
    </Link>
  )
}

export default function Home() {
  const [list, setList] = useState([]);
  let [minId, setMinId] = useState(0);

  const addListItem = () => {
    setList([...list, createTimetable(minId, "new", [], [])]);
    setMinId(minId + 1);
  }

  const changeTitle = (id, newTitle) => {
    for (let index = 0; index < list.length; index++) {
      let item = list[index];
      if (item.id === id) {
        setList([...list.slice(0, index), createTimetable(item, newTitle, item.stations, item.trains), ...list.slice(index + 1, list.length)])
        break
      }
    }
  }

  const deleteItem = (id) => {
    for (let index = 0; index < list.length; index++) {
      let item = list[index];
      if (item.id === id) {
        setList([...list.slice(0, index), ...list.slice(index + 1, list.length)])
        break
      }
    }
  }

  // get tables cookie data on load
  useEffect(() => {
    setList(JSON.parse(localStorage.getItem("tables")) ?? []);
    setMinId(JSON.parse(localStorage.getItem("tablesMinID")) ?? 0);

    return () => {
      // localStorage.setItem("tables", JSON.stringify(list))
      // localStorage.setItem("tablesMinID", JSON.stringify(minId))
    }
  }, [])

  // update tables cookie
  useEffect(() => {
    if (list.length > 0) {
      localStorage.setItem("tables", JSON.stringify(list))
      localStorage.setItem("tablesMinID", JSON.stringify(minId))
    }
  }, [list, minId])

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.listContainer}>
        <div>
          <FontAwesomeIcon icon={faSquarePlus} className={styles.headIcon} onClick={addListItem} />
        </div>
        <ul className={styles.list}>
          {list.map((item, index) => {
            return <ListItem key={item.id} data={item} changeTitle={changeTitle} deleteItem={deleteItem} />
          })}
        </ul>
      </div>
    </div>
  )
}
