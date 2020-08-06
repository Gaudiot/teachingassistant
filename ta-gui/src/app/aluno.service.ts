import { Injectable }    from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, map } from 'rxjs/operators';

import { Aluno } from '../../../common/aluno';

import AlunoDuplicado from '../../../common/alunoDuplicado';

@Injectable()
export class AlunoService {

  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private taURL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  criar(aluno: Aluno): Observable<Aluno | AlunoDuplicado> {
    return this.http.post<any>(this.taURL + "/aluno", aluno, {headers: this.headers})
      .pipe(
        retry(2),
        map( res => {
          if (res.success) {
            return aluno;
          } else {
            return {cpf: res.failure.cpf, github: res.failure.github} as AlunoDuplicado;
          }
        } )
      );
  }

  deletar(cpf: string): Observable<void>{
    return this.http.delete<any>(this.taURL + `/aluno/:${cpf}`)
    .pipe(
      retry(2)
    );
  }

  atualizar(aluno: Aluno): Observable<Aluno> {
    return this.http.put<any>(this.taURL + "/aluno",JSON.stringify(aluno), {headers: this.headers})
      .pipe(
        retry(2),
        map( res => {if (res.success) {return aluno;} else {return null;}} )
      );
  }

  getAlunos(): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(this.taURL + "/alunos")
      .pipe(
      retry(2)
    );
  }
}
