import gql from 'graphql-tag';

export const getUsers = gql`
	{
	    users {
		    id
			username
			userProfileImage
		  }
	}
`;
export const getProjects = gql`
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

export const getReviews = gql`
	{
		reviews {
			id
			name
			text
			timestamp
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

