import { BehaviorSubject } from "rxjs";

export class BehaviorSubjectMenu {

    private contrato = new BehaviorSubject<any>({});
    rutaContratoActual = this.contrato.asObservable();

    public changeMenuActual(object: any) {
        this.contrato.next(object);
    }
}