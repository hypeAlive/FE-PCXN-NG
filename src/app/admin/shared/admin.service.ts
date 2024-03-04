import {Injectable} from '@angular/core';
import {ModeService} from "../../mode/shared/mode.service";
import {Languages} from "../../shared/languages";
import {ModData} from "../../shared/types/mod.types";
import {Optional} from "../../shared/optional";
import {DataService} from "../../shared/data.service";
import {Category, CategoryCreation} from "../../shared/types/categories.types";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public MOD_SETTINGS: Optional<ModData> = Optional.empty();

  public CATEGORY_SETTINGS: Optional<Category[]> = Optional.empty();

  constructor(private mode: ModeService, private data: DataService) {
  }

  getCategories(language: Languages) {
    return this.mode.getCategories(language);
  }

  getModSettings() {
    if (this.MOD_SETTINGS.isPresent()) {
      return Promise.resolve(this.MOD_SETTINGS.get());
    }
    return this.data.getModData().then(mod => {
      this.MOD_SETTINGS = Optional.of(mod);
      return mod;
    });
  }

  updateModSettings(mod: Partial<ModData>) {
    return this.data.saveModData(mod)
      .then(mod => {
        this.MOD_SETTINGS = Optional.of(mod);
        return mod;
      }).catch(e => {
        throw e;
      });
  }

  getCategoriesSettings() {
    if (this.CATEGORY_SETTINGS.isPresent()) {
      return Promise.resolve(this.CATEGORY_SETTINGS.get());
    }
    return this.data.getCategoryData().then(categories => {
      this.CATEGORY_SETTINGS = Optional.of(categories);
      return categories;
    });
  }

  deleteCategory(category: Category) {
    return this.data.deleteCategory(category).then(bool => {
      if (bool) {
        if (this.CATEGORY_SETTINGS.isPresent()) {
          this.CATEGORY_SETTINGS.get().splice(this.CATEGORY_SETTINGS.get().indexOf(category), 1);
        }
      }
    }).catch(e => {
      throw e;
    });
  }

  createCategory(category: CategoryCreation) {
    return this.data.createCategory(category).then(cat => {
      if (this.CATEGORY_SETTINGS.isPresent()) {
        this.CATEGORY_SETTINGS.get().push(cat);
      }
      return cat;
    }).catch(e => {
      throw e;
    });
  }

  updateCategory(category: Partial<Category>) {
    return this.data.updateCategory(category).then(cat => {
      if (this.CATEGORY_SETTINGS.isPresent()) {
        const index = this.CATEGORY_SETTINGS.get().findIndex(c => c.pcxnId === category.pcxnId);
        if (index !== -1) {
          this.CATEGORY_SETTINGS.get()[index] = cat;
        } else {
          throw new Error('Category not found');
        }
      }
      return cat;
    }).catch(e => {
      throw e;
    });
  }

}
