import { useRouter } from "next/router";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { MapSettings, Station, Timetable } from "../../../components/types";
import styles from "/styles/Timetable.module.css";
import { addMinutes, format } from "date-fns";

type graphConfig = {
  width: number;
  height: number;
  inset: number;
  xLength: number;
  yLength: number;
  fontSize: number;
  data: Timetable;
};
class TSTGraph {
  id: number;

  constructor(id: number) {
    this.id = id;
  }
  getCurrentTable = (): Timetable | false => {
    let tables: Timetable[] = JSON.parse(localStorage.getItem("tables"));
    for (let table of tables) {
      if (table.id == Number(this.id)) {
        return table;
      }
    }
    return false;
  };

  drawAxis(ctx: CanvasRenderingContext2D, config: graphConfig): void {
    let { width, height, inset } = config;
    // y axis
    ctx.beginPath();
    ctx.moveTo(inset, inset);
    ctx.lineTo(inset, height - inset);
    ctx.stroke();
    ctx.closePath();
    // arrow
    ctx.beginPath();
    ctx.moveTo(inset - 10, inset);
    ctx.lineTo(inset + 10, inset);
    ctx.lineTo(inset, inset - 15);
    ctx.fill();
    ctx.closePath();
    // x axis
    ctx.beginPath();
    ctx.moveTo(inset, height - inset);
    ctx.lineTo(width - inset, height - inset);
    ctx.stroke();
    ctx.closePath();
    // arrow
    ctx.beginPath();
    ctx.moveTo(width - inset, height - inset - 10);
    ctx.lineTo(width - inset, height - inset + 10);
    ctx.lineTo(width - inset + 15, height - inset);
    ctx.fill();
    ctx.closePath();
    // axis titles
    let textLength1 = ctx.measureText("space");
    ctx.fillText("space", inset - textLength1.width / 2, 0.6 * inset);
    let textLength2 = ctx.measureText("time");
    ctx.fillText(
      "time",
      width - inset - textLength2.width / 2,
      height - 0.4 * inset
    );
  }
  drawAxisLabels(
    ctx: CanvasRenderingContext2D,
    config: graphConfig
  ): [Object, number] {
    // station(space) labels
    let stationsNum = config.data.stations.length;
    let stationSpacing = config.yLength / stationsNum;

    let stationHeights = {};
    for (let i = 0; i < stationsNum; i++) {
      let station = config.data.stations[i];
      let stationNameWidth = ctx.measureText(station.ident).width;
      stationHeights[station.ident] =
        i * stationSpacing - (0.5 / 1.3) * config.fontSize + stationSpacing / 2;

      // backgroud
      ctx.fillStyle = "#ADD8E6";
      ctx.fillRect(
        config.inset - stationNameWidth,
        i * stationSpacing - config.fontSize + stationSpacing / 2,
        stationNameWidth + 20,
        1.3 * config.fontSize
      );
      // text
      ctx.fillStyle = "black";
      ctx.fillText(
        station.ident,
        config.inset - 0.5 * stationNameWidth,
        i * stationSpacing + stationSpacing / 2
      );

      // dashed line
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.setLineDash([10]);
      ctx.moveTo(
        config.inset + stationNameWidth,
        stationHeights[station.ident]
      );
      ctx.lineTo(config.inset + config.xLength, stationHeights[station.ident]);
      ctx.stroke();
      ctx.closePath();
    }

    // time labels
    let timeSpacing = (config.xLength - 15) / 24;
    let maxTimeWidth = config.inset + 24 * timeSpacing;
    ctx.textAlign = "center";
    for (let i = 0; i < 24; i++) {
      let timeNameWidth = ctx.measureText(String(i)).width;
      let timeWidth = config.inset + i * timeSpacing;
      // backgroud
      ctx.fillStyle = "#ADD8E6";
      ctx.fillRect(
        timeWidth - 0.75 * timeNameWidth,
        config.height - config.inset + 10,
        1.5 * timeNameWidth,
        config.fontSize
      );
      // text
      ctx.fillStyle = "black";
      ctx.fillText(
        String(i),
        timeWidth,
        config.height - config.inset + 10 + config.fontSize - 5
      );
    }

    return [stationHeights, maxTimeWidth];
  }

  draw(ctx: CanvasRenderingContext2D): void {
    let timetable = this.getCurrentTable();

    // get stuff
    let width = ctx.canvas.width;
    let height = ctx.canvas.height;
    let inset = 48;

    // get mapSettings
    const mapSettings: MapSettings = JSON.parse(
      localStorage.getItem("mapSettings")
    );
    // set default options
    let startEndLabels = true;
    let lineWidth = 6;

    if (mapSettings) {
      startEndLabels = mapSettings["start_end_labels"] ?? startEndLabels;
      lineWidth = mapSettings["line_width"] ?? lineWidth;
    }

    // clean up
    ctx.clearRect(0, 0, width, height);

    // if timetable: draw the thing
    if (timetable) {
      // setup
      let config: graphConfig = {
        width: width,
        height: height,
        inset: inset,
        xLength: width - 2 * inset,
        yLength: height - 2 * inset,
        fontSize: 30,
        data: timetable,
      };
      //ctx.fillStyle = "#83C3D8"; BLUE
      //ctx.strokeStyle = "#ADD8E6"; LIGHTBLUE
      // reset
      ctx.fillStyle = "black";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 6;
      ctx.font = `${config.fontSize}px Arial`;
      ctx.textAlign = "left";

      this.drawAxis(ctx, config);
      const [stationHeights, maxTimeWidth] = this.drawAxisLabels(ctx, config);

      // trains
      ctx.setLineDash([]);
      ctx.lineWidth = lineWidth;
      for (let i = 0; i < timetable.trains.length; i++) {
        let train = timetable.trains[i];
        ctx.strokeStyle = train.color;
        let time = train.startTime;

        // line
        let firstPos = { x: 0, y: 0 };
        let lastPos = { x: 0, y: 0 };
        ctx.beginPath();
        for (let j = 0; j < train.stations.length; j++) {
          let station = train.stations[j];
          // calculate time as decimal 0-1 to multiply with maxTimeWidth(23:99)
          let x =
            (maxTimeWidth *
              (Number(format(new Date(time), "HH")) +
                (1 / 60) * Number(format(new Date(time), "mm")))) /
            24;
          let y = stationHeights[station];
          if (j == 0) {
            ctx.moveTo(x, y);
            firstPos.x = x;
            firstPos.y = y + config.fontSize / 3;
          } else {
            ctx.lineTo(x, y);
          }

          if (j < train.stations.length - 1) {
            time = addMinutes(new Date(time), train.durations[j]);
          } else {
            lastPos.x = x;
            lastPos.y = y + config.fontSize / 3;
          }
        }
        ctx.stroke();
        ctx.closePath();

        // station dots
        time = train.startTime;
        for (let j = 0; j < train.stations.length; j++) {
          let station = train.stations[j];
          // calculate time as decimal 0-1 to multiply with maxTimeWidth(23:99)
          let x =
            (maxTimeWidth *
              (Number(format(new Date(time), "HH")) +
                (1 / 60) * Number(format(new Date(time), "mm")))) /
            24;
          let y = stationHeights[station];
          ctx.fillRect(
            x - config.fontSize / 4,
            y - config.fontSize / 4,
            config.fontSize / 2,
            config.fontSize / 2
          );

          if (j < train.stations.length - 1) {
            time = addMinutes(new Date(time), train.durations[j]);
          }
        }

        // train label
        if (startEndLabels) {
          ctx.fillStyle = train.color;
          ctx.font = `${(2 / 3) * config.fontSize}px Arial black`;
          let trainLabelWidth = ctx.measureText(train.id).width;
          ctx.fillRect(
            firstPos.x - trainLabelWidth / 2 - 5,
            firstPos.y - (2 / 3) * config.fontSize,
            trainLabelWidth + 10,
            (2 / 3) * config.fontSize
          );
          ctx.fillRect(
            lastPos.x - trainLabelWidth / 2 - 5,
            lastPos.y - (2 / 3) * config.fontSize,
            trainLabelWidth + 10,
            (2 / 3) * config.fontSize
          );
          ctx.fillStyle = "black";
          ctx.fillText(train.id, firstPos.x, firstPos.y - 2);
          ctx.fillText(train.id, lastPos.x, lastPos.y - 2);
        }
      }
    }
  }
}

const MapSettings: React.FC<{ id: number }> = ({ id }) => {
  const changeCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    let prop = e.target.name;
    let newSettings: MapSettings = JSON.parse(
      localStorage.getItem("mapSettings")
    );
    newSettings[prop] = e.target.checked;
    localStorage.setItem("mapSettings", JSON.stringify(newSettings));

    window.dispatchEvent(
      new CustomEvent("graph_settings_changed", { detail: { id: id } })
    );
  };
  const changeRange = (e: ChangeEvent<HTMLInputElement>) => {
    let prop = e.target.name;
    let newSettings: MapSettings = JSON.parse(
      localStorage.getItem("mapSettings")
    );
    newSettings[prop] = Number(e.target.value);
    localStorage.setItem("mapSettings", JSON.stringify(newSettings));

    window.dispatchEvent(
      new CustomEvent("graph_settings_changed", { detail: { id: id } })
    );
  };

  const getDefault = (prop: string) => {
    let settings: MapSettings = JSON.parse(localStorage.getItem("mapSettings"));
    console.log(settings);
    return settings[prop];
  };

  useEffect(() => {
    let settings: MapSettings = JSON.parse(localStorage.getItem("mapSettings"));
    if (!settings) {
      localStorage.setItem("mapSettings", JSON.stringify({}));
    }
  });

  return (
    <div className={styles.map_settings}>
      <div className={styles.map_settings_column}>
        <input
          type="checkbox"
          name="start_end_labels"
          onChange={changeCheckbox}
          defaultChecked={getDefault("start_end_labels")}
        />
        <label>start/end of line labels</label>
        <input
          type="range"
          name="line_width"
          onChange={changeRange}
          defaultValue={getDefault("start_end_labels")}
        />
        <label>train line width</label>
      </div>
      <div className={styles.map_settings_column}></div>
    </div>
  );
};

export default function Map() {
  const router = useRouter();
  const { id } = router.query;
  const ref = useRef();

  const graph = new TSTGraph(Number(id));

  useEffect(() => {
    const redrawIfNecessary = (e: CustomEvent) => {
      if (e.detail.id == id) {
        let canvas: HTMLCanvasElement = ref.current;
        let ctx = canvas.getContext("2d");
        graph.draw(ctx);
      }
    };
    const setCanvasSize = () => {
      let canvas: HTMLCanvasElement = ref.current;
      let ctx = canvas.getContext("2d");
      let parent: HTMLElement = canvas.parentNode as HTMLElement;

      canvas.width =
        2 * Number(window.getComputedStyle(parent).width.slice(0, -2));
      canvas.height =
        2 * Number(window.getComputedStyle(parent).height.slice(0, -2));

      graph.draw(ctx);
    };
    setCanvasSize();

    window.addEventListener("resize", setCanvasSize);
    window.addEventListener("timetable_changed", redrawIfNecessary);
    window.addEventListener("graph_settings_changed", redrawIfNecessary);
    return () => {
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("timetable_changed", redrawIfNecessary);
    };
  });

  return (
    <div className={styles.map_container}>
      <canvas ref={ref} className={styles.timetable_map}></canvas>
      <MapSettings id={Number(id)} />
    </div>
  );
}
