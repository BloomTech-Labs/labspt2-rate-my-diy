import React, { Component } from "react";
import SearchBar from "../Searchbar/Searchbar";
import { Query } from "react-apollo";
import { withAuthentication } from "../Session/session";

// import Featured from "../Home/Featured/Featured";
import Header from "../Home/Header/Header";
import "../Home/Home.scss";
import "./SearchPage.scss";

class SearchPage extends Component {
  constructor() {
    super();
    this.state = {
      userClicked: null,
    };
  }

  render() {
    
    const SearchWithData = () => (
			<Query query={this.props.getUsers}>

			{({ loading: loadingUsers, data: userData }) => (

					<Query query={this.props.getProjects}>

					{({ loading: loadingProjects, data: projectData}) => (

						<Query query={this.props.getReviews}>

						{({ loading: loadingReviews, data: reviewData}) => {

							if (loadingUsers || loadingProjects || loadingReviews) return <span>loading...</span>
              
              let userArray = [];
							let projectArray = [];
              let reviewArray = [];

							if (userData !== undefined) userArray = Object.values(userData).flat();

							if (projectData !== undefined) projectArray = Object.values(projectData).flat()
							
							if (reviewData !== undefined) reviewArray = Object.values(reviewData).flat()

							return (
								<SearchBar 
									{...this.props} 
									userClicked={this.state.userClicked} 
									users={userArray} 
									projects={projectArray} 
									reviews={reviewArray} 
									projectSearchHandler={this.props.projectSearchHandler} 
									userSearchHandler={this.props.userSearchHandler}
									reviewSearchHandler={this.props.reviewSearchHandler}/>
							)	
						}}</Query>
					
					)}
					</Query>
			)}
			</Query>
		);

    return (
      <div id="home-container">
        <Header />
        <SearchWithData />
        <h1>Results:</h1>
        {/* <div className="card-container"> */}
          {this.props.projects
            .map(({ id, name, titleImg, rating, User, category }) => (
              <div key={id} className="card-container">
                  <img src={`${titleImg}`} alt="project"/>
                  <div>{`${name}`}</div>
                  <div>{`${rating}`}</div>
                  <div>{`${category}`}</div>
                  <div>{`${User.username}`}</div>
              </div>
            ))
            .concat(
              this.props.users.map(({ id, username, userProfileImage }) => (
                <div key={id} className="card-container">
                    <img src={`${userProfileImage}`} alt="user"/>
                    <div>{`${username}`}</div>
                </div>
              ))
            )
            .concat(
              this.props.reviews.map(
                ({ id, name, text, timestamp, Author, ProjectReviewed }) => (
                <div key={id} className="card-container">
                    <div>{`${name}`}</div>
                    <div>{`${text}`}</div>
                    <div>{`${timestamp}`}</div>
                    <div>{`${Author.username}`}</div>
                    <div>{`${ProjectReviewed.name}`}</div>
                </div>
                )
              )
            )}
        {/* </div> */}
      </div>
    );
  }
}

export default withAuthentication(SearchPage);
