import './event.css'
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

function Event(props) {
  return (
    <div>
      <Link className="listing" to={`/event/${props.message.id}`}>
        <div className='listing-info-left centerImage'>
          <img className='fill-vertical' src={props.message.coverImage}></img>
        </div>
        <div className='listing-info-right'>
          <div className='listing-info-container'>
            <p className='listing-info infos'>{props.message.title}<br />{props.message.fieldName}</p>
            <p className='listing-info'>{dayjs(props.message.timeGatesOpenAt.toDate()).format('ll')}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Event