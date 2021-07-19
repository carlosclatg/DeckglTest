import React from 'react';


const ControlPanel = ({toogleDraw, emitevent, zoommin, zoomout, addLayer, removeLayer}) =>{


  const renderInput = (key, displayName, action) => {
    return (
      <div className="input">
        <label>{displayName}</label>
        <input
          data-id={key}
          type="checkbox"
          onChange={e => action(e.target.checked)}
        />
      </div>
    );
  }

    return (
      <div style={{ position: 'relative', zIndex: '100' }}>
        {renderInput('drawingmode', 'draw-selection-mode', toogleDraw)}
        {renderInput('emitevent', 'othermode', emitevent)}
        <button onClick={zoommin}>+</button>
        <button onClick={zoomout}>-</button>
        <button onClick={addLayer}>ADD</button>
        <button onClick={removeLayer}>REMOVE WMS</button>
      </div>
    )
}

export default ControlPanel;