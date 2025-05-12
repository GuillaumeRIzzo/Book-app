export enum ModelType {
  Book = 'book',
  Author = 'author',
  Publisher = 'publisher',
  Category = 'category',
  User = 'user',
}

export const mapIdToCustomKeys = <T>(
  array: T[],
  type: ModelType
): T[] => {
  const keyMap: Record<ModelType, string> = {
    [ModelType.Book]: 'bookId',
    [ModelType.Author]: 'authorId',
    [ModelType.Publisher]: 'publisherId',
    [ModelType.Category]: 'bookCategoId',
    [ModelType.User]: 'userId',
  };

  const newKey = keyMap[type];

  return array.map(item => {
    const typedItem = item as any;

    // If the newKey already exists (example: 'bookId'), keep it
    if (typedItem[newKey] !== undefined) {
      return item;
    }

    // If 'id' exists (typical for Strapi or .NET), map it
    if (typedItem.id !== undefined) {
      return {
        ...item,
        [newKey]: typedItem.id,
      };
    }

    // Otherwise, return item unchanged
    return item;
  }) as T[];
};
