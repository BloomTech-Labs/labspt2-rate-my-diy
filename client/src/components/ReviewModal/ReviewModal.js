import './ReviewModal.scss';
import gql from 'graphql-tag'
import { Query } from 'react-apollo';
import React, {Component} from 'react';

const GET_REVIEWS = gql `
{
    reviews {
      id
      name
      rKey
      text
      timestamp
      thumbsUp
      LikedBy
      thumbsDown
      DislikedBy
      Author
      ProjectReviewed
    }
}`;

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
  query={GET_REVIEWS}>
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
