import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Timetable } from "../../../components/types";
import styles from "/styles/Timetable.module.css";

type graphConfig = {
  width: number,
  height: number,
  inset: number,
}
class TSTGraph {
  id: number;

  constructor(id: number) {
    this.id = id;
  }
  getCurrentTable = (): Timetable | false => {
    let tables: Timetable[] = JSON.parse(localStorage.getItem("tables"));
    for (let table of tables) {
      if (table.id == Number(this.id)) {
        return table
      }
    }
    return false
  }

  drawAxis(ctx: CanvasRenderingContext2D, config: graphConfig): void {
      let {width, height, inset} = config;
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
      let textLength1 = ctx.measureText("time");
      ctx.fillText("time", inset - textLength1.width/2, 0.6 * inset);
      let textLength2 = ctx.measureText("space");
      ctx.fillText("space", width - inset - textLength2.width/2, height - 0.4 * inset);
  }
  draw(ctx: CanvasRenderingContext2D): void {
    console.log("redraw")
    let timetable = this.getCurrentTable();

    // get stuff
    let width = ctx.canvas.width;
    let height = ctx.canvas.height;
    let inset = 48;
    let config: graphConfig = {
      width: width,
      height: height,
      inset: inset
    }
    // clean up
    ctx.clearRect(0, 0, width, height);

    // if timetable: draw the thing
    if (timetable) {
      // setup
      //ctx.fillStyle = "#83C3D8";
      //ctx.strokeStyle = "#ADD8E6";
      ctx.fillStyle = "black"
      ctx.strokeStyle = "black";
      ctx.lineWidth = 6;
      ctx.font = "30px Arial"

      this.drawAxis(ctx, config);
    }
    
  }
}

export default function Map() {
  const router = useRouter()
  const {id} = router.query
  const ref = useRef();

  const graph = new TSTGraph(Number(id));

  useEffect(() => {
    const redrawIfNecessary = (e: CustomEvent) => {
      if (e.detail.id == id) {
        let canvas: HTMLCanvasElement = ref.current;
        let ctx = canvas.getContext("2d");
        graph.draw(ctx);
      }
    }
    const setCanvasSize = () => {
        let canvas: HTMLCanvasElement = ref.current;
        let ctx = canvas.getContext("2d");
        let parent: HTMLElement = canvas.parentNode as HTMLElement;

        canvas.width  = 2 * Number(window.getComputedStyle(parent).width.slice(0, -2));
        canvas.height = 2 * Number(window.getComputedStyle(parent).height.slice(0, -2));

        graph.draw(ctx);
    }
    setCanvasSize();
  
    window.addEventListener("resize", setCanvasSize);
    window.addEventListener("timetable_changed", redrawIfNecessary);
    return () => {
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("timetable_changed", redrawIfNecessary);
    };
  });

  return (
      <div className={styles.map_container}>
        <canvas ref={ref} className={styles.timetable_map}></canvas>
      </div>
  )
}
