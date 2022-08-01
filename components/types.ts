
type stationIdent = string;
interface Station {
  name: string,
  ident: stationIdent,
}

interface Train {
  id: string,
  startTime: Date,
  stations: Array<stationIdent>,
  durations: Array<number>,
  stopDurations: Array<number>,
  color: string,
}

interface TrainWithTrips extends Train {
  trips: Array<Trip>,
}
interface Trip {
  A: stationIdent,
  B: stationIdent,
  duration: number,
}

interface Timetable {
  id: number,
  title: string,
  stations: Array<Station>,
  trains: Array<Train>,
}


const createTimetable = (id: number, title: string, stations: Array<Station>, trains: Array<Train>): Timetable => {
  return {
    id: id,
    title: title,
    stations: stations,
    trains: trains,
  }
}
const defaultTimeTable = (): Timetable => {
  return createTimetable(0, "default", [], [])
}
const createStation = (name: string, short: string): Station => {
  return {
    name: name,
    ident: short,
  }
}
const createTrip = (A: stationIdent, B: stationIdent, duration: number): Trip => {
  return {
    A: A,
    B: B,
    duration: duration,
  }
}


const createTrain = (id: string, startTime: Date, stations: Array<stationIdent>, durations: Array<number>, stopDurations: Array<number>, color: string): TrainWithTrips => {
  let trips = []
  for (let i = 0; i < durations.length; i++) {
    trips.push(createTrip(stations[i], stations[i + 1], durations[i]))
  }
  return {
    id: id,
    startTime: startTime,
    stations: stations,
    durations: durations,
    stopDurations: stopDurations,
    trips: trips,
    color: color,
  }
}

type MapSettings = Object;

export {
  createTimetable, defaultTimeTable, createStation, createTrain,
}
export type { Station, stationIdent, Train, TrainWithTrips, Timetable }
export type {MapSettings}