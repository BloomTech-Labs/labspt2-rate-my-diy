import React from 'react';
import PasswordChange from '../../PasswordChange/PasswordChange';
import ProfileInfo from '../../Profile/ProfileInfo';

export default function Settings(props) {
  return (
    <div>
      <ProfileInfo email={props.email} user={props.user} />
      <PasswordChange />
    </div>
  );
}
