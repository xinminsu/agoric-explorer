import './Card.scss';

const Card = ({ children, header }) => {
  return (
    <div className="Card">
      <div className="Content">{children}</div>
    </div>
  );
};

export default Card;
