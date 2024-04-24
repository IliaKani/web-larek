import {IEvents} from '../../types/index';

export abstract class Model<T> {
    constructor(data: Partial<T>, protected events: IEvents) {
        Object.assign(this, data);
    }

    // tell everyone about model changes
    emitChanges(event: string, payload?: object) {
        this.events.emit(event, payload ?? {});
    }
}