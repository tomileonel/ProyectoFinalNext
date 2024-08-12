
import Image from 'next/image';


const ProfileHeader = ({ image }) => {
    return (
      <div className="profile-header">
        <Image src={image} alt="profile image" width={100} height={100} />
       
      </div>
    );
  };