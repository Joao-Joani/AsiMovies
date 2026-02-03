import { Component } from '@angular/core';
import { MovieInterface } from '../../shared/interfaces/movie-interface';
import { DatabaseService } from '../../shared/services/database.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  // VARIÁVEIS

  showAddMovieModal: boolean = false; // controle de exibição do modal de adição de filme
  selectedMovieForEdit: MovieInterface | null = null;
  searchQuery: string = ''; // controle de pesquisa de filmes
  displayedMovies: MovieInterface[] = []; // filmes exibidos na tela
  movies: MovieInterface[] = [];
  limit: number = 4; // 4 filmes no maximo por vez
  currentOffset: number = 0; // controle de visualização de filmes

  userRank: string = 'Espectador Iniciante';
  rankProgress: number = 0;
  nextLevelMessage: string = '';
  rankColor: string = '#95a5a6';

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(){
    this.databaseService.getCollection('movies').subscribe((movies: MovieInterface[])=>{
      this.movies = movies;
      this.calculateRank();
      this.displayedMovies = this.movies.slice(this.currentOffset, this.currentOffset + this.limit); // exibe os 4 filmes iniciais
    })
  }

  calculateRank() {
    const count = this.movies.length;
  
    if (count < 10) {
      this.userRank = 'Espectador Iniciante';
      this.rankColor = '#95a5a6';
      this.rankProgress = (count / 10) * 100;
      this.nextLevelMessage = `Faltam ${10 - count} filmes para o próximo nível!`;
    } 
    else if (count < 30) {
      this.userRank = 'Cinéfilo Amador';
      this.rankColor = '#3498db';
      this.rankProgress = ((count - 10) / (30 - 10)) * 100;
      this.nextLevelMessage = `Faltam ${30 - count} filmes para virar Crítico!`;
    } 
    else if (count < 60) {
      this.userRank = 'Crítico de Cinema';
      this.rankColor = '#f1c40f';
      this.rankProgress = ((count - 30) / (60 - 30)) * 100;
      this.nextLevelMessage = 'Rumo à direção de Hollywood!';
    } 
    else if (count < 100) {
      this.userRank = 'Diretor de Hollywood';
      this.rankColor = '#e67e22';
      this.rankProgress = ((count - 60) / (100 - 60)) * 100;
      this.nextLevelMessage = `Só mais ${100 - count} para zerar o cinema!`;
    }
    else {
      this.userRank = 'Lenda do Cinema';
      this.rankColor = '#e74c3c';
      this.rankProgress = 100;
      this.nextLevelMessage = 'Você é imbatível!';
    }
  }

  deleteMovie(id:string){
    this.databaseService.deleteDocument('movies',id).then(()=>{
      console.log("Documento excluído com sucesso.")
    }).catch(error=>{
      console.log(error)
    })
  }

  editMovie(movie: MovieInterface) {
    this.selectedMovieForEdit = movie;
    this.showAddMovieModal = true;
  }

  toggleAddMovieModal(){
    this.selectedMovieForEdit = null;
    this.showAddMovieModal = !this.showAddMovieModal; // abre e fecha o modal
  }

  filterMovies(): void {
    const query = this.searchQuery.trim().toLowerCase();
    const sanitizedQuery = query.replace(/[\.\-]/g, '');
  
    if (sanitizedQuery === '') {
      // Se não houver pesquisa, exibe a página atual normalmente
      this.displayedMovies = this.movies.slice(this.currentOffset, this.currentOffset + this.limit);
    } else {
      // Filtra sobre todos os filmes
      const filteredMovies = this.movies.filter(movie => {
        const titleMatch = movie.name ? movie.name.toLowerCase().includes(sanitizedQuery) : false;
        return titleMatch;
      });
  
      // Reinicia o offset para começar da primeira página do resultado filtrado
      this.currentOffset = 0;
      this.displayedMovies = filteredMovies.slice(this.currentOffset, this.currentOffset + this.limit);
    }
  }

  // avançar no layout de filmes (4 por vez)
  showNext() {
    if (this.currentOffset + this.limit < this.movies.length) {
      this.currentOffset += this.limit;
      this.displayedMovies = this.movies.slice(this.currentOffset, this.currentOffset + this.limit);
    }
  }

  // voltar no layout de filmes (4 por vez)
  showPrevious() {
    if (this.currentOffset - this.limit >= 0) {
      this.currentOffset -= this.limit;
      this.displayedMovies = this.movies.slice(this.currentOffset, this.currentOffset + this.limit);
    }
  }
}