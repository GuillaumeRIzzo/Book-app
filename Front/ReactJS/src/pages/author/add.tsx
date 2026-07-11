import { withNoSSR } from "@/components/common/withNoSSR";
import AuthorForm from "@/features/authors/AuthorForm";

const AddAuthor: React.FC = () => {
  return <AuthorForm title="Ajout d'un auteur"/>
}

export default withNoSSR(AddAuthor);