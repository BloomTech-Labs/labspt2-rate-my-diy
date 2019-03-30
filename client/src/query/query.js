import gql from 'graphql-tag';

const getUsers = gql`
	{
	    users {
		    id
			username
			userProfileImage
		  }
	}
`;
const getProjects = gql`
    {
		projects {
			id
			name
			titleImg
			category
			rating
			User{
				username
			}
		}
	}
`;

const getReviews = gql`
	{
		reviews {
			id
			name
			text
			editedAt
			Author {
			  id
			  username
			}
			ProjectReviewed {
			  id
			  name
			}
		}
	}
`;

module.exports = {getUsers, getProjects, getReviews}