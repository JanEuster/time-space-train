
const createTimetable = (id, title, stations = [], trains = []) => {
  return {
    id: id,
    title: title,
    stations: stations,
    trains: trains,
  }
}
const changeTimetable = (table, title, stations, trains) => {
  return createTimetable(table.id, title, stations, trains)
}

const createStation = (name, short) => {
  return {
    name: name,
    short: short,
  }
}
const addStations = (table, stations) => {
  table.stations = [table.stations, ...stations]
}
const changeStation = (station, name, short) => {
  return createStation(name, short);
}

const createTrip = (A, B, duration) => {
  return {
    A: A,
    B: B,
    duration: duration,
  }
}
const changeTrip = (A, B, duration) => {
  return createTrip(A, B, duration)
}


const createTrain = (id, startTime, stations, durations) => {
  return {
    id: id,
    startTime: startTime,
    stations: stations,
    durations: durations,
    trips: (() => {
      let trips = []
      for (let i = 0; i < this.durations; i++) {
        trips.push(new Trip(this.stations[i], this.stations[i + 1], this.durations[i]))
      }
      return trips
    })(),
  }
}
const addTrain = (train) => {
  table.trains.push(train)
}
const changeTrain = (train, startTime, stations, durations) => {
  return createTrain(train.id, startTime, stations, durations)
}

export { createTimetable, changeTimetable, addStations, createStation, changeStation, addTrain, createTrain, changeTrain }