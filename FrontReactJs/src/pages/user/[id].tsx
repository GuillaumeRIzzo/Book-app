import UserForm from "@/features/users/userProfileForm/UserProfileForm";

const Profile: React.FC = () => {
  return (
    <div className="flex justify-center bg-background">
      <UserForm title="Modification de votre profil" />
    </div>
  );
};

export default Profile;
