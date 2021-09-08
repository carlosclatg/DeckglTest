    //:host
  export const hostStyle = {
    display: "block",
    position: "relative"
  }
  
  //:host > div:host > div
  export const divInsideHost ={
    zIndex: 1000
  }
  
  //#top-right
  export const topRight= {
    position:"absolute",
    top:"10px",
    right:"10px",
    width:"30px",
    minHeight:"50px",
    backgroundColor:"#f2f2f2",
    borderRadius:"8px",
    border:"1px solid darkgray",
    zIndex:"1000"
  }
  
  //#top-right > div 
  export const divInsideTopRight = {
    margin: "4px",
    textAlign: "center",
    cursor: "pointer"
  }
  
  //::slotted([slot=top-left])
  export const slotTopLeft = {
    position:"absolute",
    top: "10px",
    left: "10px",
    zIndex: 1000,
  }
  
  
  //::slotted([slot=bottom-left])
  export const slotBottomLeft = {
    position:"absolute",
    bottom: "10px",
    left: "10px",
    zIndex: 1000,
  }
  
  //::slotted([slot=bottom-right])
  export const slotBottomRight = {
    position:"absolute",
    bottom: "10px",
    right: "10px",
    zIndex: 1000,
  }