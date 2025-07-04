import { withNoSSR } from "@/components/common/withNoSSR";
import AuthorForm from "@/features/authors/AuthorForm";

const EditAuthor: React.FC = () => {
  return <AuthorForm title="Modification de l'auteur" />
}

export default withNoSSR(EditAuthor);