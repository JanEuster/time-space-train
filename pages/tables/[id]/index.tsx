import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from 'react'
import { faSquareMinus, faSquarePlus, faHouse } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { addMinutes, format } from "date-fns"
import styles from "../../../styles/Home.module.css"
import styles2 from "../../../styles/Table.module.css"
import "../../../styles/Table.module.css"
import { ITrain, Station, Train } from '../../../components/Timetable';
import { createTimetable, changeTimetable, createStation, changeStation, createTrain, changeTrain } from "../../../components/Timetable"

const Station = ({ name, short, changeStation, removeStation }) => {
  const mainRef = useRef(null);
  const ref = useRef(null);
  const refShort = useRef(null);

  useEffect(() => {

  })
  return (
    <div ref={mainRef} className={styles2.station} draggable={true}>
      <input key="name" ref={ref} defaultValue={name} onChange={(e) => { e.preventDefault(); e.stopPropagation(); changeStation(short, ref.current.value, short); }} onClick={(e) => { }} />
      <input className={styles2.short} ref={refShort} defaultValue={short} onChange={(e) => { changeStation(short, name, refShort.current.value); e.stopPropagation() }} onClick={(e) => { }} />
      <FontAwesomeIcon icon={faSquareMinus} className={styles.listIcon} onClick={(e) => { removeStation(refShort.current.value) }} />
    </div>
  )
}

const Stations = ({ stations, setStations, table }) => {
  const addStation = () => {
    setStations([...stations, createStation("X Station", "X")])
  }
  const changeStation = (shortIdent, name: String, short: String) => {
    for (let i = 0; i < stations.length; i++) {
      let s = stations[i];
      if (s.short === shortIdent) {
        s.name = name;
        s.short = short;
        setStations([...stations.slice(0, i), s, ...stations.slice(i + 1, stations.length)]);
        break
      }
    }
  }
  const removeStation = (shortIdent) => {
    for (let i = 0; i < stations.length; i++) {
      let s = stations[i];
      if (s.short === shortIdent) {
        setStations([...stations.slice(0, i), ...stations.slice(i + 1, stations.length)]);
        break
      }
    }
  }

  const handleDrop = (droppedStation) => {
    // Ignore drop outside droppable container
    if (!droppedStation.destination) return;
    var updatedList = [...stations];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedStation.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedStation.destination.index, 0, reorderedItem);
    // Update State
    setStations(updatedList);
  };

  useEffect(() => {
    if (stations.length === 0) {
      setStations([...stations, createStation("A Station", "A"), createStation("B Station", "B")])
    }
  })
  return (
    <div className="stations">
      <FontAwesomeIcon icon={faSquarePlus} className={styles.headIcon} onClick={() => { addStation() }} />
      <DragDropContext onDragEnd={handleDrop}>
        <Droppable droppableId="item">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {stations.map((s: Station, index) => {
                return (
                  <Draggable key={"item-" + index} draggableId={"item-" + index} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                      >
                        <Station name={s.name} short={s.short} changeStation={changeStation} removeStation={removeStation} />
                      </div>
                    )}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext >
    </div >
  )
}

const Train = ({ id, startTime, stations, durations }) => {
  const ref = useRef<HTMLInputElement>();

  const addAllMinutes = (index: Number) => {
    let time = startTime;
    for (let i = 0; i < index; i++) {
      time = addMinutes(time, durations[i]);
    }
    return time
  }

  return (
    <div className={styles2.trains}>
      <div className={styles2.trainHead}>
        <input ref={ref} defaultValue={id} onChange={() => { }} onClick={(e) => { }} />
        <input ref={ref} defaultValue={format(startTime, "HH:mm")} onChange={() => { }} onClick={(e) => { }} className={styles2.short} />
        <FontAwesomeIcon icon={faSquareMinus} className={styles.listIcon} onClick={(e) => { }} />
      </div>
      <FontAwesomeIcon icon={faSquarePlus} className={styles2.icon} onClick={(e) => { }} />
      <div className={styles2.route}>
        <ol className={styles2.routeStations}>
          {stations.map((s: Station, i) => {
            return (
              <div key={i} className="w100">
                <li>
                  <div className="h100">
                    <h6>
                      {i === 0 ? format(startTime, "HH:mm") : format(addAllMinutes(i), "HH:mm")}
                    </h6>
                    <select>
                      {stations.map((st: Station, j) => {
                        if (st === s) {
                          return (
                            <option key={j} defaultValue={st.short}>
                              {st.short}
                            </option>
                          )
                        }
                        return (
                          <option key={j} value={st.short}>
                            {st.short}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </li>
                {i < stations.length - 1 ?
                  <div className={styles2.routeDuration}>
                    <input defaultValue={durations[i]}></input> min
                  </div>
                  : null
                }
              </div>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

const Trains = ({ trains, setTrains, table }) => {
  let ttt: Array<Train> = [createTrain("ICE1006", new Date('2000.01.01 06:24:00'), [createStation("A Station", "A"), createStation("B Station", "B"), createStation("C Station", "C")], [70, 30])]
  return (
    <>
      <FontAwesomeIcon icon={faSquarePlus} className={styles.headIcon} onClick={() => { }} />
      {ttt.map((t: Train) => {
        return <Train key={t.id} id={t.id} startTime={t.startTime} stations={t.stations} durations={t.durations} />
      })}
    </>

  )
}

const Table = () => {
  const router = useRouter();
  const { id } = router.query;
  const [table, setTable] = useState(null);

  const [stations, setStations] = useState([]);
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    // first time load tables data
    let tables = JSON.parse(localStorage.getItem("tables"))
    for (let i = 0; i < tables.length; i++) {
      let item = tables[i];
      if (item.id == id) {
        setTable(item);
      }
    }

  }, [id])

  useEffect(() => {
    // save stations & trains changes
    let tables = JSON.parse(localStorage.getItem("tables"))
    for (let i = 0; i < tables.length; i++) {
      let item = tables[i];
      if (item.id == id) {
        item.stations = stations;
        item.trains = trains;
        tables[i] = item
        localStorage.setItem("tables", JSON.stringify(tables))
      }
    }
  }, [stations, trains])

  return (
    <div className={styles2.container}>
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
        <Stations stations={stations} setStations={setStations} table={table} />

        <h2 className={styles2.routes}>Trains</h2>
        <Trains trains={trains} setTrains={setTrains} table={table} />

      </div>
    </div>
  )
}

export default Table;

