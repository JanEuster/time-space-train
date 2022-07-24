import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Timetable } from "../../../components/types";
import styles from "/styles/Timetable.module.css";

class TSTGraph {
  id: number;

  constructor(id: number) {
    this.id = id;
  }
  getCurrentTable = (): Timetable => {
    let tables: Timetable[] = JSON.parse(localStorage.getItem("tables"));
    for (let table of tables) {
      if (table.id == Number(this.id)) {
        return table
      }
    }
    return {} as Timetable
  }
  draw(): void {
    console.log("redraw")
    
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
        graph.draw();
      }
    }
  
    window.addEventListener("timetable_changed", redrawIfNecessary);
    return () => {
      document.removeEventListener("timetable_changed", redrawIfNecessary);
    };
  });

  return (
      <div className={styles.map_container}>
        <canvas ref={ref} className={styles.timetable_map}></canvas>
      </div>
  )
}
