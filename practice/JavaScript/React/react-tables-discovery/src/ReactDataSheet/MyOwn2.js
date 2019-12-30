import React from "react";
import _ from "lodash";
import * as mathjs from "mathjs";
import Datasheet from "react-datasheet";

export default class MathSheet extends React.Component {
  constructor(props) {
    super(props);
    this.onCellsChanged = this.onCellsChanged.bind(this);
    this.state = {
      "00": { key: "0", value: "Наименование", readOnly: true, expr: "" },
      "01": { key: "1", value: "раз", readOnly: true, expr: "" },
      "02": { key: "2", value: "два", readOnly: true, expr: "" },
      "03": { key: "3", value: "три", readOnly: true, expr: "" },
      "04": { key: "4", value: "четыре", readOnly: true, expr: "" },
      A0: { key: "A0", value: "Январь", readOnly: true, expr: "" },
      A1: { key: "A1", value: "200", expr: "200" },
      A2: {
        key: "A2",
        value: "200",
        expr: "=A1",
        className: "equation",
        readOnly: true
      },
      A3: { key: "A3", value: "", expr: "" },
      A4: { key: "A4", value: "", expr: "" },
      B0: { key: "B0", value: "Февраль", readOnly: true, expr: "" },
      B1: { key: "B1", value: "", expr: "" },
      B2: { key: "B2", value: "", expr: "" },
      B3: { key: "B3", value: "", expr: "" },
      B4: { key: "B4", value: "", expr: "" },
      C0: { key: "C0", value: "Март", readOnly: true, expr: "" },
      C1: { key: "C1", value: "", expr: "" },
      C2: { key: "C2", value: "", expr: "" },
      C3: { key: "C3", value: "", expr: "" },
      C4: { key: "C4", value: "", expr: "" },
      D0: { key: "D0", value: "Апрель", readOnly: true, expr: "" },
      D1: { key: "D1", value: "", expr: "" },
      D2: { key: "D2", value: "", expr: "" },
      D3: { key: "D3", value: "", expr: "" },
      D4: { key: "D4", value: "", expr: "" }
      // D0: { key: "D5", value: "", expr: "" }
    };
  }

  getCols(cells) {
    return Object.entries(cells).filter((cell, idx) => console.log(cell));
    // .map(filtredCell => filtredCell.value);
  }

  getRows(cells) {
    return Object.values(cells).filter((cell, idx) => +cell.key === idx);
    // .map(filtredCell => filtredCell.key);
  }

  generateGrid() {
    console.log(this.getCols(this.state));

    return this.getRows(this.state).map((row, i) =>
      ["", "A", "B", "C", "D"].map((col, j) => {
        if (i === 0 && j === 0) {
          return { readOnly: true, value: row.value };
        }
        // if (row === 0) {
        //   return { readOnly: true, value: col };
        // }
        if (j === 0) {
          return { readOnly: true, value: row.value };
        }
        return this.state[col + row.key];
      })
    );
  }

  validateExp(trailKeys, expr) {
    let valid = true;
    const matches = expr.match(/[A-Z][1-9]+/g) || [];
    matches.map(match => {
      if (trailKeys.indexOf(match) > -1) {
        valid = false;
      } else {
        valid = this.validateExp([...trailKeys, match], this.state[match].expr);
      }
      return undefined;
    });
    return valid;
  }

  computeExpr(key, expr, scope) {
    let value = null;
    if (expr.charAt(0) !== "=") {
      return { className: "", value: expr, expr: expr };
    } else {
      try {
        value = mathjs.evaluate(expr.substring(1), scope);
      } catch (e) {
        value = null;
      }

      if (value !== null && this.validateExp([key], expr)) {
        return { className: "equation", value, expr };
      } else {
        return { className: "error", value: "error", expr: "" };
      }
    }
  }

  cellUpdate(state, changeCell, expr) {
    const scope = _.mapValues(state, val =>
      isNaN(val.value) ? 0 : parseFloat(val.value)
    );
    // console.log(changeCell, scope);
    const updatedCell = _.assign(
      {},
      changeCell,
      this.computeExpr(changeCell.key, expr, scope)
    );
    // console.log(state[changeCell.key], updatedCell);
    state[changeCell.key] = updatedCell;

    _.each(state, (cell, key) => {
      if (
        cell.expr.charAt(0) === "=" &&
        cell.expr.indexOf(changeCell.key) > -1 &&
        key !== changeCell.key
      ) {
        state = this.cellUpdate(state, cell, cell.expr);
      }
    });
    return state;
  }

  onCellsChanged(changes) {
    const state = _.assign({}, this.state);
    console.log(changes);
    changes.forEach(({ cell, value }) => {
      this.cellUpdate(state, cell, value);
    });
    this.setState(state);
  }

  render() {
    console.log(this.generateGrid());
    console.log(this.state);
    return (
      <Datasheet
        data={this.generateGrid()}
        valueRenderer={cell => cell.value}
        dataRenderer={cell => cell.expr}
        onCellsChanged={this.onCellsChanged}
      />
    );
  }
}
