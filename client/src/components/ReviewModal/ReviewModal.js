import './ReviewModal.scss';
import { Query } from 'react-apollo';
import React, {Component} from 'react';
import { getReviews } from '../../query/query'



 class ReviewModal extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       
    }
  }

  onReviewSelected = review => {
   
  }
  
// render() {
//  return (
//   <div>
//    const Reviews = ({ Review }) => ({
//     <Query query={GET_REVIEWS}>
//      {({ loading, error, data }) => {
//      if (loading) return "Loading...";
//      if (error) return `Error! ${error.message}`;
//      console.log(data);

//      return (

//      <div>

//      </div>
//     );
//      }}
//     </Query>
//    }) 
//   </div>
//  )}

render() {

const Reviews = ({Review}) => (
  <Query 
  query={getReviews}>
  
 {({ loading, error, data }) => {
     if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

   return (
    <div className="card-container">
         {data.reviews.map(({ id, text, name, timestamp, Author, ProjectReviewed }) => (
    `${console.log(ProjectReviewed)}`,
           <div key={id}>
             <p className="review-name">
             {`${ Author.username} `}
              </p>
              <p>
               {`${name}`}
              </p>
              <img
               className="review-img"
               src={`${ProjectReviewed.titleImg}`}
              />
              <p>{`${name}`}</p>
           </div>
         ))}
       </div>
     );
   }}






  </Query>
)

return (
 <div>
  <Reviews />
 </div>
)
}

}

export default ReviewModal
