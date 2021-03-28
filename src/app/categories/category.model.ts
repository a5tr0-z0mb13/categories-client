import { classToPlain, plainToClass, Exclude, Expose } from 'class-transformer';

@Exclude()
export class Category {
  @Expose({ groups: ['findAll', 'update'] })
  id: number;

  @Expose({ groups: ['findAll', 'update', 'create'] })
  parentId: number;

  @Expose({ groups: ['findAll', 'update', 'create'] })
  label: string;

  public static deserialize(json: any, groups: string[]): Category {
    return plainToClass<Category, Object>(Category, json, { groups: groups });
  }

  public serialize(groups: string[]): any {
    return classToPlain<Category>(this, { groups: groups });
  }
}
