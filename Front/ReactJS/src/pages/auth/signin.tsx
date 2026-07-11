import { withNoSSR } from "@/components/common/withNoSSR";
import UserForm from "@/features/users/UserForm"

const SignIn: React.FC = () => {
  return (
    <div className="flex justify-center bg-background">
      <UserForm title="Inscription"/>
    </div>
  );
};

export default withNoSSR(SignIn);
