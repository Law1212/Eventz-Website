import Event from "../Event/Event"
import './tempEvents.css'


function TempEvents(props) {
  const events = props.events;

  return (
    <div>
      <div className="tempEventsMain">
        {events && events.map(event => <Event key={event.id} message={event} />)}
      </div>
    </div>
  )
}

export default TempEvents