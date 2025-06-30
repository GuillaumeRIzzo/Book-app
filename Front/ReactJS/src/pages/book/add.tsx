import { withNoSSR } from "@/components/common/withNoSSR";
import BookForm from "@/features/books/BookForm";

const AddBook: React.FC = () => {
  return <BookForm />
}

export default withNoSSR(AddBook);