import { factories } from '@strapi/strapi';
import { encryptData } from '../../../utils/encyrpt';

const contentTypeUID = 'api::book.book' as any;

export default factories.createCoreController(contentTypeUID, ({ strapi }) => ({
  async find(ctx) {
    const books = await strapi.entityService.findMany(contentTypeUID, {
      ...ctx.query,
      populate: ['authorId', 'publisherId', 'categories'],
    });

    const shapedBooks = books.map((book: any) => ({
      ...book,
      authorId: book.authorId?.id ?? 0,
      publisherId: book.publisherId?.id ?? 0,
      categories: book.categories?.map((cat: any) => ({
        categoryId: cat.id,
        bookCategoName: cat.bookCategoName,
        bookCategoDescription: cat.bookCategoDescription
      })) ?? [],
    }));

    return encryptData(shapedBooks);
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const book = await strapi.entityService.findOne(contentTypeUID, id, {
      ...ctx.query,
      populate: ['authorId', 'publisherId', 'categories'],
    });
    
    const shapedBook = {
      ...book,
      authorId: (book as any).authorId?.id ?? 0,
      publisherId: (book as any).publisherId?.id ?? 0,
      categories: (book as any).categories?.map((cat: any) => ({
        categoryId: cat.id,
        bookCategoName: cat.bookCategoName,
        bookCategoDescription: cat.bookCategoDescription
      })) ?? [],
    };    
    
    return encryptData(shapedBook);
  },
}));
