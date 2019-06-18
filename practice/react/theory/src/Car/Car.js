import React from "react";
import "./Car.css";

class Car extends React.Component {
  render() {
    const inputClasses = [`input`];

    if (this.props.name !== ``) {
      inputClasses.push(`green`);
    } else {
      inputClasses.push(`red`);
    }

    if (this.props.name.length > 3) {
      inputClasses.push(`bold`);
    }

    return (
      <div className="Car">
        <h3>Car name is: {this.props.name}</h3>
        <p>
          Year:
          <strong>{this.props.year}</strong>
        </p>
        <input
          className={inputClasses.join(` `)}
          type="text"
          onChange={this.props.onChangeName}
          value={this.props.name}
        />
        <button onClick={this.props.onDelete}>Delete</button>
      </div>
    );
  }
}

export default Car;