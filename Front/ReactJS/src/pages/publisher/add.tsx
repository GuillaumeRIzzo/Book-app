import { withNoSSR } from "@/components/common/withNoSSR";
import PublisherForm from "@/features/publishers/PublisherForm";

const AddAuthor: React.FC = () => {
  return <PublisherForm title="Ajout d'un éditeur"/>
}

export default withNoSSR(AddAuthor);