import { UserProfileForm } from "@/features/users/userProfileForm";

const Profile: React.FC = () => {
  return (
    <div className="flex justify-center bg-background">
      <UserProfileForm title="Modification de votre profil" />
    </div>
  );
};

export default Profile;
