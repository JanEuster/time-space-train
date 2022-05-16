import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from 'react'
import { faSquareMinus, faSquarePlus, faHome, faHouse } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from "../../styles/Home.module.css"
import styles2 from "../../styles/Table.module.css"


const Station = () => {
  return (
    <div>

    </div>
  )
}

const Train = () => {

  return (
    <div>

    </div>
  )
}


const Table = () => {
  const router = useRouter();
  const { id } = router.query;
  const [table, setTable] = useState();

  const [stations, setStations] = useState([]);
  const [trains, setTrains] = useState([]);

  useEffect(() => {

    let tables = JSON.parse(localStorage.getItem("tables"))
    for (let i = 0; i < tables.length; i++) {
      let item = tables[i];
      if (item.id == id) {
        setTable(item);
      }
    }

  }, [])

  return (
    <div className={styles.container}>
      <div>
        <Link href="/">
          <a>
            <FontAwesomeIcon icon={faHouse} className={styles.headIcon} />
          </a>
        </Link>
      </div>
      <div>
        <h1 className={styles2.title}>{table?.title ?? ""}</h1>

        <h2 className={styles2.routes}>Stations</h2>
        <FontAwesomeIcon icon={faSquarePlus} className={styles.headIcon} onClick={() => { }} />
        {stations.map((station) => {

        })}

        <h2 className={styles2.routes}>Trains</h2>
        <FontAwesomeIcon icon={faSquarePlus} className={styles.headIcon} onClick={() => { }} />
        {trains.map((train) => {
          return <Train />
        })}

      </div>
    </div>
  )
}

export default Table;