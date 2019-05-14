import React from 'react';
import ReactCloudinaryUploader from '@app-masters/react-cloudinary-uploader';
import { Redirect } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { editUser } from '../../query/query';
import './Profile.scss';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';

class ProfileInfo extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.user) {
      this.state = {
        userProfileImage: this.props.user.userProfileImage,
        bio: this.props.user.bio,
        username: this.props.user.username
      };
    }
    else {
      this.state = {
        userProfileImage: "",
        bio: "",
        username: ""
      }
    }
  }

  componentDidMount() {

    if (this.props.user) {
      const user = this.props.authUser

    if (user !== null && user !== undefined) {
      if (user.email !== this.props.email) {
        return <Redirect to="/" />;
      }
      return null;
    } else {
      //Redirect
      return <Redirect to="/" />;
    }
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
        this.addImg(image);
      })
      .catch((err) => {
        console.error({ error: err });
      });
  };

  render() {
    if (this.props.user) {
      return (
        <Mutation mutation={editUser}>
          {(editUser, { loading, data, error }) => {
            if (loading) return <div>Loading...</div>;
            if (error) {
              console.log({ error });
              return <div>There was an error.</div>;
            }
            return (
              <div className="profile-form-flex-container">
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
                  }}
                >
                  <h2>{`${this.state.username}`}</h2>
                  <div className="img-container">
                    <img src={this.state.userProfileImage} alt="profile" />
                  </div>
                  <button onClick={this.openCloudinary}>Set Profile Image</button>
                  <h3>Bio</h3>
                  <textarea
                    name="bio"
                    value={this.state.bio}
                    onChange={this.textChange}
                  />
                  <button type="submit">Submit</button>
                </form>
              </div>
            );
          }}
        </Mutation>
      );
    } else {
      return (
        <div className="profile-form-flex-container">
        
                <form>
                  <h2><Skeleton/></h2>
                  <div className="img-container">
                    <Skeleton/>
                  </div>
                  <button><Skeleton/></button>
                  <h3><Skeleton/></h3>
                  <Skeleton count={5}/>
                  <button><Skeleton/></button>
                </form>
                
              </div>
      )
    }
    
  }
}

export default ProfileInfo;
