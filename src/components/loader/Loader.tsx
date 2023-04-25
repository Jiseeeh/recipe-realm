export default function Loader() {
  // can be reusable by props
  return (
    <div className="loader-container">
      <div className="loader">
        <p className="loading">preparing</p>
        <div className="words">
          <span className="word">ingredients</span>
          <span className="word">recipes</span>
          <span className="word">seasonings</span>
          <span className="word">condiments</span>
          <span className="word">specials</span>
        </div>
      </div>
    </div>
  );
}
