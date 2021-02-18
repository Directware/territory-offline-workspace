import {Injectable} from '@angular/core';
import {SettingsState} from '../../store/settings/settings.reducer';
import {Plugins} from "@capacitor/core";
import {  CapacitorDataStorageSqlite } from 'capacitor-data-storage-sqlite';
const {Device} = Plugins;

@Injectable({providedIn: 'root'})
export class SettingsDatabaseService
{
  private _storage;
  private readonly TO_SETTINGS_DB_NAME = 'territory-offline-settings';
  private readonly SETTINGS_PREFIX = "to-settings";

  constructor()
  {
  }

  public async initAppropriateSQLite()
  {
    const info = await Device.getInfo();
    if (info.platform === "ios" || info.platform === "android")
    {
      this._storage = CapacitorDataStorageSqlite;
    }
    else
    {
      this._storage = CapacitorDataStorageSqlite
    }

    await this._storage.openStore({database: this.TO_SETTINGS_DB_NAME});
  }

  public async load(): Promise<SettingsState>
  {
    const dataStorageResult = await this._storage.get({key: this.SETTINGS_PREFIX});
    return JSON.parse(dataStorageResult.value);
  }

  public async create(entity: SettingsState): Promise<SettingsState>
  {
    return this.writeToDatabase(entity);
  }

  public async update(entity: SettingsState): Promise<SettingsState>
  {
    return this.writeToDatabase(entity);
  }

  public async upsert(entity: SettingsState)
  {
    return this.writeToDatabase(entity);
  }

  public async clear()
  {
    await this._storage.clear();
  }

  private async writeToDatabase(entity: SettingsState): Promise<SettingsState>
  {
    await this._storage.set({
      key: `${this.SETTINGS_PREFIX}`,
      value: JSON.stringify({
        ...entity,
        isAppLocked: true,
        secretKey: null // Der entschlüsselte Secret Key darf nicht gespeichert werden
      })
    });

    return entity;
  }
}
