
interface Station {
  name: String,
  short: String,
}

interface ITrain {
  id: String,
  startTime: Number,
  stations: Array<Station>,
  durations: Array<Number>,
}

interface Trip {
  A: Station,
  B: Station,
  duration: Number,
}
interface Train extends ITrain {
  trips: Array<Trip>
}
interface Timetable {
  table: Station
  id: Number,
  title: String,
  stations: Array<Station>,
  trains: Array<Train>,
}


const createTimetable = (id: Number, title: String, stations: Array<Station>, trains: Array<Train>) => {
  return {
    id: id,
    title: title,
    stations: stations,
    trains: trains,
  }
}
const changeTimetable = (table: Timetable, title: String, stations: Array<Station>, trains: Array<Train>) => {
  return createTimetable(table.id, title, stations, trains)
}

const createStation = (name: String, short: String) => {
  return {
    name: name,
    short: short,
  }
}
const addStations = (table: Timetable, stations: Array<Station>) => {
  table.stations = [...table.stations, ...stations]
}
const changeStation = (station: Object, name: String, short: String) => {
  return createStation(name, short);
}

const createTrip = (A: Station, B: Station, duration: Number) => {
  return {
    A: A,
    B: B,
    duration: duration,
  }
}
const changeTrip = (A: Station, B: Station, duration: Number) => {
  return createTrip(A, B, duration)
}


const createTrain = (id: String, startTime: Object, stations: Array<Station>, durations: Array<Number>) => {
  return {
    id: id,
    startTime: startTime,
    stations: stations,
    durations: durations,
    trips: (() => {
      let trips = []
      for (let i = 0; i < durations.length; i++) {
        trips.push(createTrip(stations[i], stations[i + 1], durations[i]))
      }
      return trips
    })(),
  }
}
const addTrain = (table: Timetable, train: Train) => {
  table.trains.push(train)
}
const changeTrain = (train: Train, startTime: Number, stations: Array<Station>, durations: Array<Number>) => {
  return createTrain(train.id, startTime, stations, durations)
}

export { createTimetable, changeTimetable, addStations, createStation, changeStation, addTrain, createTrain, changeTrain }