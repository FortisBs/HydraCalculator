import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { OwnDelegate } from "../models/user.interface";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(private firestore: AngularFirestore) {}

  updateDelegate(id: string, delegate: { ownDelegates: OwnDelegate[] }) {
    return this.firestore.collection('Delegates').doc(id).set(delegate);
  }

  getDelegate(id: string): Observable<OwnDelegate[]> {
    return this.firestore.doc(`Delegates/${id}`).valueChanges().pipe(
      map((data) => {
        // @ts-ignore
        return data.ownDelegates
      })
    );
  }

  getRegisteredDelegates(): Observable<OwnDelegate[]> {
    return this.firestore.collection('Delegates').valueChanges().pipe(
      map((data) => {
        // @ts-ignore
        return data.map((value) => value.ownDelegates).flat();
      })
    );
  }
}
