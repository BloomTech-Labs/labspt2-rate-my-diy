import React from 'react'
import SearchBar from '../searchbar/searchbar'

const categoryBar = () => {
  return (
    <form>
      <select name="Category">
        <option value="home improvement">Home Improvement</option>
        <option value="cocktails">Cocktails</option>
        <option value="kitchen">Kitchen</option>
        <option value="music">Music</option>
      </select>
      <select name="Project">
        <option value="home improvement">Home Improvement</option>
        <option value="cocktails">Cocktails</option>
        <option value="kitchen">Kitchen</option>
        <option value="music">Music</option>
      </select>
      <select name="Maker">
        <option value="home improvement">Home Improvement</option>
        <option value="cocktails">Cocktails</option>
        <option value="kitchen">Kitchen</option>
        <option value="music">Music</option>
      </select>
      <select name="Reviewer">
        <option value="home improvement">Home Improvement</option>
        <option value="cocktails">Cocktails</option>
        <option value="kitchen">Kitchen</option>
        <option value="music">Music</option>
      </select>
      <SearchBar />
      <div>
        <div>Filter By:</div>
        <select name="Option">
          <option value="Category">Category</option>
          <option value="Project">Project</option>
          <option value="Maker">Maker</option>
          <option value="Reviewer">Reviewer</option>
        </select>
      </div>
      <div>
        <div>Sort By:</div>
        <select name="Option">
          <option value="Category">Category</option>
          <option value="Project">Project</option>
          <option value="Maker">Maker</option>
          <option value="Reviewer">Reviewer</option>
        </select>
      </div>
    </form>
  )
}

export default categoryBar
