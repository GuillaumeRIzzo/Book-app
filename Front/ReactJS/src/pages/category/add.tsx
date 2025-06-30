import { withNoSSR } from "@/components/common/withNoSSR";
import CategoryForm from "@/features/categories/CategoryForm";

const AddAuthor: React.FC = () => {
  return <CategoryForm title="Ajout d'une catégorie"/>
}

export default withNoSSR(AddAuthor);