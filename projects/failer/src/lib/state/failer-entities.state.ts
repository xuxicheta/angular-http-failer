import { Injectable } from '@angular/core';
import { AbstractEntityState } from './abstract-state.class';
import { FailerRequest } from '../models';
import { DbService } from '../indexeddb/db.service';

@Injectable()
export class FailerEntitiesState extends AbstractEntityState<FailerRequest> {

  constructor(
    private dbService: DbService<FailerRequest>,
  ) {
    super();
    super.createAll('requestId');
  }

  public async init(): Promise<void> {
    const entities = await this.dbService.retreiveAll().toPromise();
    super.setAll(entities || []);
  }

  public reset() {
    this.dbService.clear().subscribe();
    super.setAll([]);
  }

  public deleteEntity(requestId: string) {
    super.deleteEntity(requestId);
    this.dbService.delete(requestId).subscribe();
  }

  public upsertEntity(requestId: string, request: Partial<FailerRequest>): void {
    super.upsertEntity(requestId, request);

    this.dbService.lay(super.getEntity(requestId))
      .subscribe();
  }
}
