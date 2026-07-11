import { withNoSSR } from "@/components/common/withNoSSR";
import BookForm from "@/features/books/BookForm";

const EditBook: React.FC = () => {
  return <BookForm />
}

export default withNoSSR(EditBook);