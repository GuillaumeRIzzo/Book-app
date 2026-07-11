import { withNoSSR } from "@/components/common/withNoSSR";
import CategoryForm from "@/features/categories/CategoryForm";

const EditCategory: React.FC = () => {
  return <CategoryForm title="Modification de l'auteur" />
}

export default withNoSSR(EditCategory);