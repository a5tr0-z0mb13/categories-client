import { Category } from './category.model';

describe('Category', () => {
  const id = 2;
  const parentId = 1;
  const label = 'Label';

  describe('deserialize', () => {
    let category: Category;
    let json: any;

    beforeEach(() => {
      json = {
        id: id,
        parentId: parentId,
        label: label
      };
    });

    it('should deserialize JSON into an instance of a Category for the findAll group', () => {
      category = new Category();
      category.id = id;
      category.parentId = parentId;
      category.label = label;

      expect(Category.deserialize(json, ['findAll'])).toEqual(category);
    });

    it('should deserialize JSON into an instance of a Category for the update group', () => {
      category = new Category();
      category.id = id;
      category.parentId = parentId;
      category.label = label;

      expect(Category.deserialize(json, ['update'])).toEqual(category);
    });

    it('should deserialize JSON into an instance of a Category for the create group', () => {
      category = new Category();
      category.parentId = parentId;
      category.label = label;

      expect(Category.deserialize(json, ['create'])).toEqual(category);
    });
  });
});
