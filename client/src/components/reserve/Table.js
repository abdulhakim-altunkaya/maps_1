import React from 'react';
import { Cities } from "./data/Cities";

function Table() {
  return (
    <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Age</th>
        <th>City</th>
      </tr>
    </thead>
    <tbody>
      {Cities.map((myVar, index) => (
        <tr key={index}>
          <td>{myVar.name}</td>
          <td>{myVar.age}</td>
          <td>{myVar.city}</td>
        </tr>
      ))}
    </tbody>
  </table>
  )
}

export default Table;