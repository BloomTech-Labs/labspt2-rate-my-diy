import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ReviewCard from '../ReviewCard/ReviewCard';
import { Link } from 'react-router-dom';

// const json = localStorage.getItem("authUser")
// const user = JSON.parse(json)
// const email = user.email

// console.log({user, email})

const GET_REVIEWS = gql`
  query reviews($email: String!) {
    reviews(where: { Author: { email: $email } }, orderBy: timestamp_DESC) {
      id
      name
      rKey
      text
      timestamp
      thumbsUp
      thumbsDown
      Author {
        id
        username
        email
      }
      ProjectReviewed {
        id
        name
        titleImg
        timestamp
        User {
          id
          username
        }
      }
    }
  }
`;

const GET_USER = gql`
  query user($email: String!) {
    user(where: { email: $email }) {
      id
      username
    }
  }
`;

class ReviewList extends React.Component {
  render() {
    const json = localStorage.getItem('authUser');
    const user = JSON.parse(json);
    const email = this.props.email || user.email || 'asldkf@gmail.com';

    const ReviewListWithData = () => (
      <Query query={GET_REVIEWS} variables={{ email: email }}>
        {({
          loading: reviewsLoading,
          error: reviewsError,
          data: reviewsData
        }) => (
          <Query query={GET_USER} variables={{ email: email }}>
            {({ loading: userLoading, data: userData, error: userError }) => {
              if (reviewsLoading || userLoading) return 'Loading...';
              if (reviewsError || userError) return `Error!`;
              if (reviewsData && userData)
                console.log({ reviewsData: reviewsData, userData: userData });

              if (reviewsData.reviews[0]) {
                return (
                  <div>
                    <h1>{`${userData.user.username}'s Reviews`}</h1>
                    {reviewsData.reviews.map((review) => {
                      return <ReviewCard key={review.id} review={review} />;
                    })}
                    <Link to={'/search'}>Go Review a New Project</Link>
                  </div>
                );
              } else {
                console.log(userData);
                return (
                  <div>
                    <h1>{`${userData.user.username}'s Reviews`}</h1>
                    <p>You haven't reviewed any projects.</p>
                    <Link to={'/search'}>Go Review a New Project</Link>
                  </div>
                );
              }
            }}
          </Query>
        )}
      </Query>
    );
    return <ReviewListWithData />;
  }
}

export default ReviewList;
