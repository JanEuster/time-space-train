
interface Station {
  name: string,
  short: string,
}

interface ITrain {
  id: string,
  startTime: string,
  stations: Array<Station>,
  durations: Array<Number>,
}

interface Trip {
  A: Station,
  B: Station,
  duration: Number,
}
interface Train {
  id: string,
  startTime: string,
  stations: Array<Station>,
  durations: Array<Number>,
  trips: Array<Trip>,
}
interface Timetable {
  table: Station
  id: Number,
  title: string,
  stations: Array<Station>,
  trains: Array<Train>,
}


const createTimetable = (id: Number, title: string, stations: Array<Station>, trains: Array<Train>) => {
  return {
    id: id,
    title: title,
    stations: stations,
    trains: trains,
  }
}
const changeTimetable = (table: Timetable, title: string, stations: Array<Station>, trains: Array<Train>) => {
  return createTimetable(table.id, title, stations, trains)
}

const createStation = (name: string, short: string) => {
  return {
    name: name,
    short: short,
  }
}
const addStations = (table: Timetable, stations: Array<Station>) => {
  table.stations = [...table.stations, ...stations]
}
const changeStation = (station: Object, name: string, short: string) => {
  return createStation(name, short);
}

const createTrip = (A: Station, B: Station, duration: Number): Trip => {
  return {
    A: A,
    B: B,
    duration: duration,
  }
}
const changeTrip = (A: Station, B: Station, duration: Number) => {
  return createTrip(A, B, duration)
}


const createTrain = (id: string, startTime: string, stations: Array<Station>, durations: Array<Number>): Train => {
  let trips = []
  for (let i = 0; i < durations.length; i++) {
    trips.push(createTrip(stations[i], stations[i + 1], durations[i]))
  }
  return {
    id: id,
    startTime: startTime,
    stations: stations,
    durations: durations,
    trips: trips,
  }
}
const addTrain = (table: Timetable, train: Train) => {
  table.trains.push(train)
}
const changeTrain = (train: Train, startTime: string, stations: Array<Station>, durations: Array<Number>) => {
  return createTrain(train.id, startTime, stations, durations)
}

export {
  createTimetable, changeTimetable, addStations, createStation, changeStation, addTrain, createTrain, changeTrain,
}
export type { Station, ITrain, Train, Timetable }
