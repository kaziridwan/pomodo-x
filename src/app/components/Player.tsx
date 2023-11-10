import ReactPlayer from "react-player";

const PomoPlayer = (props : any) => {
  // player config
  // player state

  return (
    <div>
      <ReactPlayer {...props} muted/>
      <ReactPlayer {...props} url="https://www.youtube.com/watch?v=SuPFwIQ27kk&ab_channel=ThePrimeTime" style={{...props.style, display: "none"}}/>
    </div>
  )
}

export default PomoPlayer;