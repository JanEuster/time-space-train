
class Station {
  constructor(name, short) {
    this.name = name;
    this.short = short;
  }
}

class Trip {
  constructor(stationA, stationB, duration) {
    this.A = stationA;
    this.B = stationB;
    this.duration = duration;
  }
}

class Train {
  constructor(id, stations, durations) {
    this.id = id;
    this.stations = stations;
    this.durations = durations;
    this.trips = [];
    this.generateTrips();
  }

  generateTrips() {
    for (let i = 0; i < this.durations; i++) {
      this.trips.push(new Trip(this.stations[i], this.stations[i + 1], this.durations[i]))
    }
  }

}

class Timetable {
  constructor(title, id) {
    this.title = title;
    this.id = id;

    this.stations = [];
    this.routes = [];
  }

}

export default Timetable