"use client";
import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
  const dataInit = [
    {
      solved: false,
      color: "#b48ead",
      title: "Ice Cream Flavors",
      elems: ["strawberry", "chocolate", "vanilla", "brownie"],
    },
    {
      solved: false,
      color: "#a3be8c",
      title: "Colours",
      elems: ["blue", "red", "green", "yellow"],
    },
    {
      solved: false,
      color: "#ebcb8b",
      title: "Cities",
      elems: ["New York", "London", "Melbourne", "Sydney"],
    },
    {
      solved: false,
      color: "#d08770",
      title: "Planets",
      elems: ["Mars", "Earth", "Jupiter", "Saturn"],
    },
  ];

  function shuffle(array: Array<any>) {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  const vals = [];
  for (let elem of dataInit) {
    vals.push(...elem.elems);
  }

  const [data, setData] = useState<
    Array<{
      solved: boolean;
      color: string;
      title: string;
      elems: string[];
    }>
  >(dataInit);
  const [mistakes, setMistakes] = useState(4);
  const [mistakeAnim, setMistakeAnim] = useState(false);
  const [selected, setSelected] = useState<Array<string>>([]);
  const [remaining, setRemaining] = useState(shuffle(vals));
  const [solved, setSolved] = useState<Array<string>>([]);

  const renderTries = () => {
    let newMistakes = [];
    for (let i = 0; i < mistakes; i++) {
      newMistakes.push(<span>O</span>);
    }
    return newMistakes;
  };

  return (
    <main className={styles.main}>
      <div>Create four groups of four!</div>
      <div
        style={{
          display: "grid",
          gridTemplateRows: "repeat(4, 1fr)",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0.5rem",
          minHeight: "70cqh",
        }}
      >
        {data
          .filter((elem) => elem.solved)
          .map(
            (index: {
              solved: boolean;
              color: string;
              title: string;
              elems: string[];
            }) => (
              <div
                className={styles.emphasizeAnim}
                style={{
                  gridColumn: "1/-1",
                  backgroundColor: index.color,
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  fontSize: "1.6vh",
                  borderRadius: "20px",
                }}
                key={index.title}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div>{index.title}</div>
                  <div style={{ display: "flex" }}>
                    {index.elems.map((elem: string) => elem + " ")}
                  </div>
                </div>
              </div>
            )
          )}
        {remaining.map((elem) => (
          <div
            className={styles.square}
            style={{
              padding: "2px",
              fontSize: "1.6vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              textAlign: "center",
              cursor: "pointer",
              aspectRatio: 1,
              borderRadius: "20%",
              color: selected.includes(elem) ? "#3b4252" : undefined,
              backgroundColor: selected.includes(elem) ? "#d8dee9" : "#4c566a",
            }}
            onClick={() => {
              if (!selected.includes(elem) && selected.length == 4) {
                return;
              }
              if (selected.includes(elem)) {
                setSelected(selected.filter((newElem) => newElem !== elem));
              } else {
                setSelected(selected.concat(elem));
              }
            }}
            key={elem}
          >
            {elem.toUpperCase()}
          </div>
        ))}
      </div>
      <div
        onAnimationEnd={() => {
          setMistakeAnim(false);
        }}
        className={`${mistakeAnim ? styles.mistakeAnim : ""}`}
      >
        mistakes remaining: {...renderTries()}
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
        }}
      >
        <div className={`${styles.button} ${styles.buttonActive}`}>shuffle</div>
        <div
          onClick={() => setSelected([])}
          className={`${styles.button} ${styles.buttonActive}`}
        >
          deselect all
        </div>
        <div
          className={`${styles.button} ${
            selected.length == 4 ? styles.buttonActive : undefined
          }`}
          style={{
            cursor: selected.length !== 4 ? "default" : "pointer",
            border: selected.length !== 4 ? "none" : "",
          }}
          onClick={() => {
            if (selected.length !== 4) {
              return;
            }
            let index = 0;
            for (var val of [...data.filter((elem) => !elem.solved)]) {
              if (val.elems.sort().toString() == selected.sort().toString()) {
                let dataCopy = [
                  ...data.filter((elem) => elem.title !== val.title),
                ];
                val.solved = true;
                dataCopy.push(val);
                setData(dataCopy);
                setSolved(solved.concat(val.title));
                setRemaining(
                  remaining.filter((elem) => !selected.includes(elem))
                );
                setSelected([]);
                return;
              }
              index++;
            }
            setMistakes(mistakes - 1);
            setMistakeAnim(true);
            if (mistakes == 1) {
              setSelected([]);
              index = 0;
              setRemaining([]);
              let newData = [];
              for (let elem of data) {
                elem.solved = true;
                newData.push(elem);
              }
              setData(newData);
            }
          }}
        >
          submit
        </div>
      </div>
    </main>
  );
}
