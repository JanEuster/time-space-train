import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from "next/router";
import { useState, useRef, useEffect, ChangeEvent } from 'react'
import { faSquareMinus, faSquarePlus, faHouse } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { addMinutes, format } from "date-fns"
import styles from "../../../styles/Home.module.css"
import styles2 from "../../../styles/Table.module.css"
import "../../../styles/Table.module.css"
import { TrainWithTrips, Station, Train, Timetable, defaultTimeTable, stationIdent } from '../../../components/types';
import { createTimetable, createStation, createTrain } from "../../../components/types"

const Station = ({ station, changeStation, removeStation }: { station: Station, changeStation: Function, removeStation: Function }) => {
  let { name, ident } = station;

  const mainRef = useRef(null);
  const ref = useRef(null);
  const refShort = useRef(null);

  useEffect(() => {

  })
  return (
    <div ref={mainRef} className={styles2.station} draggable={true}>
      <input key="name" ref={ref} defaultValue={name} onChange={(e) => { e.preventDefault(); e.stopPropagation(); changeStation(ident, ref.current.value, ident); }} 
      onClick={(e) => { }} />
      <input className={styles2.short} ref={refShort} defaultValue={ident} 
      onChange={(e) => { changeStation(ident, name, refShort.current.value); e.stopPropagation() }} onClick={(e) => { }} />
      <FontAwesomeIcon icon={faSquareMinus} className={styles.listIcon} onClick={(e) => { removeStation(refShort.current.value) }} />
    </div>
  )
}

const Stations = ({ setStations, table }: { setStations: Function, table: Timetable }) => {
  let stations = table.stations;

  const addStation = () => {
    setStations([...stations, createStation("X Station", "X")])
  }
  const changeStation = (shortIdent, name: string, ident: string) => {
    for (let i = 0; i < stations.length; i++) {
      let s = stations[i];
      if (s.ident === shortIdent) {
        s.name = name;
        s.ident = ident;
        setStations([...stations.slice(0, i), s, ...stations.slice(i + 1, stations.length)]);
        break
      }
    }
  }
  const removeStation = (shortIdent) => {
    for (let i = 0; i < stations.length; i++) {
      let s: Station = stations[i];
      if (s.ident === shortIdent) {
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
                        <Station station={s} changeStation={changeStation} removeStation={removeStation} />
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

const TrainStation = ({ ident, time, setTrainStations, allStations }: { ident: stationIdent, time: string, setTrainStations: Function, allStations: Station[] }) => {
  return (
    <div key={ident} className="w100">
      <li>
        <div className="h100">
          <h6>
            {time}
          </h6>
          <select defaultValue={ident}>
            {allStations.map((station, j) =>
              <option key={j} value={station.ident}>
                {station.ident}
              </option>
            )}
          </select>
        </div>
      </li>
    </div>
  )
}

const Train = ({ train, setTrains, table }: { train: Train, setTrains: Function, table: Timetable }) => {
  let { id, startTime, stations, durations } = train;
  let trainIndex = table.trains.indexOf(train);

  const ref = useRef<HTMLInputElement>();

  const changeTrainId = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0) {
      let newId = e.target.value;
      try {
        let newTrain = createTrain(newId, startTime, stations, durations);
        setTrains([...table.trains.slice(0, trainIndex), newTrain, ...table.trains.slice(trainIndex+1)]);
      } 
      catch (err) {
        console.error(err);
      }
    } else {
      e.target.value = id;
    }
  }
  const changeTrainStartTime = (e: ChangeEvent<HTMLInputElement>, isBlur=false) => {
    if (e.target.value.length > 0 && e.target.value.includes(":")) {
        let newStartTime = new Date();
        try {
          newStartTime= new Date("2000.01.01 " + e.target.value);
          format(new Date(newStartTime), "HH:mm")
        } catch (err) {
          if (err instanceof RangeError) {
            e.target.value = format(new Date(startTime), "HH:mm");
            return
          }
        }
        console.log("abc")
        let index = table.trains.indexOf(train);
        try {
          let newTrain = createTrain(id, newStartTime, stations, durations);
          setTrains([...table.trains.slice(0, trainIndex), newTrain, ...table.trains.slice(trainIndex+1)]);
        } 
        catch (err) {
          console.error(err);
        }

    } else {
      if (isBlur) {
        e.target.value = format(new Date(startTime), "HH:mm");
      }
    }
  }
  const setTrainStations = (stations: stationIdent[], durations: number[]) => {
    let newTrain = createTrain(id, train.startTime, stations, durations);
    setTrains([...table.trains.slice(0, trainIndex), newTrain, ...table.trains.slice(trainIndex+1)]);
  }

  const removeTrain = () => {
    // trains is set to an empty array for a short while because this fixes react rendering the changes incorrectly
    // without it rerendering fucks up? the last trains gets removed visually while data gets modified correctly
    setTrains([])
    setTimeout(() => {
      setTrains([...table.trains.slice(0, trainIndex), ...table.trains.slice(trainIndex+1)]);
    }, 10)
  }

  const addAllMinutes = (index: number): Date => {
    let time = new Date(startTime);
    for (let i = 0; i < index; i++) {
      time = addMinutes(time, durations[i]);
    }
    return time
  }

  return (
    <div className={styles2.trains}>
      <div className={styles2.trainHead}>
        <input defaultValue={id} onBlur={changeTrainId} />
        <input defaultValue={format(new Date(startTime), "HH:mm")} onChange={changeTrainStartTime} 
        onBlur={(e) => changeTrainStartTime(e, true)}className={styles2.short} />
        <FontAwesomeIcon icon={faSquareMinus} className={styles.listIcon} onClick={removeTrain} />
      </div>
      <FontAwesomeIcon icon={faSquarePlus} className={styles2.icon} onClick={(e) => { }} />
      <div className={styles2.route}>
        <ol className={styles2.routeStations}>
          {stations.map((s, i) => {
            let duration = null;
            if (i < stations.length - 1) {
              duration = (
                <div className={styles2.routeDuration}>
                  <input defaultValue={durations[i]}></input> min
                </div>
              );
            }
            return <>
              <TrainStation key={i} ident={s} time={format(addAllMinutes(i), "HH:mm")} setTrainStations={setTrainStations} allStations={table.stations} />
              {duration}
            </>
          })}
        </ol>
      </div>
    </div>
  )
}

const Trains = ({ setTrains, table }: { setTrains: Function, table: Timetable }) => {
  let trains = table.trains;

  const addTrain = () => {
    setTrains([...trains, createTrain("TRAIN 1000", new Date("2000.01.01 06:24:00"), [], [])])
  }
  // let ttt: Array<Train> = [createTrain("ICE1006", new Date('2000.01.01 06:24:00'), ["A", "B"], [70, 30])]
  return (
    <>
      <FontAwesomeIcon icon={faSquarePlus} className={styles.headIcon} onClick={addTrain} />
      {trains.map((t: Train, i) => {
        return <Train key={i} train={t} setTrains={setTrains} table={table} />
      })}
    </>

  )
}

const Table = () => {
  const router = useRouter();
  const { id } = router.query;
  // const [table, setTable] = useState<Timetable>(defaultTimeTable());
  const [table, setTable] = useState<Timetable | null>(null);

  const setStations = (stations: Station[]) => {
    setTable(createTimetable(table.id, table.title, stations, table.trains))
  }

  const setTrains = (trains: Train[]) => {
    setTable(createTimetable(table.id, table.title, table.stations, trains))
  }
  useEffect(() => {
    let defaultStations: Array<Station> = [createStation("A Station", "A"), createStation("B Station", "B")];
    let defaultTrains: Array<Train> = [createTrain("ICE1006", new Date('2000.01.01 06:24:00'), ["A", "B"], [70, 30])];
    // first time load tables data
    let tables = JSON.parse(localStorage.getItem("tables"));
    for (let i = 0; i < tables.length; i++) {
      let item: Timetable = tables[i];
      if (item.id == Number(id)) {
        setTable(item);
        if (item.stations.length == 0) {
          setTable(createTimetable(item.id, item.title, defaultStations, item.trains));
        }
        if (item.trains.length == 0) {
          setTable(createTimetable(item.id, item.title, defaultStations, defaultTrains));
        }
      }
    }
  }, [router.isReady])


  useEffect(() => {
    // save stations & trains changes
    let tables = JSON.parse(localStorage.getItem("tables"))
    for (let i = 0; i < tables.length; i++) {
      let item = tables[i];
      if (item.id == id && table) {
        item.stations = table.stations;
        item.trains = table.trains;
        tables[i] = item
        localStorage.setItem("tables", JSON.stringify(tables))
      }
    }
  }, [table])

  return table ? (
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
        <Stations setStations={setStations} table={table} />

        <h2 className={styles2.routes}>Trains</h2>
        <Trains setTrains={setTrains} table={table} />

      </div>
    </div>
  ) : null
}

export default Table;

