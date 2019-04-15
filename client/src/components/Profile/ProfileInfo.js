import React from 'react';
import ReactCloudinaryUploader from '@app-masters/react-cloudinary-uploader';
import gql from 'graphql-tag';
import { Redirect } from 'react-router-dom';
import { Query, Mutation } from 'react-apollo';
import { editUser } from '../../query/query';

const GET_USER = gql`
  query user($email: String!) {
    user(where: { email: $email }) {
      id
      username
      userProfileImage
      bio
      email
    }
  }
`;

class ProfileInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfileImage: '',
      bio: ''
    };
  }

  componentDidMount() {
    const user = localStorage.getItem('authUser');
    const json = JSON.parse(user);

    if (json !== null && json !== undefined) {
      if (json.email !== this.props.email) {
        return <Redirect to="/" />;
      }
      return null;
    } else {
      //Redirect
      return <Redirect to="/" />;
    }
  }

  textChange = async (e) => {
    let value = e.target.value;
    await this.setState({
      ...this.state,
      [e.target.name]: value
    });
  };

  addImg = (img) => {
    this.setState({
      ...this.state,
      userProfileImage: img
    });
  };

  openCloudinary = (e) => {
    e.preventDefault();
    let options = {
      cloud_name: 'dv1rhurfd',
      upload_preset: 'korisbak',
      returnJustUrl: true,
      maxImageWidth: 400,
      maxImageHeight: 500
    };
    ReactCloudinaryUploader.open(options)
      .then((image) => {
        if (this.props.returnJustUrl) image = image.url;
        this.addImage(image);
      })
      .catch((err) => {
        console.error({ error: err });
      });
  };

  render() {
    const email = this.props.email;
    return (
      <Query query={GET_USER} variables={{ email: email }}>
        {({
          loading: userLoading,
          data: userData,
          error: userError,
          refetch: userRefetch
        }) => (
          <Mutation mutation={editUser}>
            {(
              editUser,
              { loading: editLoading, data: editData, error: editError }
            ) => {
              if (userLoading || editLoading) return <div>Loading...</div>;
              if (userError || editError) {
                console.log({ userError: userError, editError: editError });
                return <div>There was an error.</div>;
              }
              if (userData || editData) {
                console.log({ userData: userData, editData: editData });
                return <div>Complete</div>;
              }
              return (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await editUser({
                      variables: {
                        userProfileImage: this.state.userProfileImage,
                        bio: this.state.bio,
                        email: this.props.email
                      }
                    });
                    await userRefetch();
                    await this.setState({
                      ...this.state,
                      userProfileImage: userData.user.userProfileImage,
                      bio: userData.user.bio
                    });
                  }}
                >
                  <div>
                    <img src={this.state.userProfileImage} />
                  </div>
                  <button onClick={this.openCloudinary}>
                    Set Profile Image
                  </button>
                  <h3>Bio</h3>
                  <textarea
                    rows="6"
                    cols="75"
                    name="bio"
                    value={this.state.bio}
                    onChange={this.textChange}
                  />
                  <button type="submit">Submit</button>
                </form>
              );
            }}
          </Mutation>
        )}
      </Query>
    );
  }
}

export default ProfileInfo;
