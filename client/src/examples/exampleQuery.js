import React from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";

function exampleQuery() {
	return (
		<div>
			<Query
				query={gql`
					{
						users(orderBy: username_ASC) {
							id
							username
							email
						}
					}
				`}>
				{({ loading, error, data }) => {
					if (loading) return <p>Loading...</p>;
					if (error) return <p>Error :(</p>;

					return data.users.map(({ id, username, email }) => (
						<div key={id}>
							<p>{username}</p>
							<p>{email}</p>
						</div>
					));
				}}
			</Query>
		</div>
	);
}

export default exampleQuery;
