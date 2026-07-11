import { withNoSSR } from "@/components/common/withNoSSR";
import PublisherForm from "@/features/publishers/PublisherForm";

const EditPublisher: React.FC = () => {
  return <PublisherForm title="Modification de l'éditeur" />
}

export default withNoSSR(EditPublisher);